import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, Check, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";

export const metadata: Metadata = {
  title: "Consulta nutricional · Dr. Eduardo Corassa — Saúde Frugal",
  description:
    "Atendimento nutricional online com o Dr. Eduardo Corassa: avaliação completa, plano alimentar natural e acompanhamento para prevenir e reverter doenças pelo estilo de vida.",
};

const WHATSAPP = "https://wa.me/";

const incluso = [
  "Avaliação completa do seu histórico de saúde e hábitos",
  "Plano alimentar natural, personalizado e realista",
  "Orientação sobre jejum, exercício e descanso",
  "Ajuste de hábitos junto ao seu acompanhamento médico",
  "Materiais de apoio e receitas para a rotina",
  "Retornos para acompanhar a sua evolução",
];

const passos = [
  { n: "01", title: "Agende sua consulta", desc: "Fale com a equipe pelo WhatsApp e escolha o melhor horário para o atendimento online." },
  { n: "02", title: "Avaliação completa", desc: "O Dr. Corassa analisa seu histórico, seus exames e seus objetivos para entender o seu caso a fundo." },
  { n: "03", title: "Plano e acompanhamento", desc: "Você recebe um plano natural personalizado e o acompanhamento para aplicar com segurança." },
];

const faqs = [
  {
    q: "A consulta é online ou presencial?",
    a: "O atendimento é online, por videochamada, para você ser atendido de onde estiver — com a mesma profundidade de uma consulta presencial.",
  },
  {
    q: "A consulta substitui o meu médico?",
    a: "Não. O acompanhamento nutricional é complementar. Qualquer mudança de medicação deve ser feita junto ao seu médico de confiança.",
  },
  {
    q: "Preciso já ser vegano ou ter alguma dieta?",
    a: "Não. O plano parte de onde você está hoje e evolui no seu ritmo, de forma realista e sustentável para a sua rotina.",
  },
];

export default function ConsultaPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / Consulta
            </p>
            <p className="eyebrow" style={{ marginTop: "1.4rem" }}>
              Atendimento nutricional
            </p>
            <h1>
              Cuide da sua saúde <em className="serif">de verdade</em>, pela raiz
            </h1>
            <p className="lede">
              Uma consulta online com o Dr. Eduardo Corassa para entender o seu caso
              e montar um plano natural que previne e reverte doenças pelo estilo de
              vida — sem promessas mágicas.
            </p>
            <div className="hero__cta" style={{ marginTop: "2rem" }}>
              <a href={WHATSAPP} className="btn btn--primary">
                Agendar minha consulta <Arrow className="arrow" />
              </a>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap feature__grid">
            <div className="feature__media reveal">
              <span className="feature__tag">Online · personalizado</span>
              Dr. Corassa
            </div>
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                O que está incluído
              </p>
              <h2>Um plano feito para a sua vida</h2>
              <ul className="feature__list" style={{ marginBottom: 0 }}>
                {incluso.map((it) => (
                  <li key={it}>
                    <span className="check">
                      <Check />
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section pillars">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  Como funciona
                </p>
                <h2>Simples do agendamento ao acompanhamento</h2>
              </div>
            </div>
            <div className="steps">
              {passos.map((s) => (
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
              <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "0.6rem auto 0", maxWidth: "20ch", textAlign: "center" }}>
                Dúvidas comuns sobre a consulta
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
              <h2>Pronto para dar o primeiro passo?</h2>
              <p>
                Agende sua consulta e comece a transformar a sua saúde com
                orientação de verdade, baseada em evidência.
              </p>
              <div className="actions">
                <a href={WHATSAPP} className="btn btn--primary">
                  Agendar pelo WhatsApp <Arrow className="arrow" />
                </a>
                <a href={withBase("/cursos")} className="btn btn--light">
                  Ver cursos online
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <a
        className="wa-float"
        href={WHATSAPP}
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
