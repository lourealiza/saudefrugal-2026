import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";
import { livrosAvulsos, combos, coverUrl } from "@/lib/data/livros";

export const metadata: Metadata = {
  title: "Loja · Livros do Dr. Eduardo Corassa — Saúde Frugal",
  description:
    "Os 10 livros do Dr. Corassa: alimentação natural, jejum, dietas anticâncer e antidiabetes, receitas veganas e combos com desconto.",
};

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
              {livrosAvulsos.map((b) => (
                <article
                  key={b.slug}
                  className="book reveal"
                  style={{ ["--c1" as string]: b.c1, ["--c2" as string]: b.c2 }}
                >
                  <a href={withBase(`/loja/${b.slug}`)} className="book__cover">
                    {coverUrl(b.slug) ? (
                      <img src={withBase(coverUrl(b.slug)!)} alt={`Capa do livro ${b.title}`} />
                    ) : (
                      b.title
                    )}
                  </a>
                  <h3>
                    <a href={withBase(`/loja/${b.slug}`)}>{b.title}</a>
                  </h3>
                  <span className="book__tag">{b.tag}</span>
                  <a href={withBase(`/loja/${b.slug}`)} className="book__buy">
                    Ver livro <Arrow className="arrow" size={15} />
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
              {combos.map((c) => {
                const feature = c.slug === "combo-10-livros";
                return (
                  <div
                    key={c.slug}
                    className={`combo reveal${feature ? " combo--feature" : ""}`}
                  >
                    {feature && <span className="combo__badge">Mais vendido</span>}
                    <h3>{c.title}</h3>
                    <p>{c.excerpt}</p>
                    <div className="combo__price">
                      {feature ? "melhor oferta" : "à vista ou parcelado"}
                    </div>
                    <a
                      href={c.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn ${feature ? "btn--light" : "btn--primary"}`}
                    >
                      Comprar combo <Arrow className="arrow" />
                    </a>
                  </div>
                );
              })}
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
        href="https://wa.me/5521981928668"
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
