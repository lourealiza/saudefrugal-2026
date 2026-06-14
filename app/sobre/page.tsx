import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, Leaf, Check, Consult, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";

export const metadata: Metadata = {
  title: "Sobre o Dr. Eduardo Corassa — Saúde Frugal",
  description:
    "Conheça Eduardo Corassa, nutricionista e divulgador da medicina do estilo de vida: alimentação natural, jejum e hábitos que transformam a saúde.",
};

const creds = [
  { num: "10", label: "Livros publicados" },
  { num: "9", label: "Cursos online" },
  { num: "5–10", label: "Dias de retiro detox" },
  { num: "8h", label: "De programação diária no retiro" },
];

const values = [
  {
    icon: Check,
    title: "Baseado em evidências",
    desc: "Cada recomendação parte da ciência da nutrição e da medicina do estilo de vida — não de modismos ou promessas milagrosas.",
  },
  {
    icon: Leaf,
    title: "Natural e acessível",
    desc: "Comida de verdade, ingredientes simples e técnicas que cabem na sua cozinha e no seu orçamento. Frugal de propósito.",
  },
  {
    icon: Consult,
    title: "Estilo de vida, não dieta passageira",
    desc: "O objetivo é mudança que dura: hábitos que você sustenta no dia a dia, e não uma restrição temporária e sofrida.",
  },
];

export default function SobrePage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / Sobre
            </p>
            <div className="about__grid" style={{ marginTop: "2rem" }}>
              <div className="about__portrait reveal">
                {/* Substituir pela foto do Dr. Corassa: /public/dr-corassa.jpg */}
                foto · Dr. Eduardo Corassa
              </div>
              <div className="reveal">
                <p className="eyebrow" style={{ marginBottom: "1.2rem" }}>
                  Conheça o Dr. Corassa
                </p>
                <p className="about__lead">
                  Eduardo Corassa é nutricionista e um dos principais divulgadores
                  da <em className="serif">medicina do estilo de vida</em> no Brasil.
                </p>
                <div className="about__body">
                  <p>
                    Há anos ele defende uma ideia simples e poderosa: grande parte
                    das doenças crônicas pode ser prevenida — e muitas vezes
                    revertida — por mudanças na alimentação e nos hábitos.
                  </p>
                  <p>
                    No canal do YouTube, nos livros, nos cursos e nos retiros
                    presenciais, o Dr. Corassa ensina, de forma prática, como adotar
                    uma alimentação natural, como usar o jejum com segurança e como
                    construir uma rotina que sustente a sua saúde a longo prazo.
                  </p>
                  <p>
                    A proposta da Saúde Frugal é essa: cuidar do corpo com o que há
                    de mais simples e natural, sem depender de soluções caras ou
                    invasivas.
                  </p>
                </div>
              </div>
            </div>

            <div className="creds">
              {creds.map((c) => (
                <div key={c.label}>
                  <div className="cred__num">{c.num}</div>
                  <div className="cred__label">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section pillars">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  No que a gente acredita
                </p>
                <h2>Princípios que guiam todo o trabalho</h2>
              </div>
            </div>
            <div className="values">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="value reveal">
                    <span className="value__icon">
                      <Icon size={24} />
                    </span>
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <h2>Pronto para dar o primeiro passo?</h2>
              <p>
                Comece pelos cursos online ou venha viver a experiência completa
                em um retiro presencial ao lado do Dr. Corassa.
              </p>
              <div className="actions">
                <a href={withBase("/cursos")} className="btn btn--primary">
                  Ver os cursos <Arrow className="arrow" />
                </a>
                <a href={withBase("/#retiro")} className="btn btn--light">
                  Conhecer os retiros
                </a>
              </div>
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
