import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Arrow, Check, WhatsApp } from "@/components/icons";
import { withBase } from "@/lib/base";

export const metadata: Metadata = {
  title: "Retiros presenciais · Dr. Eduardo Corassa — Saúde Frugal",
  description:
    "Imersões de 5 a 10 dias com aulas culinárias, jejum guiado, atividades e detox ao lado do Dr. Corassa. Conheça os próximos retiros.",
};

// Reserva/inscrição dos retiros (loja /2026/)
const RETIROS_URL = "https://saudefrugal.com.br/2026/retiros/";
const HOSPEDAGEM_URL = "https://saudefrugal.com.br/2026/retiros/hospedagem-internato/";

function loadHospedagem(): string | null {
  try {
    return readFileSync(join(process.cwd(), "content", "retiros", "hospedagem.html"), "utf8");
  } catch {
    return null;
  }
}

const includes = [
  "Duas aulas culinárias por dia, com degustação",
  "Refeições 100% naturais preparadas pelos alunos",
  "Atividades físicas e caminhadas diárias",
  "Documentários, palestras e debates",
  "Hospedagem e acompanhamento do Dr. Corassa",
  "Comunidade e troca com pessoas no mesmo objetivo",
];

const schedule = [
  { t: "7h", a: "Despertar, hidratação e caminhada" },
  { t: "8h", a: "Primeira aula culinária + café da manhã" },
  { t: "10h", a: "Palestra ou documentário educativo" },
  { t: "12h", a: "Almoço preparado pela turma" },
  { t: "15h", a: "Segunda aula culinária + degustação" },
  { t: "17h", a: "Atividade física ou roda de conversa" },
  { t: "19h", a: "Jantar leve e socialização" },
  { t: "21h", a: "Encerramento e descanso" },
];

const retreats = [
  {
    title: "Retiro Detox de Carnaval",
    desc: "Comece o ano leve: uma imersão para desintoxicar o corpo e reprogramar hábitos longe da rotina.",
    days: "5 a 7 dias",
    when: "Fevereiro",
    c1: "#4a7a4f",
    c2: "#1d4029",
  },
  {
    title: "Retiro Agroflorestal",
    desc: "Mão na terra: alimentação natural conectada ao cultivo, à agrofloresta e à vida no campo.",
    days: "7 a 10 dias",
    when: "Penúltima semana de Janeiro e Julho",
    c1: "#6f9159",
    c2: "#2e5e3a",
  },
];

export default function RetirosPage() {
  const hospedagem = loadHospedagem();
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <p className="breadcrumb">
              <a href={withBase("/")}>Início</a> / Retiros
            </p>
            <p className="eyebrow" style={{ marginTop: "1.4rem" }}>
              Imersões presenciais
            </p>
            <h1>
              Uma semana que <em className="serif">muda</em> o seu estilo de vida
            </h1>
            <p className="lede">
              De 5 a 10 dias de imersão total — cerca de 8 horas por dia de
              aprendizado prático, alimentação natural e descanso, ao lado do
              Dr. Corassa.
            </p>
            <div className="hero__cta" style={{ marginTop: "2rem" }}>
              <a href="https://wa.me/5521981928668" className="btn btn--primary">
                Falar sobre o próximo retiro <Arrow className="arrow" />
              </a>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap feature__grid">
            <div className="feature__media reveal">
              <span className="feature__tag">Imersão · 5 a 10 dias</span>
              <img
                src={withBase("/cozinha-natural.webp")}
                alt="Preparo de alimentos naturais durante o retiro"
              />
            </div>
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                O que está incluído
              </p>
              <h2>Tudo o que você vive na imersão</h2>
              <ul className="feature__list" style={{ marginBottom: 0 }}>
                {includes.map((it) => (
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
                  Um dia no retiro
                </p>
                <h2>Como é a programação</h2>
              </div>
            </div>
            <div className="schedule">
              {schedule.map((s) => (
                <div key={s.t} className="schedule__row">
                  <span className="schedule__time">{s.t}</span>
                  <span className="schedule__act">{s.a}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section__head">
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  Próximas edições
                </p>
                <h2>Escolha o seu retiro</h2>
              </div>
            </div>
            <div className="retreat-types">
              {retreats.map((r) => (
                <article
                  key={r.title}
                  className="retreat reveal"
                  style={{ ["--c1" as string]: r.c1, ["--c2" as string]: r.c2 }}
                >
                  <div className="retreat__media">imagem · {r.title}</div>
                  <div className="retreat__body">
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                    <div className="retreat__meta">
                      <span>🗓 {r.when}</span>
                      <span>⏳ {r.days}</span>
                    </div>
                    <a
                      href={RETIROS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                    >
                      Garantir minha vaga <Arrow className="arrow" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {hospedagem && (
          <section className="section pillars">
            <div className="wrap">
              <div className="section__head">
                <div>
                  <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                    Onde você fica
                  </p>
                  <h2>Hospedagem &amp; internato</h2>
                </div>
                <a
                  href={HOSPEDAGEM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                >
                  Ver opções de hospedagem
                </a>
              </div>
              <article className="prose" dangerouslySetInnerHTML={{ __html: hospedagem }} />
            </div>
          </section>
        )}

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <h2>As vagas são limitadas a cada edição</h2>
              <p>
                Veja datas, valores e garanta o seu lugar no próximo retiro — ou fale
                com a nossa equipe pelo WhatsApp.
              </p>
              <div className="actions">
                <a
                  href={RETIROS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  Ver retiros e reservar <Arrow className="arrow" />
                </a>
                <a href="https://wa.me/5521981928668" className="btn btn--light">
                  Falar no WhatsApp
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
