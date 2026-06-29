// One-off: baixa as capas (featured image) e captura o link de compra de cada
// livro/combo da loja, direto da API publica do WooCommerce (saudefrugal.com.br).
//
//   node _scripts/fetch-capas.mjs
//
// Salva as imagens em public/livros/<slug>.<ext> e imprime o mapa
// { slug, link, cover } para ligar em app/loja/page.tsx.
import { writeFileSync, mkdirSync } from "node:fs";

const ROOT = "https://saudefrugal.com.br/wp-json/wp/v2";

// label da loja -> slug do produto na raiz (mesmo mapa da migracao).
const ITEMS = [
  { label: "A Dieta do Éden", slug: "dieta-do-eden" },
  { label: "Jejum Higienista", slug: "jejum-higienista" },
  { label: "A Dieta Anticâncer", slug: "cancer-tratamentos-naturais" },
  { label: "Dieta Antidiabetes", slug: "dieta-antidiabetes-o-estilo-de-vida-que-combate-a-diabetes" },
  { label: "Nutrição Vegana", slug: "nutricao-vegana" },
  { label: "Vegan Fitness", slug: "vegan-fitness" },
  { label: "Doces Delícias", slug: "doces-delicias" },
  { label: "CRUlinária Frugal", slug: "crulinaria-frugal" },
  { label: "Cozinhando sem o Fogão", slug: "delicias-da-natureza-cozinhando-sem-o-fogao" },
  { label: "Veganismo para pais, mães e bebês", slug: "veganismo-para-os-pais" },
  { label: "Combo 4 livros de receitas", slug: "livros-de-receitas-naturais" },
  { label: "Combo 10 livros Dr. Corassa", slug: "combo-10-livros" },
  { label: "Combo 6 livros didáticos", slug: "combo-6-livros-didaticos" },
];

mkdirSync("public/livros", { recursive: true });
const out = [];

for (const { label, slug } of ITEMS) {
  const r = await fetch(
    `${ROOT}/product?slug=${slug}&_embed=1&_fields=slug,link,title,_embedded,_links`
  );
  const j = r.ok ? await r.json() : null;
  const p = j && j[0];
  if (!p) {
    console.log(`✗ ${label}: produto não encontrado (slug=${slug})`);
    out.push({ label, slug, status: "sem-produto" });
    continue;
  }
  const cover = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
  if (!cover) {
    console.log(`• ${label}: SEM capa (featured image) — link ok`);
    out.push({ label, slug, link: p.link, cover: "", file: "" });
    continue;
  }
  const ext = (cover.split("?")[0].match(/\.(jpe?g|png|webp)$/i)?.[1] || "jpg").toLowerCase();
  const file = `${slug}.${ext}`;
  const img = await fetch(cover);
  const buf = Buffer.from(await img.arrayBuffer());
  writeFileSync(`public/livros/${file}`, buf);
  console.log(`✓ ${label}: ${file} (${Math.round(buf.length / 1024)}KB) ← ${cover}`);
  out.push({ label, slug, link: p.link, cover, file: `/livros/${file}` });
}

writeFileSync("capas-livros.json", JSON.stringify(out, null, 2), "utf8");
console.log(`\nMapa salvo em capas-livros.json (${out.length} itens).`);
