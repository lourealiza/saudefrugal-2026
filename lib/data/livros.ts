// Fonte única dos livros. O checkout é no WooCommerce (saudefrugal.com.br):
//   buyUrl  -> página /product/ do WooCommerce (botão "Comprar")
//   pageSlug-> slug da PÁGINA na raiz de onde vem o conteúdo completo
//             (content/livros/<slug>.html, gerado por _scripts/fetch-livros-conteudo.mjs)
// Combos não têm página de conteúdo (pageSlug: null) — usam só o resumo.

export type LivroCategoria = "Saúde" | "Receitas" | "Família" | "Combo";

export type Livro = {
  slug: string; // slug da rota interna: /loja/<slug>
  title: string;
  subtitle?: string;
  tag: string;
  categoria: LivroCategoria;
  c1: string;
  c2: string;
  buyUrl: string;
  pageSlug: string | null;
  excerpt: string;
};

const WC = "https://saudefrugal.com.br/product";

export const livros: Livro[] = [
  {
    slug: "dieta-do-eden",
    title: "A Dieta do Éden",
    subtitle: "O guia ao crudivorismo, a dieta natural ao ser humano",
    tag: "Alimentação natural",
    categoria: "Saúde",
    c1: "#5a8a5a",
    c2: "#234d2e",
    buyUrl: `${WC}/dieta-do-eden/`,
    pageSlug: "a-dieta-do-eden",
    excerpt:
      "Existe um combustível ideal para o corpo humano? O livro de partida do Dr. Corassa sobre a alimentação que previne doenças e aumenta a longevidade.",
  },
  {
    slug: "jejum-higienista",
    title: "Jejum Higienista",
    subtitle: "A cirurgia da natureza",
    tag: "Jejum",
    categoria: "Saúde",
    c1: "#3f7a4c",
    c2: "#14271a",
    buyUrl: `${WC}/jejum-higienista/`,
    pageSlug: "jejum-higienista-a-cirurgia-da-natureza",
    excerpt:
      "O primeiro livro de jejum científico do Brasil. Como destravar o poder de regeneração do corpo humano — a cura que vem de dentro.",
  },
  {
    slug: "dieta-anticancer",
    title: "A Dieta Anticâncer",
    subtitle: "O estilo de vida que combate o câncer",
    tag: "Prevenção",
    categoria: "Saúde",
    c1: "#4a7a4f",
    c2: "#1d4029",
    buyUrl: `${WC}/cancer-tratamentos-naturais/`,
    pageSlug: "adietaanticancer",
    excerpt:
      "Como alimentação e estilo de vida deveriam ser o tratamento primário na prevenção do câncer — o que mostra a ciência, sem promessas mágicas.",
  },
  {
    slug: "dieta-antidiabetes",
    title: "Dieta Antidiabetes",
    subtitle: "O estilo de vida que combate a diabetes",
    tag: "Saúde metabólica",
    categoria: "Saúde",
    c1: "#6f9159",
    c2: "#2e5e3a",
    buyUrl: `${WC}/dieta-antidiabetes-o-estilo-de-vida-que-combate-a-diabetes/`,
    pageSlug: "dieta-antidiabetes",
    excerpt:
      "Estratégias alimentares para controlar a glicemia e reduzir a dependência de medicação — sempre junto do seu médico.",
  },
  {
    slug: "nutricao-vegana",
    title: "Nutrição Vegana",
    tag: "Didático",
    categoria: "Saúde",
    c1: "#7e9a6e",
    c2: "#3e6a40",
    buyUrl: `${WC}/nutricao-vegana/`,
    pageSlug: "nutricao-vegana",
    excerpt:
      "A base científica para uma alimentação vegana completa e segura, com todos os nutrientes que o corpo precisa.",
  },
  {
    slug: "vegan-fitness",
    title: "Vegan Fitness",
    subtitle: "Receitas do atleta natural",
    tag: "Performance",
    categoria: "Receitas",
    c1: "#3a6a4a",
    c2: "#16301f",
    buyUrl: `${WC}/vegan-fitness/`,
    pageSlug: "vegan-fitness-receitas-do-atleta-natural",
    excerpt:
      "Alimentação de verdade para quem treina: receitas práticas para performance e recuperação, sem suplementos ultraprocessados.",
  },
  {
    slug: "doces-delicias",
    title: "Doces Delícias",
    subtitle: "CRUlinária Frugal",
    tag: "Receitas",
    categoria: "Receitas",
    c1: "#d08a4e",
    c2: "#7a3f1e",
    buyUrl: `${WC}/doces-delicias/`,
    pageSlug: "crulinaria-frugal-doces-delicias",
    excerpt:
      "Sobremesas naturais e cruas que cabem na rotina — doçura de verdade, sem açúcar refinado nem ultraprocessados.",
  },
  {
    slug: "crulinaria-frugal",
    title: "CRUlinária Frugal",
    subtitle: "Receitas do Paraíso",
    tag: "Receitas cruas",
    categoria: "Receitas",
    c1: "#caa84a",
    c2: "#6f6320",
    buyUrl: `${WC}/crulinaria-frugal/`,
    pageSlug: "crulinaria-frugal-receitas-do-paraiso",
    excerpt:
      "A cozinha viva do Dr. Corassa: pratos crus, coloridos e nutritivos para o dia a dia, do básico ao surpreendente.",
  },
  {
    slug: "cozinhando-sem-o-fogao",
    title: "Cozinhando sem o Fogão",
    subtitle: "Delícias da natureza",
    tag: "Receitas",
    categoria: "Receitas",
    c1: "#c47b6a",
    c2: "#6a2f24",
    buyUrl: `${WC}/delicias-da-natureza-cozinhando-sem-o-fogao/`,
    pageSlug: "delicias-da-natureza-cozinhando-sem-o-fogao",
    excerpt:
      "Pratos completos e saborosos sem usar o fogão — preservando nutrientes e simplificando a cozinha natural.",
  },
  {
    slug: "veganismo-para-pais",
    title: "Veganismo para bebês, mães e pais",
    tag: "Família",
    categoria: "Família",
    c1: "#5b8aa0",
    c2: "#1f3d4a",
    buyUrl: `${WC}/veganismo-para-os-pais/`,
    pageSlug: "veganismo-para-bebes-maes-e-pais",
    excerpt:
      "O guia completo da alimentação vegana na gestação, na amamentação e na infância — com segurança nutricional em cada fase.",
  },
  {
    slug: "combo-6-livros",
    title: "Combo 6 livros didáticos",
    tag: "Combo",
    categoria: "Combo",
    c1: "#4a7a4f",
    c2: "#1d4029",
    buyUrl: `${WC}/combo-6-livros-didaticos/`,
    pageSlug: null,
    excerpt:
      "A base teórica e científica para entender a medicina do estilo de vida a fundo, com desconto no conjunto.",
  },
  {
    slug: "combo-10-livros",
    title: "Combo 10 Livros",
    tag: "Combo",
    categoria: "Combo",
    c1: "#2e5e3a",
    c2: "#14271a",
    buyUrl: `${WC}/combo-10-livros/`,
    pageSlug: null,
    excerpt:
      "A obra completa do Dr. Corassa, do estilo de vida às receitas. A melhor relação custo-benefício da loja.",
  },
  {
    slug: "combo-receitas",
    title: "Livros de receitas — combo 4 livros",
    tag: "Combo",
    categoria: "Combo",
    c1: "#caa84a",
    c2: "#6f6320",
    buyUrl: `${WC}/livros-de-receitas-naturais/`,
    pageSlug: null,
    excerpt:
      "A cozinha natural completa: doces, crulinária e pratos sem fogão reunidos em quatro livros de receitas.",
  },
  {
    slug: "combo-presente",
    title: "Combo Saúde Frugal para presentear",
    tag: "Combo",
    categoria: "Combo",
    c1: "#c25e3a",
    c2: "#7a3f1e",
    buyUrl: `${WC}/combo-saudefrugal-dieta-do-eden/`,
    pageSlug: null,
    excerpt:
      "Dois exemplares da obra fundamental do Dr. Corassa — um para você e outro para dar de presente a quem você ama.",
  },
];

// Capas reais em public/livros/. Livros sem capa caem no título sobre gradiente.
const COVERS: Record<string, string> = {
  "dieta-do-eden": "/livros/dieta-do-eden.webp",
  "jejum-higienista": "/livros/jejum-higienista.png",
  "dieta-anticancer": "/livros/dieta-anticancer.webp",
  "dieta-antidiabetes": "/livros/dieta-antidiabetes.png",
  "nutricao-vegana": "/livros/nutricao-vegana.webp",
  "doces-delicias": "/livros/doces-delicias.webp",
  "crulinaria-frugal": "/livros/crulinaria-frugal.webp",
  "cozinhando-sem-o-fogao": "/livros/cozinhando-sem-o-fogao.webp",
  "vegan-fitness": "/livros/vegan-fitness.webp",
  "veganismo-para-pais": "/livros/veganismo-para-pais.webp",
  "combo-10-livros": "/livros/combo-10-livros.webp",
  "combo-6-livros": "/livros/combo-6-livros.webp",
  "combo-receitas": "/livros/combo-receitas.webp",
  "combo-presente": "/livros/combo-presente.webp",
};
export function coverUrl(slug: string): string | null {
  return COVERS[slug] ?? null;
}

export const livrosBySlug = Object.fromEntries(livros.map((l) => [l.slug, l]));
export const livrosComPagina = livros.filter((l) => l.pageSlug);
export const combos = livros.filter((l) => l.categoria === "Combo");
export const livrosAvulsos = livros.filter((l) => l.categoria !== "Combo");
