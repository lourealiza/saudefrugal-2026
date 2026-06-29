// Posts do blog, importados de blogatual.xml por _scripts/import-blog.mjs.
// O manifesto (content/blog/index.json) e o conteúdo (content/blog/<slug>.html)
// são lidos no build (server components / export estático).
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  categories: string[];
};

const dir = join(process.cwd(), "content", "blog");

export const posts: Post[] = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
export const postsBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

export function getPostContent(slug: string): string {
  return readFileSync(join(dir, `${slug}.html`), "utf8");
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d} de ${meses[Number(m) - 1]}. de ${y}`;
}
