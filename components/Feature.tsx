import { Arrow, Check } from "./icons";
import { withBase } from "@/lib/base";

const items = [
  "Duas aulas culinárias diárias com degustação",
  "Atividades físicas, documentários e debates",
  "Cardápio 100% natural preparado pelos alunos",
  "Hospedagem e acompanhamento do Dr. Corassa",
];

export default function Feature() {
  return (
    <section className="section feature" id="retiro">
      <div className="wrap feature__grid">
        <div className="feature__media reveal">
          <span className="feature__tag">Detox · 5 a 10 dias</span>
          <img
            src={withBase("/cozinha-natural.webp")}
            alt="Preparo de alimentos naturais — frutas e vegetais frescos sendo cortados"
          />
        </div>

        <div className="reveal">
          <p className="eyebrow" style={{ marginBottom: "1rem" }}>
            Imersão presencial
          </p>
          <h2>
            Uma semana que <em className="serif">reorganiza</em> seus hábitos
          </h2>
          <p className="lede">
            Programação intensa de aproximadamente 8 horas por dia para você
            aprender, na prática, um novo estilo de vida ao lado do Dr. Corassa.
          </p>

          <ul className="feature__list">
            {items.map((it) => (
              <li key={it}>
                <span className="check">
                  <Check />
                </span>
                {it}
              </li>
            ))}
          </ul>

          <a href={withBase("/retiros")} className="btn btn--primary">
            Ver os retiros <Arrow className="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
