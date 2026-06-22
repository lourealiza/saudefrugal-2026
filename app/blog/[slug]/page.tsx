import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";
import { posts, postsBySlug, getPostContent, formatDate } from "@/lib/data/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postsBySlug[slug];
  if (!post) return {};
  return {
    title: `${post.title} · Blog Saúde Frugal`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", locale: "pt_BR" },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postsBySlug[slug];
  if (!post) notFound();

  const conteudo = getPostContent(slug);
  const relacionados = posts.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: "Dr. Eduardo Corassa" },
    inLanguage: "pt-BR",
  };

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap" style={{ maxWidth: "820px" }}>
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / <a href={withBase("/blog")}>Blog</a>
            </p>
            {post.categories[0] && (
              <p className="eyebrow" style={{ marginTop: "1.4rem" }}>
                {post.categories[0]}
              </p>
            )}
            <h1>{post.title}</h1>
            <p className="post__meta">{formatDate(post.date)} · Dr. Eduardo Corassa</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <article className="prose" dangerouslySetInnerHTML={{ __html: conteudo }} />
          </div>
        </section>

        <section className="section pillars">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  Continue lendo
                </p>
                <h2>Outros artigos</h2>
              </div>
              <a href={withBase("/blog")} className="btn btn--ghost">
                Ver o blog
              </a>
            </div>
            <div className="post-grid">
              {relacionados.map((p) => (
                <a key={p.slug} href={withBase(`/blog/${p.slug}`)} className="post-card reveal">
                  <div className="post-card__media" />
                  <div className="post-card__body">
                    {p.categories[0] && <span className="post__cat">{p.categories[0]}</span>}
                    <h3>{p.title}</h3>
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
