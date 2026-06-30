// Baixa o conteúdo completo das PÁGINAS dos livros na raiz e "des-elementoriza":
// remove scripts/styles/comentários, tira TODAS as classes/estilos/atributos
// (exceto href/src/alt), deixando HTML semântico limpo para o nosso design system.
// Salva em content/livros/<slug>.html. Read-only na raiz (páginas públicas).
//
//   node _scripts/fetch-livros-conteudo.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const ROOT = "https://saudefrugal.com.br/wp-json/wp/v2";

// slug da rota interna -> slug da PÁGINA na raiz
const MAP = [
  ["dieta-do-eden", "a-dieta-do-eden"],
  ["jejum-higienista", "jejum-higienista-a-cirurgia-da-natureza"],
  ["dieta-anticancer", "adietaanticancer"],
  ["dieta-antidiabetes", "dieta-antidiabetes"],
  ["nutricao-vegana", "nutricao-vegana"],
  ["vegan-fitness", "vegan-fitness-receitas-do-atleta-natural"],
  ["doces-delicias", "crulinaria-frugal-doces-delicias"],
  ["crulinaria-frugal", "crulinaria-frugal-receitas-do-paraiso"],
  ["cozinhando-sem-o-fogao", "delicias-da-natureza-cozinhando-sem-o-fogao"],
  ["veganismo-para-pais", "veganismo-para-bebes-maes-e-pais"],
];

const KEEP_ATTR = {
  a: ["href"],
  img: ["src", "alt"],
  iframe: ["src"],
};

function deElementorize(html) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    // ícones e botões do Elementor não fazem sentido sem o tema
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<i\b[^>]*>\s*<\/i>/gi, "")
    .replace(/<button[\s\S]*?<\/button>/gi, "")
    .replace(/\[gtranslate\]/gi, "");

  // Strip attributes, mantendo só o whitelist por tag
  s = s.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)(\/?)>/g, (m, tagRaw, attrs, selfClose) => {
    const tag = tagRaw.toLowerCase();
    const allow = KEEP_ATTR[tag] || [];
    const kept = [];
    for (const name of allow) {
      const re = new RegExp(`${name}\\s*=\\s*("[^"]*"|'[^']*')`, "i");
      const mm = re.exec(attrs);
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

  // Desempacota wrappers puramente estruturais (mantém o conteúdo interno)
  s = s.replace(/<\/?(?:section|figure|figcaption|span|article|header|footer|main)>/gi, "");

  // Limpa &nbsp; soltos e remove nós vazios repetidamente (divs/p só com espaço)
  s = s.replace(/&nbsp;/gi, " ");
  for (let i = 0; i < 6; i++) {
    s = s
      .replace(/<(div|p)>\s*<\/\1>/gi, "")
      .replace(/<div>\s*(<div>)/gi, "$1") // colapsa div>div imediato
      .replace(/(<\/div>)\s*<\/div>/gi, "$1");
  }
  // Colapsa espaços/linhas em excesso
  s = s.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

// Remove sobras de ficha de loja antiga (pagamento, formato, amostra, etc.) —
// o checkout/preço fica na coluna lateral, não no corpo editorial do livro.
function polish(s) {
  // Remove um <p>/<div> FOLHA (sem p/div aninhado) que CONTENHA o termo de ficha.
  const dropLeafWith = (kw) => {
    const re = new RegExp(
      `<(p|div)>(?:(?!</?(?:p|div)>)[\\s\\S])*?(?:${kw})(?:(?!</?(?:p|div)>)[\\s\\S])*?</\\1>`,
      "gi"
    );
    s = s.replace(re, "");
  };
  [
    "Pagamento via",
    "Formato:\\s*Impresso",
    "Tamanho:",
    "N[úu]mero de p[áa]ginas",
    "p[áa]ginas aproximadamente",
    "Amostra\\s+(?:gratuita|de\\s+30|GRATUITA)",
    "refer[êe]ncias bibliogr[áa]ficas do livro no final",
    "Disponibilidade",
  ].forEach(dropLeafWith);
  // Link solto de "Amostra ..." (CTA do Drive)
  s = s.replace(/<a\b[^>]*>\s*Amostra[\s\S]*?<\/a>/gi, "");
  // Limpa vazios após remover os blocos
  for (let i = 0; i < 4; i++) {
    s = s.replace(/<(div|p)>\s*<\/\1>/gi, "");
  }
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

const textLen = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;

mkdirSync("content/livros", { recursive: true });

let ok = 0;
for (const [slug, pageSlug] of MAP) {
  const r = await fetch(`${ROOT}/pages?slug=${pageSlug}&_fields=id,slug,content`).then((x) =>
    x.ok ? x.json() : null
  );
  const p = (r || []).find((x) => x.slug === pageSlug) || (r || [])[0];
  if (!p) {
    console.log(`✗ ${slug}: página '${pageSlug}' não encontrada`);
    continue;
  }
  // --polish remove sobras de loja; padrão = conteúdo COMPLETO/verbatim (inteiro).
  const POLISH = process.argv.includes("--polish");
  const base = deElementorize(p.content?.rendered || "");
  const cleaned = POLISH ? polish(base) : base;
  writeFileSync(`content/livros/${slug}.html`, cleaned + "\n", "utf8");
  console.log(`✓ ${slug}: ${textLen(cleaned)} chars de texto (de page #${p.id})`);
  ok++;
}
console.log(`\n==> ${ok}/${MAP.length} arquivos gerados em content/livros/`);
