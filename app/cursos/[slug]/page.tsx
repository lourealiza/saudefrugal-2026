import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";
import { cursos, cursosBySlug } from "@/lib/data/cursos";

export function generateStaticParams() {
  return cursos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const curso = cursosBySlug[slug];
  if (!curso) return {};
  const title = `${curso.title} · Curso online — Dr. Corassa`;
  return {
    title,
    description: curso.excerpt,
    openGraph: { title, description: curso.excerpt, type: "website", locale: "pt_BR" },
    alternates: { canonical: `/cursos/${curso.slug}` },
  };
}

function loadConteudo(slug: string): string | null {
  try {
    return readFileSync(join(process.cwd(), "content", "cursos", `${slug}.html`), "utf8");
  } catch {
    return null;
  }
}

export default async function CursoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const curso = cursosBySlug[slug];
  if (!curso) notFound();

  const conteudo = loadConteudo(slug);
  const relacionados = cursos.filter((c) => c.slug !== curso.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: curso.title,
    description: curso.excerpt,
    inLanguage: "pt-BR",
    provider: { "@type": "Person", name: "Dr. Eduardo Corassa" },
    offers: { "@type": "Offer", url: curso.buyUrl, category: "online course" },
  };

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / <a href={withBase("/cursos")}>Cursos</a> /{" "}
              {curso.title}
            </p>

            <div className="product__grid">
              <div
                className="product__cover"
                style={{ ["--c1" as string]: curso.c1, ["--c2" as string]: curso.c2 }}
              >
                {curso.title}
              </div>

              <div className="product__info">
                <p className="eyebrow">Curso online · {curso.nivel}</p>
                <h1>{curso.title}</h1>
                <p className="lede">{curso.excerpt}</p>

                <div className="course__meta" style={{ marginTop: "1.4rem" }}>
                  <span>Online</span>
                  <span className="dot-sep" />
                  <span>No seu ritmo</span>
                  <span className="dot-sep" />
                  <span>Acesso vitalício</span>
                </div>

                <div className="product__actions">
                  <a
                    href={curso.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                  >
                    Quero este curso <Arrow className="arrow" />
                  </a>
                  <a href={withBase("/cursos")} className="btn btn--ghost">
                    Ver todos os cursos
                  </a>
                </div>
                <p className="product__note">
                  Pagamento seguro · cartão ou Pix · acesso liberado na hora
                </p>
              </div>
            </div>
          </div>
        </section>

        {conteudo && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <article className="prose" dangerouslySetInnerHTML={{ __html: conteudo }} />
            </div>
          </section>
        )}

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <h2>Pronto para começar?</h2>
              <p>
                Garanta seu acesso e comece hoje, no seu ritmo, com todo o conteúdo
                do Dr. Corassa.
              </p>
              <div className="actions">
                <a
                  href={curso.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  Quero este curso <Arrow className="arrow" />
                </a>
                <a href="https://wa.me/5521981928668" className="btn btn--light">
                  Tirar dúvidas no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section pillars">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  Continue aprendendo
                </p>
                <h2>Outros cursos</h2>
              </div>
              <a href={withBase("/cursos")} className="btn btn--ghost">
                Ver catálogo
              </a>
            </div>
            <div className="courses">
              {relacionados.map((c) => (
                <article
                  key={c.slug}
                  className="course"
                  style={{ ["--c1" as string]: c.c1, ["--c2" as string]: c.c2 }}
                >
                  <a href={withBase(`/cursos/${c.slug}`)} className="course__thumb">
                    <span className="course__level">{c.nivel}</span>
                  </a>
                  <div className="course__body">
                    <h3>
                      <a href={withBase(`/cursos/${c.slug}`)}>{c.title}</a>
                    </h3>
                    <p>{c.excerpt}</p>
                    <a href={withBase(`/cursos/${c.slug}`)} className="course__cta">
                      Ver curso <Arrow className="arrow" size={16} />
                    </a>
                  </div>
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
