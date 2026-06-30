// Grava o conteúdo COMPLETO (verbatim) de cada livro na DESCRIÇÃO LONGA do produto
// correspondente na loja /2026/. O conteúdo vem dos arquivos locais
// content/livros/<slug>.html (gerados por fetch-livros-conteudo.mjs — inteiros,
// des-elementorizados). O template "Produto único" do Elementor renderiza isso.
//
//   $env:WP_AUTH_2026="login_2026:senha-de-aplicativo"   (ou WP_AUTH)
//   node _scripts/enrich-livros.mjs            # DRY-RUN: mostra o que gravaria
//   node _scripts/enrich-livros.mjs --apply    # grava nas descrições do /2026/
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SITE2026 = "https://saudefrugal.com.br/2026/wp-json/wp/v2";
const APPLY = process.argv.includes("--apply");
const RAW = process.env.WP_AUTH_2026 || process.env.WP_AUTH || "";
const AUTH = "Basic " + Buffer.from(RAW).toString("base64");

if (APPLY && !RAW) {
  console.error('ERRO: para --apply defina WP_AUTH_2026 (ou WP_AUTH). Ex: $env:WP_AUTH_2026="login:senha-de-aplicativo"');
  process.exit(1);
}

// slug do arquivo content/livros/<slug>.html  ->  ID do produto na loja /2026/
const BOOKS = [
  { slug: "dieta-do-eden", label: "A Dieta do Éden", dest: 768535 },
  { slug: "jejum-higienista", label: "Jejum Higienista", dest: 768536 },
  { slug: "dieta-anticancer", label: "A Dieta Anticâncer", dest: 768537 },
  { slug: "dieta-antidiabetes", label: "Dieta Antidiabetes", dest: 768538 },
  { slug: "nutricao-vegana", label: "Nutrição Vegana", dest: 768539 },
  { slug: "vegan-fitness", label: "Vegan Fitness", dest: 768540 },
  { slug: "doces-delicias", label: "Doces Delícias", dest: 768541 },
  { slug: "crulinaria-frugal", label: "CRUlinária Frugal", dest: 768126 },
  { slug: "cozinhando-sem-o-fogao", label: "Cozinhando sem o Fogão", dest: 766801 },
  { slug: "veganismo-para-pais", label: "Veganismo para bebês, mães e pais", dest: 768544 },
];

// fetch tolerante: alguns endpoints do /2026/ imprimem Notice antes do JSON
async function req(url, opts) {
  const r = await fetch(url, opts);
  const text = await r.text();
  let json = null;
  const s = text.search(/[[{]/), e = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
  if (s >= 0 && e > s) { try { json = JSON.parse(text.slice(s, e + 1)); } catch {} }
  return { ok: r.ok, status: r.status, json };
}
const textLen = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
const readContent = (slug) => readFileSync(join(process.cwd(), "content", "livros", `${slug}.html`), "utf8");

// Preflight de credencial no /2026/ (só quando vai gravar)
if (APPLY) {
  const me = await req(`${SITE2026}/users/me?_fields=id,name`, { headers: { Authorization: AUTH } });
  if (!me.ok) {
    console.error(`ERRO de autenticação no /2026/: HTTP ${me.status}. Verifique WP_AUTH_2026 (login, não e-mail).`);
    process.exit(1);
  }
  console.log(`Autenticado no /2026/ como: ${me.json?.name} (#${me.json?.id})\n`);
}

let ok = 0, fail = 0;
for (const b of BOOKS) {
  let html;
  try { html = readContent(b.slug); } catch {
    console.log(`✗ ${b.label}: arquivo content/livros/${b.slug}.html não encontrado`);
    fail++; continue;
  }
  const chars = textLen(html);

  if (!APPLY) {
    console.log(`• ${b.label} → produto #${b.dest}: gravaria ${chars} chars [dry-run]`);
    continue;
  }
  // Confere o produto-alvo antes de gravar (segurança contra ID errado)
  const cur = await req(`${SITE2026}/product/${b.dest}?_fields=id,slug,title`, {
    headers: { Authorization: AUTH },
  });
  const alvo = (cur.json?.title?.rendered || cur.json?.slug || "(?)").replace(/<[^>]+>/g, "");

  const r = await req(`${SITE2026}/product/${b.dest}`, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify({ content: html }),
  });
  if (r.ok) {
    console.log(`✓ ${b.label} → #${b.dest} "${alvo}": descrição atualizada (${chars} chars)`);
    ok++;
  } else {
    console.log(`✗ ${b.label} → #${b.dest}: FALHA HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 160)}`);
    fail++;
  }
}
console.log(
  `\n==> ${APPLY ? "Concluído" : "DRY-RUN"}: ${APPLY ? ok + " gravados, " : ""}${fail} falhas.` +
    (APPLY ? "" : " Rode com --apply para gravar.")
);
