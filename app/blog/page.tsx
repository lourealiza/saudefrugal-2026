import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";
import { posts, formatDate } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog · Saúde Frugal — Dr. Eduardo Corassa",
  description:
    "Artigos do Dr. Corassa sobre alimentação natural, jejum, prevenção de doenças, vitaminas e ciência da saúde — sem promessas mágicas.",
};

export default function BlogPage() {
  const [destaque, ...resto] = posts;

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / Blog
            </p>
            <p className="eyebrow" style={{ marginTop: "1.4rem" }}>
              Conteúdo
            </p>
            <h1>
              Ciência da saúde, <em className="serif">sem enrolação</em>
            </h1>
            <p className="lede">
              Artigos do Dr. Corassa sobre alimentação, jejum e prevenção — baseados
              em evidência, escritos para você aplicar no dia a dia.
            </p>
          </div>
        </section>

        {destaque && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <a href={withBase(`/blog/${destaque.slug}`)} className="post-feature reveal">
                <div className="post-feature__media" />
                <div className="post-feature__body">
                  {destaque.categories[0] && (
                    <span className="post__cat">{destaque.categories[0]}</span>
                  )}
                  <h2>{destaque.title}</h2>
                  <p>{destaque.excerpt}</p>
                  <span className="post__meta">{formatDate(destaque.date)}</span>
                </div>
              </a>
            </div>
          </section>
        )}

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="post-grid">
              {resto.map((p) => (
                <a
                  key={p.slug}
                  href={withBase(`/blog/${p.slug}`)}
                  className="post-card reveal"
                >
                  <div className="post-card__media" />
                  <div className="post-card__body">
                    {p.categories[0] && <span className="post__cat">{p.categories[0]}</span>}
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <span className="post__meta">
                      {formatDate(p.date)} <Arrow className="arrow" size={14} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <a
        className="wa-float"
        href="https://wa.me/"
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
