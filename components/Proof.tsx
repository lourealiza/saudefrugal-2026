const videos = [
  "23 dias sem comer: o documentário do jejum",
  "O câncer e o remédio que a indústria esconde",
  "40 dias de jejum de água: antes e depois",
];

export default function Proof() {
  return (
    <section className="section" id="proof">
      <div className="wrap">
        <div className="proof__head">
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            No nosso canal
          </p>
          <h2>Conteúdo que já mudou milhares de rotinas</h2>
        </div>

        <div className="proof__grid">
          {videos.map((v) => (
            <a
              key={v}
              href="https://www.youtube.com/@saudefrugal"
              target="_blank"
              rel="noopener noreferrer"
              className="video reveal"
              aria-label={v}
            >
              <span>{v}</span>
            </a>
          ))}
        </div>

        <figure className="testimonial reveal">
          <blockquote>
            “Mudei minha alimentação e, em poucas semanas, parei remédios que
            tomava há anos. Foi como reencontrar meu corpo.”
          </blockquote>
          <cite>— Depoimento de aluno · Saúde Frugal</cite>
        </figure>
      </div>
    </section>
  );
}
