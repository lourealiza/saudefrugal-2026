// Gera um preview HTML com o conteúdo ORIGINAL (verbatim) dos livros, puxado
// dos produtos WooCommerce do site raiz. Read-only: não grava nada no site.
import { writeFileSync } from "node:fs";

const ROOT = "https://saudefrugal.com.br/wp-json/wp/v2";
const SITE2026 = "https://saudefrugal.com.br/2026/wp-json/wp/v2";
const AUTH = "Basic " + Buffer.from(process.env.WP_AUTH || "").toString("base64");

// Livro (rótulo) -> slug do produto original na raiz
const BOOKS = [
  ["A Dieta do Éden", "dieta-do-eden"],
  ["Jejum Higienista", "jejum-higienista"],
  ["A Dieta Anticâncer", "cancer-tratamentos-naturais"],
  ["Dieta Antidiabetes", "dieta-antidiabetes-o-estilo-de-vida-que-combate-a-diabetes"],
  ["Nutrição Vegana", "nutricao-vegana"],
  ["Vegan Fitness", "vegan-fitness"],
  ["Doces Delícias", "doces-delicias"],
  ["CRUlinária Frugal", "crulinaria-frugal"],
  ["Cozinhando sem o Fogão", "delicias-da-natureza-cozinhando-sem-o-fogao"],
  ["Veganismo para pais, mães e bebês", "veganismo-para-os-pais"],
  ["Combo 6 livros didáticos", "combo-6-livros-didaticos"],
  ["Combo 10 Livros", "combo-10-livros"],
  ["Livros de receitas | 4 livros", "livros-de-receitas-naturais"],
  ["Combo Saúde Frugal (presente)", "combo-saudefrugal-dieta-do-eden"],
];

async function getJson(url, auth = false) {
  const r = await fetch(url, auth ? { headers: { Authorization: AUTH } } : {});
  if (!r.ok) return null;
  return r.json();
}

// Catálogo de produtos do /2026/ para detectar alvo existente
const dest = await getJson(`${SITE2026}/product?per_page=100&_fields=id,slug,title`, true);
const destList = (dest || []).map((p) => ({
  id: p.id,
  slug: p.slug,
  title: (p.title?.rendered || "").toLowerCase(),
}));
function findDest(label, slug) {
  const key = slug.split("-").slice(0, 2).join("-");
  return (
    destList.find((d) => d.slug === slug) ||
    destList.find((d) => d.slug.includes(key)) ||
    destList.find((d) => label.toLowerCase().split(" ").some((w) => w.length > 4 && d.title.includes(w)))
  );
}

const rows = [];
for (const [label, slug] of BOOKS) {
  const arr = await getJson(`${ROOT}/product?slug=${slug}&_fields=id,link,title,content,excerpt`);
  const p = arr && arr[0];
  const content = p?.content?.rendered || "";
  const excerpt = p?.excerpt?.rendered || "";
  const d = findDest(label, slug);
  rows.push({
    label,
    slug,
    found: !!p,
    link: p?.link || "",
    title: p?.title?.rendered || "",
    chars: content.replace(/<[^>]+>/g, "").trim().length,
    content,
    excerpt,
    dest: d ? `#${d.id} (${d.slug})` : "— não existe no /2026/ (criar)",
  });
  process.stdout.write(`• ${label}: ${p ? content.replace(/<[^>]+>/g, "").trim().length + " chars" : "NÃO ACHADO"} | alvo: ${d ? d.slug : "criar"}\n`);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preview — Conteúdo original dos livros</title>
<style>
 body{font:16px/1.6 system-ui,sans-serif;max-width:860px;margin:2rem auto;padding:0 1.2rem;color:#1f261d;background:#f6f2e9}
 h1{font-size:1.8rem} h2{margin-top:2.5rem;border-top:2px solid #2e5e3a;padding-top:1rem;color:#1b3a25}
 .meta{font-size:.85rem;color:#7c8276;margin:.3rem 0 1rem}
 .meta a{color:#c25e3a} .tag{display:inline-block;background:#2e5e3a;color:#fff;font-size:.7rem;padding:.15rem .5rem;border-radius:99px;margin-left:.4rem}
 .box{background:#fff;border:1px solid #d9d2bf;border-radius:10px;padding:1rem 1.3rem}
 .box img{max-width:100%} .warn{color:#a44a2b;font-weight:600}
 .toc a{color:#2e5e3a;text-decoration:none} .toc li{margin:.2rem 0}
</style></head><body>
<h1>Preview — conteúdo <em>original</em> dos livros (verbatim da raiz)</h1>
<p class="meta">Gerado para conferência. Este é o texto exato que será restaurado no /2026/. Nada foi gravado ainda.</p>
<ol class="toc">${rows.map((r, i) => `<li><a href="#b${i}">${esc(r.label)}</a> ${r.found ? "" : '<span class="warn">(não encontrado)</span>'}</li>`).join("")}</ol>
${rows
  .map(
    (r, i) => `<h2 id="b${i}">${esc(r.label)}${r.found ? "" : ' <span class="warn">— NÃO ENCONTRADO</span>'}</h2>
<p class="meta">Original: <a href="${r.link}" target="_blank">${esc(r.title)}</a> · ${r.chars} caracteres de texto<br>
Destino no /2026/: ${esc(r.dest)}</p>
<div class="box">${r.content || "<em>(sem conteúdo)</em>"}</div>`
  )
  .join("\n")}
</body></html>`;

writeFileSync("preview-livros.html", html, "utf8");
const ok = rows.filter((r) => r.found).length;
const missing = rows.filter((r) => !r.dest.includes("#")).length;
console.log(`\n==> preview-livros.html gerado. ${ok}/${rows.length} originais encontrados. ${missing} sem produto no /2026/ (a criar).`);
