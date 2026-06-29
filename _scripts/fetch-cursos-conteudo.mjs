// Baixa o conteúdo dos PRODUTOS de curso na loja /2026/ e des-elementoriza,
// salvando em content/cursos/<slug>.html. Read-only (produtos públicos).
//
//   node _scripts/fetch-cursos-conteudo.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const API = "https://saudefrugal.com.br/2026/wp-json/wp/v2";

// slug da rota interna -> slug do PRODUTO no /2026/
const MAP = [
  ["metodo-saude-maxima", "metodo-saude-maxima"],
  ["sorvetes-fit", "sorvetes-fit-naturais"],
  ["lacto-zero", "lacto-zero-leites-e-queijos-vegetais"],
  ["doces-saudaveis", "curso-doces-saudaveis-sem-acucar"],
  ["corpo-perfeito", "programa-corpo-perfeito-vegpower"],
  ["jejum-detox", "jejum-detox"],
];

const KEEP_ATTR = { a: ["href"], img: ["src", "alt"], iframe: ["src"] };

function deElementorize(html) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<i\b[^>]*>\s*<\/i>/gi, "")
    .replace(/<button[\s\S]*?<\/button>/gi, "")
    .replace(/\[gtranslate\]/gi, "")
    .replace(/\[[^\]]+\]/g, "");

  s = s.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)(\/?)>/g, (m, tagRaw, attrs, selfClose) => {
    const tag = tagRaw.toLowerCase();
    const allow = KEEP_ATTR[tag] || [];
    const kept = [];
    for (const name of allow) {
      const mm = new RegExp(`${name}\\s*=\\s*("[^"]*"|'[^']*')`, "i").exec(attrs);
      if (mm) kept.push(`${name}=${mm[1]}`);
    }
    if (tag === "a" && kept.length) kept.push('target="_blank"', 'rel="noopener"');
    if (tag === "img") {
      if (!kept.some((k) => k.startsWith("alt="))) kept.push('alt=""');
      kept.push('loading="lazy"');
    }
    if (tag === "iframe") kept.push("allowfullscreen");
    return `<${tag}${kept.length ? " " + kept.join(" ") : ""}${selfClose ? " /" : ""}>`;
  });

  s = s.replace(/<\/?(?:section|figure|figcaption|span|article|header|footer|main|center)>/gi, "");
  s = s.replace(/&nbsp;/gi, " ");
  for (let i = 0; i < 6; i++) {
    s = s.replace(/<(div|p)>\s*<\/\1>/gi, "").replace(/<div>\s*(<div>)/gi, "$1").replace(/(<\/div>)\s*<\/div>/gi, "$1");
  }
  return s.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

const textLen = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;

mkdirSync("content/cursos", { recursive: true });
let ok = 0;
for (const [slug, prod] of MAP) {
  const r = await fetch(`${API}/product?slug=${prod}&_fields=id,slug,content`).then((x) =>
    x.ok ? x.json() : null
  );
  const p = (r || []).find((x) => x.slug === prod) || (r || [])[0];
  if (!p) {
    console.log(`✗ ${slug}: produto '${prod}' não encontrado`);
    continue;
  }
  const cleaned = deElementorize(p.content?.rendered || "");
  writeFileSync(`content/cursos/${slug}.html`, cleaned + "\n", "utf8");
  console.log(`✓ ${slug}: ${textLen(cleaned)} chars (de #${p.id})`);
  ok++;
}
console.log(`\n==> ${ok}/${MAP.length} arquivos em content/cursos/`);
