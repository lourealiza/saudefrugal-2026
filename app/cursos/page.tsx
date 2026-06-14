import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CourseCatalog from "@/components/CourseCatalog";
import { Arrow, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";

export const metadata: Metadata = {
  title: "Cursos online · Dr. Eduardo Corassa — Saúde Frugal",
  description:
    "Cursos de jejum, dieta anticâncer, antidiabetes e receitas naturais. Aprenda no seu ritmo, com acesso vitalício, do conforto da sua casa.",
};

const steps = [
  {
    n: "01",
    title: "Escolha seu curso",
    desc: "Selecione o tema que faz sentido para o seu momento — da introdução ao jejum às receitas do dia a dia.",
  },
  {
    n: "02",
    title: "Estude no seu ritmo",
    desc: "Aulas em vídeo com teoria, ciência e prática. Assista quando e quantas vezes quiser, em qualquer dispositivo.",
  },
  {
    n: "03",
    title: "Aplique na sua rotina",
    desc: "Cada módulo termina com passos práticos para você levar o aprendizado direto para a cozinha e a vida.",
  },
];

const faqs = [
  {
    q: "Preciso já saber cozinhar ou ter conhecimento de nutrição?",
    a: "Não. Os cursos partem do zero e avançam aos poucos. Os de receitas são pensados para quem nunca cozinhou desse jeito antes.",
  },
  {
    q: "Por quanto tempo tenho acesso ao curso?",
    a: "O acesso é vitalício. Você compra uma vez e pode rever as aulas sempre que precisar, no seu próprio ritmo.",
  },
  {
    q: "Os cursos substituem acompanhamento médico?",
    a: "Não. O conteúdo é educativo e baseado em evidências, mas não substitui consulta. Mudanças de dieta ou de medicação devem ser feitas junto ao seu médico.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "A compra é feita pela nossa plataforma segura, com opção de cartão ou Pix. Após a confirmação, o acesso é liberado na hora.",
  },
];

export default function CursosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / Cursos
            </p>
            <p className="eyebrow" style={{ marginTop: "1.4rem" }}>
              Cursos online
            </p>
            <h1>
              Aprenda a cuidar da sua saúde <em className="serif">de casa</em>
            </h1>
            <p className="lede">
              Conteúdo prático e baseado em evidências para você adotar hábitos
              que previnem e revertem doenças — no seu tempo, sem sair de casa.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <CourseCatalog />
          </div>
        </section>

        <section className="section pillars" id="como-funciona">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  Como funciona
                </p>
                <h2>Simples do início ao fim</h2>
              </div>
            </div>
            <div className="steps">
              {steps.map((s) => (
                <div key={s.n} className="step reveal">
                  <div className="step__n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="proof__head">
              <p className="eyebrow" style={{ justifyContent: "center" }}>
                Perguntas frequentes
              </p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "0.6rem auto 0", maxWidth: "18ch", textAlign: "center" }}>
                Tudo que você precisa saber antes de começar
              </h2>
            </div>
            <div className="faq" style={{ marginTop: "clamp(2rem,4vw,3rem)" }}>
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <h2>Ainda na dúvida sobre por onde começar?</h2>
              <p>
                Fale com a nossa equipe pelo WhatsApp. A gente te ajuda a escolher
                o curso certo para o seu objetivo — sem compromisso.
              </p>
              <div className="actions">
                <a href="https://wa.me/" className="btn btn--primary">
                  Falar no WhatsApp <Arrow className="arrow" />
                </a>
                <a href={withBase("/#caminhos")} className="btn btn--light">
                  Ver outros caminhos
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
