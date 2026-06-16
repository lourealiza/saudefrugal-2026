// Lista TODOS os produtos do WordPress /2026/ (id, slug, título, status e
// tamanho do conteúdo atual). Read-only — não grava nada.
// Use para montar o mapa explícito livro -> ID em restore-livros.mjs.
//
//   $env:WP_AUTH="usuario:application-password"; node _scripts/list-2026-produtos.mjs
import { writeFileSync } from "node:fs";

const SITE2026 = "https://saudefrugal.com.br/2026/wp-json/wp/v2";
const AUTH = "Basic " + Buffer.from(process.env.WP_AUTH || "").toString("base64");

if (!process.env.WP_AUTH) {
  console.error('ERRO: defina WP_AUTH. Ex: $env:WP_AUTH="usuario:application-password"');
  process.exit(1);
}

const textLen = (html) => (html || "").replace(/<[^>]+>/g, "").trim().length;

// Pagina por todos os produtos (qualquer status: publish, draft, etc.)
const all = [];
for (let page = 1; page <= 20; page++) {
  const url = `${SITE2026}/product?per_page=100&page=${page}&status=any&_fields=id,slug,status,title,content`;
  const r = await fetch(url, { headers: { Authorization: AUTH } });
  if (!r.ok) {
    if (page === 1) {
      console.error(`ERRO ${r.status} ao listar produtos. Verifique WP_AUTH/endpoint.`);
      process.exit(1);
    }
    break; // acabou a paginação
  }
  const arr = await r.json();
  if (!arr.length) break;
  all.push(...arr);
  if (arr.length < 100) break;
}

all.sort((a, b) => a.slug.localeCompare(b.slug));
console.log(`\n${all.length} produtos no /2026/:\n`);
for (const p of all) {
  console.log(
    `#${p.id}\t[${p.status}]\t${textLen(p.content?.rendered).toString().padStart(6)} ch\t${p.slug}\t— ${(p.title?.rendered || "").replace(/<[^>]+>/g, "")}`
  );
}

writeFileSync(
  "produtos-2026.json",
  JSON.stringify(
    all.map((p) => ({
      id: p.id,
      slug: p.slug,
      status: p.status,
      title: (p.title?.rendered || "").replace(/<[^>]+>/g, ""),
      chars: textLen(p.content?.rendered),
    })),
    null,
    2
  ),
  "utf8"
);
console.log(`\n==> Salvo em produtos-2026.json (${all.length} itens).`);
