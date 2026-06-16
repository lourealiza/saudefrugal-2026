// SEGUNDA PASSADA — enriquecimento.
// Para livros cujo campo `content` do produto vem curto (porque a descrição real
// é montada com Elementor e NÃO fica em post_content), este script puxa o HTML
// RENDERIZADO da página pública do produto na raiz, extrai o miolo do conteúdo
// e (opcionalmente) grava no produto correspondente do /2026/.
//
// Fluxo seguro: gera preview-enriquecido.html para conferência. Só grava com --apply.
//
//   $env:WP_AUTH="usuario:application-password"
//   node _scripts/enrich-livros.mjs            # dry-run + preview-enriquecido.html
//   node _scripts/enrich-livros.mjs --apply    # grava o conteúdo extraído no /2026/
//
// IMPORTANTE: a extração do miolo é best-effort (depende da marcação do tema/
// Elementor). SEMPRE confira o preview antes do --apply e ajuste PICK_SELECTORS
// se o bloco capturado vier errado.
import { writeFileSync } from "node:fs";

const ROOT = "https://saudefrugal.com.br/wp-json/wp/v2";
const SITE2026 = "https://saudefrugal.com.br/2026/wp-json/wp/v2";
const AUTH = "Basic " + Buffer.from(process.env.WP_AUTH || "").toString("base64");
const APPLY = process.argv.includes("--apply");

if (!process.env.WP_AUTH) {
  console.error('ERRO: defina WP_AUTH. Ex: $env:WP_AUTH="usuario:application-password"');
  process.exit(1);
}

// Mesmos livros/IDs da 1ª migração. `enrich:false` pula (ex.: combos, que são
// curtos por natureza e não precisam de enriquecimento).
const BOOKS = [
  { label: "A Dieta do Éden", src: "dieta-do-eden", dest: 768535, enrich: true },
  { label: "Jejum Higienista", src: "jejum-higienista", dest: 768536, enrich: true },
  { label: "A Dieta Anticâncer", src: "cancer-tratamentos-naturais", dest: 768537, enrich: true },
  { label: "Dieta Antidiabetes", src: "dieta-antidiabetes-o-estilo-de-vida-que-combate-a-diabetes", dest: 768538, enrich: true },
  { label: "Nutrição Vegana", src: "nutricao-vegana", dest: 768539, enrich: true },
  { label: "Vegan Fitness", src: "vegan-fitness", dest: 768540, enrich: true },
  { label: "Doces Delícias", src: "doces-delicias", dest: 768541, enrich: true },
  { label: "CRUlinária Frugal", src: "crulinaria-frugal", dest: 768126, enrich: true },
  { label: "Cozinhando sem o Fogão", src: "delicias-da-natureza-cozinhando-sem-o-fogao", dest: 766801, enrich: true },
  { label: "Veganismo para pais, mães e bebês", src: "veganismo-para-os-pais", dest: 768544, enrich: true },
  { label: "Combo 6 livros didáticos", src: "combo-6-livros-didaticos", dest: 768545, enrich: false },
  { label: "Combo 10 Livros", src: "combo-10-livros", dest: 768546, enrich: false },
  { label: "Livros de receitas | 4 livros", src: "livros-de-receitas-naturais", dest: 768547, enrich: false },
  { label: "Combo Saúde Frugal (presente)", src: "combo-saudefrugal-dieta-do-eden", dest: 768548, enrich: false },
];

// Seletores tentados em ordem para isolar o miolo do conteúdo na página renderizada.
// Ajuste aqui se o preview vier com bloco errado.
const PICK_SELECTORS = [
  { tag: "div", attr: "class", needle: "elementor-widget-theme-post-content" },
  { tag: "div", attr: "class", needle: "woocommerce-product-details__short-description" },
  { tag: "div", attr: "class", needle: "entry-content" },
  { tag: "main", attr: null, needle: null },
  { tag: "article", attr: null, needle: null },
];

async function getJson(url, auth = false) {
  const r = await fetch(url, auth ? { headers: { Authorization: AUTH } } : {});
  if (!r.ok) return null;
  return r.json();
}
const textLen = (html) => (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;

function stripChrome(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<(header|footer|nav)[\s\S]*?<\/\1>/gi, "");
}

// Extrai o primeiro bloco que casa com um seletor (captura por balanceamento simples
// de <tag ...> ... </tag>). Best-effort — confira sempre no preview.
function extractBlock(html, sel) {
  const open = sel.attr
    ? new RegExp(`<${sel.tag}\\b[^>]*\\b${sel.attr}\\s*=\\s*["'][^"']*${sel.needle}[^"']*["'][^>]*>`, "i")
    : new RegExp(`<${sel.tag}\\b[^>]*>`, "i");
  const m = open.exec(html);
  if (!m) return null;
  let i = m.index + m[0].length;
  const openTag = new RegExp(`<${sel.tag}\\b`, "gi");
  const closeTag = new RegExp(`</${sel.tag}>`, "gi");
  let depth = 1;
  openTag.lastIndex = i;
  closeTag.lastIndex = i;
  while (depth > 0) {
    const no = openTag.exec(html);
    const nc = closeTag.exec(html);
    if (!nc) return html.slice(m.index + m[0].length); // sem fechamento: pega o resto
    if (no && no.index < nc.index) {
      depth++;
      closeTag.lastIndex = no.index + 1;
    } else {
      depth--;
      i = nc.index;
      openTag.lastIndex = nc.index + 1;
    }
  }
  return html.slice(m.index + m[0].length, i);
}

function pickContent(rawHtml) {
  const html = stripChrome(rawHtml);
  for (const sel of PICK_SELECTORS) {
    const block = extractBlock(html, sel);
    if (block && textLen(block) > 200) {
      return { html: block.trim(), via: sel.needle || sel.tag };
    }
  }
  return { html: "", via: "—" };
}

const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const rows = [];
let ok = 0, failed = 0, skipped = 0;

for (const b of BOOKS) {
  if (!b.enrich) {
    skipped++;
    continue;
  }
  const arr = await getJson(`${ROOT}/product?slug=${b.src}&_fields=id,link,title,content`);
  const s = arr && arr[0];
  if (!s?.link) {
    console.log(`✗ ${b.label}: produto/origem não encontrado (slug=${b.src})`);
    rows.push({ ...b, status: "sem-origem" });
    failed++;
    continue;
  }
  const productChars = textLen(s.content?.rendered);
  const page = await fetch(s.link).then((r) => (r.ok ? r.text() : null)).catch(() => null);
  if (!page) {
    console.log(`✗ ${b.label}: não consegui baixar a página ${s.link}`);
    rows.push({ ...b, link: s.link, status: "sem-pagina" });
    failed++;
    continue;
  }
  const { html: picked, via } = pickContent(page);
  const pickedChars = textLen(picked);

  console.log(
    `• ${b.label}: campo content=${productChars} ch · renderizado capturado=${pickedChars} ch (via ${via})` +
      (APPLY ? "" : " [preview]")
  );
  rows.push({ ...b, link: s.link, productChars, pickedChars, via, picked, status: "ok" });

  if (APPLY && pickedChars > productChars) {
    const r = await fetch(`${SITE2026}/product/${b.dest}`, {
      method: "POST",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify({ content: picked }),
    });
    if (r.ok) {
      console.log(`  ✓ gravado em #${b.dest} (${pickedChars} ch)`);
      ok++;
    } else {
      console.log(`  ✗ falha ao gravar #${b.dest}: ${r.status}`);
      failed++;
    }
  } else if (APPLY) {
    console.log(`  – pulado: capturado (${pickedChars}) não é maior que o atual (${productChars})`);
    skipped++;
  }
}

// Preview HTML
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preview — conteúdo enriquecido (renderizado)</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:880px;margin:2rem auto;padding:0 1.2rem;color:#1f261d;background:#f6f2e9}
h2{margin-top:2.5rem;border-top:2px solid #2e5e3a;padding-top:1rem;color:#1b3a25}
.meta{font-size:.85rem;color:#7c8276}.box{background:#fff;border:1px solid #d9d2bf;border-radius:10px;padding:1rem 1.3rem}
.box img{max-width:100%}</style></head><body>
<h1>Preview — conteúdo enriquecido (extraído da página renderizada)</h1>
<p class="meta">Confira o bloco capturado de cada livro. Se algum vier errado, ajuste PICK_SELECTORS em _scripts/enrich-livros.mjs e rode de novo. Nada é gravado até usar --apply.</p>
${rows
  .filter((r) => r.status === "ok")
  .map(
    (r) => `<h2>${esc(r.label)}</h2>
<p class="meta">Origem: <a href="${r.link}" target="_blank">${esc(r.link)}</a> · campo content ${r.productChars} ch · capturado ${r.pickedChars} ch (via ${esc(r.via)}) · destino #${r.dest}</p>
<div class="box">${r.picked || "<em>(nada capturado — ajuste os seletores)</em>"}</div>`
  )
  .join("\n")}
</body></html>`;
writeFileSync("preview-enriquecido.html", html, "utf8");

console.log(
  `\n==> ${APPLY ? "Concluído" : "DRY-RUN"}: ${rows.filter((r) => r.status === "ok").length} processados` +
    `${APPLY ? `, ${ok} gravados` : ""}, ${failed} falhas, ${skipped} pulados. Preview: preview-enriquecido.html`
);
if (!APPLY) console.log("Confira preview-enriquecido.html e, se ok, rode com --apply.");
