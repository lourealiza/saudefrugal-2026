import { Arrow, Course, Retreat, Book, Consult } from "./icons";
import { withBase } from "@/lib/base";

const pillars = [
  {
    icon: Course,
    title: "Cursos online",
    desc: "Aprenda no seu ritmo: jejum, dieta anticâncer, antidiabetes e mais. Teoria, ciência e prática.",
    href: "/cursos",
    cta: "Ver cursos",
  },
  {
    icon: Retreat,
    title: "Retiros",
    desc: "Imersões presenciais de 5 a 10 dias com aulas culinárias, atividades e detox guiado.",
    href: "/retiros",
    cta: "Próximas datas",
  },
  {
    icon: Book,
    title: "Livros",
    desc: "10 títulos do Dr. Corassa, da Dieta do Éden ao Jejum Higienista. Didáticos e de receitas.",
    href: "/loja",
    cta: "Conhecer livros",
  },
  {
    icon: Consult,
    title: "Consulta",
    desc: "Atendimento individual e palestras para um plano de estilo de vida sob medida para você.",
    href: "/#contato",
    cta: "Agendar",
  },
];

export default function Pillars() {
  return (
    <section className="section pillars" id="caminhos">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>
              Por onde começar
            </p>
            <h2>Quatro caminhos para mudar sua saúde</h2>
          </div>
          <a href={withBase("/loja")} className="btn btn--ghost">
            Ver tudo na loja <Arrow className="arrow" />
          </a>
        </div>

        <div className="pillars__grid">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <a key={p.title} href={withBase(p.href)} className="pillar reveal">
                <span className="pillar__icon">
                  <Icon size={26} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="pillar__link">
                  {p.cta} <Arrow className="arrow" size={16} />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
