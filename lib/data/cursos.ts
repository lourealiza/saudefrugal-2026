// Fonte única dos cursos. Checkout na loja /2026/ (WooCommerce):
//   buyUrl   -> página do produto em /2026/lojavirtual-saudefrugal/<slug>/
//   conteúdo -> content/cursos/<slug>.html (fetch-cursos-conteudo.mjs)

export type CursoCategoria = "Saúde" | "Receitas";
export type CursoNivel = "Iniciante" | "Intermediário" | "Todos os níveis";

export type Curso = {
  slug: string; // rota interna: /cursos/<slug>
  title: string;
  excerpt: string;
  nivel: CursoNivel;
  categoria: CursoCategoria;
  c1: string;
  c2: string;
  buyUrl: string;
};

const LOJA = "https://saudefrugal.com.br/2026/lojavirtual-saudefrugal";

export const cursos: Curso[] = [
  {
    slug: "metodo-saude-maxima",
    title: "Método de Saúde Máxima",
    excerpt:
      "O passo a passo completo do Dr. Corassa para reorganizar sua alimentação e seus hábitos rumo à saúde máxima.",
    nivel: "Todos os níveis",
    categoria: "Saúde",
    c1: "#5a8a5a",
    c2: "#234d2e",
    buyUrl: `${LOJA}/metodo-saude-maxima/`,
  },
  {
    slug: "corpo-perfeito",
    title: "Programa Corpo Perfeito VegPower",
    excerpt:
      "Composição corporal saudável unindo alimentação natural, exercício e descanso — sem dietas malucas nem ultraprocessados.",
    nivel: "Todos os níveis",
    categoria: "Saúde",
    c1: "#3f7a4c",
    c2: "#14271a",
    buyUrl: "https://pay.hotmart.com/K10711129K?off=nmps3hha",
  },
  {
    slug: "jejum-detox",
    title: "Método Jejum Detox",
    excerpt:
      "Aprenda a jejuar com segurança para desintoxicar o organismo, emagrecer e prevenir doenças — o método guiado do Dr. Corassa.",
    nivel: "Iniciante",
    categoria: "Saúde",
    c1: "#4a7a4f",
    c2: "#1d4029",
    buyUrl: "https://pay.hotmart.com/M75801130E?off=8jvtkcyw",
  },
  {
    slug: "doces-saudaveis",
    title: "Doces Saudáveis sem Açúcar",
    excerpt:
      "Sobremesas naturais que cabem na rotina — doçura de verdade, sem açúcar refinado nem ingredientes ultraprocessados.",
    nivel: "Iniciante",
    categoria: "Receitas",
    c1: "#d08a4e",
    c2: "#7a3f1e",
    buyUrl: `${LOJA}/curso-doces-saudaveis-sem-acucar/`,
  },
  {
    slug: "lacto-zero",
    title: "Lacto Zero — Leites e Queijos Vegetais",
    excerpt:
      "Faça em casa leites, queijos e cremes vegetais saborosos, do básico ao avançado, sem laticínios.",
    nivel: "Iniciante",
    categoria: "Receitas",
    c1: "#caa84a",
    c2: "#6f6320",
    buyUrl: "https://pay.hotmart.com/F46648985I",
  },
  {
    slug: "sorvetes-fit",
    title: "Sorvetes Fit Naturais",
    excerpt:
      "Versões geladas, cremosas e naturais dos sorvetes e milk-shakes que todo mundo ama — sem açúcar e sem lactose.",
    nivel: "Iniciante",
    categoria: "Receitas",
    c1: "#c47b6a",
    c2: "#6a2f24",
    buyUrl: `${LOJA}/sorvetes-fit-naturais/`,
  },
];

export const cursosBySlug = Object.fromEntries(cursos.map((c) => [c.slug, c]));
