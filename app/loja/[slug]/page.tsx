import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";
import { livros, livrosBySlug, livrosAvulsos, coverUrl } from "@/lib/data/livros";

export function generateStaticParams() {
  return livros.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const livro = livrosBySlug[slug];
  if (!livro) return {};
  const title = `${livro.title}${livro.subtitle ? ` — ${livro.subtitle}` : ""} · Dr. Corassa`;
  return {
    title,
    description: livro.excerpt,
    openGraph: { title, description: livro.excerpt, type: "website", locale: "pt_BR" },
    alternates: { canonical: `/loja/${livro.slug}` },
  };
}

function loadConteudo(slug: string): string | null {
  try {
    return readFileSync(join(process.cwd(), "content", "livros", `${slug}.html`), "utf8");
  } catch {
    return null;
  }
}

export default async function LivroPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const livro = livrosBySlug[slug];
  if (!livro) notFound();

  const conteudo = livro.pageSlug ? loadConteudo(slug) : null;
  const relacionados = livrosAvulsos.filter((l) => l.slug !== livro.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: livro.title,
    ...(livro.subtitle ? { alternateName: livro.subtitle } : {}),
    description: livro.excerpt,
    author: { "@type": "Person", name: "Dr. Eduardo Corassa" },
    inLanguage: "pt-BR",
    offers: { "@type": "Offer", url: livro.buyUrl, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / <a href={withBase("/loja")}>Loja</a> /{" "}
              {livro.title}
            </p>

            <div className="product__grid">
              <div
                className="product__cover"
                style={{ ["--c1" as string]: livro.c1, ["--c2" as string]: livro.c2 }}
              >
                {coverUrl(livro.slug) ? (
                  <img src={withBase(coverUrl(livro.slug)!)} alt={`Capa do livro ${livro.title}`} />
                ) : (
                  livro.title
                )}
              </div>

              <div className="product__info">
                <p className="eyebrow">{livro.tag}</p>
                <h1>{livro.title}</h1>
                {livro.subtitle && <p className="product__subtitle serif">{livro.subtitle}</p>}
                <p className="lede">{livro.excerpt}</p>

                <div className="product__actions">
                  <a
                    href={livro.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                  >
                    Comprar agora <Arrow className="arrow" />
                  </a>
                  <a href={withBase("/loja")} className="btn btn--ghost">
                    Ver todos os livros
                  </a>
                </div>
                <p className="product__note">
                  Pagamento seguro no site oficial · cartão, Pix ou boleto
                </p>
              </div>
            </div>
          </div>
        </section>

        {conteudo ? (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <article className="prose" dangerouslySetInnerHTML={{ __html: conteudo }} />
            </div>
          </section>
        ) : (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="prose">
                <p>{livro.excerpt}</p>
                <p>
                  Adquira pelo site oficial e receba o material com a qualidade e o
                  conteúdo do Dr. Corassa.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="section pillars">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  Continue explorando
                </p>
                <h2>Outros livros do Dr. Corassa</h2>
              </div>
              <a href={withBase("/loja")} className="btn btn--ghost">
                Ver a loja
              </a>
            </div>
            <div className="books">
              {relacionados.map((b) => (
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
                  <h3>{b.title}</h3>
                  <span className="book__tag">{b.tag}</span>
                  <a href={withBase(`/loja/${b.slug}`)} className="book__buy">
                    Ver livro <Arrow className="arrow" size={15} />
                  </a>
                </article>
              ))}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
