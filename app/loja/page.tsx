import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Loja · Livros do Dr. Eduardo Corassa — Saúde Frugal",
  description:
    "Os 10 livros do Dr. Corassa: alimentação natural, jejum, dietas anticâncer e antidiabetes, receitas veganas e combos com desconto.",
};

// Loja de verdade (WooCommerce) na raiz do domínio. Capas e links extraídos
// via _scripts/fetch-capas.mjs (campo `slug` = produto na raiz).
const STORE = "https://saudefrugal.com.br/product";

const books = [
  { title: "A Dieta do Éden", tag: "Alimentação natural", slug: "dieta-do-eden", cover: "/livros/dieta-do-eden.jpg", c1: "#5a8a5a", c2: "#234d2e" },
  { title: "Jejum Higienista", tag: "Jejum", slug: "jejum-higienista", cover: "/livros/jejum-higienista.jpeg", c1: "#3f7a4c", c2: "#14271a" },
  { title: "A Dieta Anticâncer", tag: "Prevenção", slug: "cancer-tratamentos-naturais", cover: "/livros/cancer-tratamentos-naturais.jpeg", c1: "#4a7a4f", c2: "#1d4029" },
  { title: "Dieta Antidiabetes", tag: "Saúde metabólica", slug: "dieta-antidiabetes-o-estilo-de-vida-que-combate-a-diabetes", cover: "/livros/dieta-antidiabetes-o-estilo-de-vida-que-combate-a-diabetes.png", c1: "#6f9159", c2: "#2e5e3a" },
  { title: "Nutrição Vegana", tag: "Didático", slug: "nutricao-vegana", cover: "/livros/nutricao-vegana.jpg", c1: "#7e9a6e", c2: "#3e6a40" },
  { title: "Vegan Fitness", tag: "Performance", slug: "vegan-fitness", cover: "/livros/vegan-fitness.jpg", c1: "#3a6a4a", c2: "#16301f" },
  { title: "Doces Delícias", tag: "Receitas", slug: "doces-delicias", cover: "/livros/doces-delicias.jpg", c1: "#d08a4e", c2: "#7a3f1e" },
  { title: "CRUlinária Frugal", tag: "Receitas cruas", slug: "crulinaria-frugal", cover: "/livros/crulinaria-frugal.jpg", c1: "#caa84a", c2: "#6f6320" },
  { title: "Cozinhando sem o Fogão", tag: "Receitas", slug: "delicias-da-natureza-cozinhando-sem-o-fogao", cover: "/livros/delicias-da-natureza-cozinhando-sem-o-fogao.jpeg", c1: "#c47b6a", c2: "#6a2f24" },
  { title: "Veganismo para pais, mães e bebês", tag: "Família", slug: "veganismo-para-os-pais", cover: "/livros/veganismo-para-os-pais.jpg", c1: "#5b8aa0", c2: "#1f3d4a" },
];

const combos = [
  {
    title: "Combo 4 livros de receitas",
    desc: "Doces Delícias, CRUlinária Frugal, Cozinhando sem o Fogão e mais — a cozinha natural completa.",
    price: "à vista ou parcelado",
    slug: "livros-de-receitas-naturais",
    feature: false,
  },
  {
    title: "Combo 10 livros Dr. Corassa",
    desc: "A obra completa, do estilo de vida às receitas. A melhor relação custo-benefício da loja.",
    price: "melhor oferta",
    slug: "combo-10-livros",
    feature: true,
  },
  {
    title: "Combo 6 livros didáticos",
    desc: "A base teórica e científica para entender a medicina do estilo de vida a fundo.",
    price: "à vista ou parcelado",
    slug: "combo-6-livros-didaticos",
    feature: false,
  },
];

export default function LojaPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / Loja
            </p>
            <p className="eyebrow" style={{ marginTop: "1.4rem" }}>
              Livros &amp; loja
            </p>
            <h1>
              10 livros para virar a chave da sua <em className="serif">saúde</em>
            </h1>
            <p className="lede">
              Da teoria às receitas do dia a dia. Cada título traz o conhecimento
              do Dr. Corassa de um jeito direto, prático e para aplicar já.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="books">
              {books.map((b) => (
                <article
                  key={b.title}
                  className="book reveal"
                  style={{ ["--c1" as string]: b.c1, ["--c2" as string]: b.c2 }}
                >
                  <div className="book__cover">
                    {b.cover ? (
                      <img src={withBase(b.cover)} alt={`Capa do livro ${b.title}`} loading="lazy" />
                    ) : (
                      b.title
                    )}
                  </div>
                  <h3>{b.title}</h3>
                  <span className="book__tag">{b.tag}</span>
                  <a
                    href={`${STORE}/${b.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="book__buy"
                  >
                    Comprar <Arrow className="arrow" size={15} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section pillars">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  Compre em conjunto
                </p>
                <h2>Combos com desconto</h2>
              </div>
            </div>
            <div className="combos">
              {combos.map((c) => (
                <div
                  key={c.title}
                  className={`combo reveal${c.feature ? " combo--feature" : ""}`}
                >
                  {c.feature && <span className="combo__badge">Mais vendido</span>}
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="combo__price">{c.price}</div>
                  <a
                    href={`${STORE}/${c.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${c.feature ? "btn--light" : "btn--primary"}`}
                  >
                    Comprar combo <Arrow className="arrow" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <h2>Quer também os cursos e retiros?</h2>
              <p>
                Os livros são só o começo. Aprofunde com os cursos online ou viva
                a experiência completa em um retiro presencial.
              </p>
              <div className="actions">
                <a href={withBase("/cursos")} className="btn btn--primary">
                  Ver cursos <Arrow className="arrow" />
                </a>
                <a href={withBase("/retiros")} className="btn btn--light">
                  Conhecer retiros
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <a
        className="wa-float"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
      >
        <WhatsApp />
      </a>
      <ScrollReveal />
    </>
  );
}
