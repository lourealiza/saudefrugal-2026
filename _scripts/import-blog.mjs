// Importa os posts do export WordPress (../blogatual.xml) para o projeto:
//   content/blog/<slug>.html  -> conteúdo limpo de cada post
//   content/blog/index.json   -> manifesto (slug, title, date, excerpt, categories)
// Des-elementoriza/limpa o HTML igual ao fetch dos livros. Read-only no XML.
//
//   node _scripts/import-blog.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const XML_PATH = "../blogatual.xml";
const xml = readFileSync(XML_PATH, "utf8");

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
    .replace(/\[[^\]]+\]/g, ""); // remove shortcodes [vc_row] etc.

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
  // posts antigos costumam separar parágrafos por linha em branco
  s = s.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

const cdata = (s) => {
  const m = /<!\[CDATA\[([\s\S]*?)\]\]>/.exec(s || "");
  return (m ? m[1] : s || "").trim();
};
const pick = (block, tag) => {
  const m = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`).exec(block);
  return m ? cdata(m[1]) : "";
};
const textOnly = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
mkdirSync("content/blog", { recursive: true });

const manifest = [];
for (const block of items) {
  const type = pick(block, "wp:post_type");
  const status = pick(block, "wp:status");
  if (type !== "post" || status !== "publish") continue;

  const title = pick(block, "title").replace(/\s+/g, " ").trim();
  const slug = pick(block, "wp:post_name") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const date = pick(block, "wp:post_date").slice(0, 10);
  const rawContent = pick(block, "content:encoded");
  const content = deElementorize(rawContent);
  let excerpt = textOnly(deElementorize(pick(block, "excerpt:encoded")));
  if (!excerpt) excerpt = textOnly(content).slice(0, 180).replace(/\s+\S*$/, "") + "…";

  const categories = [...block.matchAll(/<category domain="category"[^>]*>([\s\S]*?)<\/category>/g)]
    .map((m) => cdata(m[1]))
    .filter((c) => c && c.toLowerCase() !== "sem categoria");

  // Ignora templates do Elementor e posts-stub (vazios/só vídeo) muito curtos
  if (!slug || !content || /^elementor-\d+$/i.test(slug)) continue;
  if (textOnly(content).length < 200) {
    console.log(`· pulado (curto): ${slug}`);
    continue;
  }
  writeFileSync(`content/blog/${slug}.html`, content + "\n", "utf8");
  manifest.push({ slug, title, date, excerpt, categories });
  console.log(`✓ ${date} · ${slug} (${textOnly(content).length} chars)`);
}

manifest.sort((a, b) => (a.date < b.date ? 1 : -1)); // mais recentes primeiro
writeFileSync("content/blog/index.json", JSON.stringify(manifest, null, 2), "utf8");
console.log(`\n==> ${manifest.length} posts importados para content/blog/`);
