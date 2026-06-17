// SEGUNDA PASSADA — conteúdo COMPLETO a partir das PÁGINAS dos livros.
//
// O conteúdo real e completo de cada livro vive em uma PÁGINA dedicada (Elementor)
// na raiz saudefrugal.com.br — não no produto WooCommerce. Este script puxa o
// `content.rendered` dessa página via REST (forma mais fiel: sem scraping de tema)
// e grava no produto correspondente do /2026/.
//
//   $env:WP_AUTH="usuario:application-password"
//   node _scripts/enrich-livros.mjs            # dry-run + preview-enriquecido.html
//   node _scripts/enrich-livros.mjs --apply    # grava o conteúdo completo no /2026/
//
// PREENCHA o campo `page` (slug da PÁGINA na raiz) de cada livro. Confirme a URL
// exata com o cliente — há muitas LPs/duplicatas parecidas. page:null = pulado.
import { writeFileSync } from "node:fs";

const ROOT = "https://saudefrugal.com.br/wp-json/wp/v2";
const SITE2026 = "https://saudefrugal.com.br/2026/wp-json/wp/v2";
const AUTH = "Basic " + Buffer.from(process.env.WP_AUTH || "").toString("base64");
const APPLY = process.argv.includes("--apply");

// WP_AUTH só é necessário para GRAVAR (--apply). O dry-run lê apenas páginas
// públicas da raiz, então roda sem credencial e gera o preview.
if (APPLY && !process.env.WP_AUTH) {
  console.error('ERRO: para --apply defina WP_AUTH. Ex: $env:WP_AUTH="usuario:application-password"');
  process.exit(1);
}

// label, dest = ID do produto no /2026/, page = slug da PÁGINA completa na raiz.
// Páginas confirmadas pelo cliente (URLs enviadas). combo:true = sem página
// própria (conteúdo é a descrição do produto, já migrada) → não enriquece.
const BOOKS = [
  { label: "A Dieta do Éden", dest: 768535, page: "a-dieta-do-eden" }, // #327
  { label: "Jejum Higienista", dest: 768536, page: "jejum-higienista-a-cirurgia-da-natureza" }, // #425
  { label: "A Dieta Anticâncer", dest: 768537, page: "adietaanticancer" }, // #509
  { label: "Dieta Antidiabetes", dest: 768538, page: "dieta-antidiabetes" }, // #12665
  { label: "Nutrição Vegana", dest: 768539, page: "nutricao-vegana" }, // #435
  { label: "Vegan Fitness", dest: 768540, page: "vegan-fitness-receitas-do-atleta-natural" }, // #6622
  { label: "Doces Delícias", dest: 768541, page: "crulinaria-frugal-doces-delicias" }, // #366
  { label: "CRUlinária Frugal", dest: 768126, page: "crulinaria-frugal-receitas-do-paraiso" }, // #6621
  { label: "Cozinhando sem o Fogão", dest: 766801, page: "delicias-da-natureza-cozinhando-sem-o-fogao" }, // #7271
  { label: "Veganismo para pais, mães e bebês", dest: 768544, page: "veganismo-para-bebes-maes-e-pais" }, // #444
  { label: "Combo 6 livros didáticos", dest: 768545, page: null, combo: true },
  { label: "Combo 10 Livros", dest: 768546, page: null, combo: true },
  { label: "Livros de receitas | 4 livros", dest: 768547, page: null, combo: true },
  { label: "Combo Saúde Frugal (presente)", dest: 768548, page: null, combo: true },
];

async function getJson(url, auth = false) {
  const r = await fetch(url, auth ? { headers: { Authorization: AUTH } } : {});
  if (!r.ok) return null;
  return r.json();
}
const textLen = (html) => (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;

// Limpeza mínima — preserva o conteúdo "exatamente completo", só remove o
// shortcode [gtranslate] que vaza no content.rendered.
const clean = (html) => (html || "").replace(/\[gtranslate\]/gi, "").trim();

const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const rows = [];
let okWrite = 0, failed = 0, missing = 0;

for (const b of BOOKS) {
  if (!b.page) {
    const why = b.combo ? "combo — sem página (usa descrição do produto, já migrada)" : "FALTA a URL da página";
    console.log(`· ${b.label}: ${why} — pulado`);
    rows.push({ ...b, status: b.combo ? "combo-sem-pagina" : "sem-pagina-config" });
    missing++;
    continue;
  }
  const arr = await getJson(`${ROOT}/pages?slug=${b.page}&_fields=id,slug,link,title,content`);
  const p = (arr || []).find((x) => x.slug === b.page) || (arr || [])[0];
  if (!p) {
    console.log(`✗ ${b.label}: página '${b.page}' não encontrada na raiz`);
    rows.push({ ...b, status: "pagina-inexistente" });
    failed++;
    continue;
  }
  const content = clean(p.content?.rendered);
  const chars = textLen(content);
  console.log(`• ${b.label}: página #${p.id} (${b.page}) → ${chars} chars de texto${APPLY ? "" : " [preview]"}`);
  rows.push({ ...b, pageId: p.id, link: p.link, chars, content, status: "ok" });

  if (APPLY) {
    const r = await fetch(`${SITE2026}/product/${b.dest}`, {
      method: "POST",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (r.ok) {
      console.log(`  ✓ gravado em #${b.dest} (${chars} chars)`);
      okWrite++;
    } else {
      console.log(`  ✗ falha ao gravar #${b.dest}: ${r.status}`);
      failed++;
    }
  }
}

// Preview HTML para conferência antes do --apply
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preview — conteúdo COMPLETO dos livros (das páginas)</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1.2rem;color:#1f261d;background:#f6f2e9}
h2{margin-top:2.5rem;border-top:2px solid #2e5e3a;padding-top:1rem;color:#1b3a25}
.meta{font-size:.85rem;color:#7c8276}.meta a{color:#c25e3a}
.box{background:#fff;border:1px solid #d9d2bf;border-radius:10px;padding:1rem 1.3rem}
.box img{max-width:100%}.miss{color:#a44a2b}</style></head><body>
<h1>Preview — conteúdo completo dos livros (puxado das páginas)</h1>
<p class="meta">Texto exato do content.rendered de cada página (só removido o shortcode [gtranslate]). Confira antes de gravar com --apply.</p>
<ol>${rows.map((r) => `<li>${esc(r.label)} — ${r.status === "ok" ? r.chars + " chars" : '<span class="miss">' + r.status + "</span>"}</li>`).join("")}</ol>
${rows
  .filter((r) => r.status === "ok")
  .map(
    (r) => `<h2>${esc(r.label)}</h2>
<p class="meta">Página: <a href="${r.link}" target="_blank">${esc(r.link)}</a> · #${r.pageId} · ${r.chars} chars · destino produto #${r.dest}</p>
<div class="box">${r.content}</div>`
  )
  .join("\n")}
</body></html>`;
writeFileSync("preview-enriquecido.html", html, "utf8");

const ready = rows.filter((r) => r.status === "ok").length;
console.log(
  `\n==> ${APPLY ? "Concluído" : "DRY-RUN"}: ${ready} páginas capturadas` +
    `${APPLY ? `, ${okWrite} gravadas` : ""}, ${missing} sem URL configurada, ${failed} falhas. Preview: preview-enriquecido.html`
);
if (!APPLY) console.log("Confira preview-enriquecido.html. Falta preencher os 'page:null' antes de gravar tudo.");
