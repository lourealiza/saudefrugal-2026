import { Arrow, Play, Leaf } from "./icons";

const words = ["Trate", "a", "saúde"];

export default function Hero() {
  return (
    <section className="hero" id="topo">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow" style={{ marginBottom: "1.4rem" }}>
            Medicina do estilo de vida
          </p>

          <h1 className="hero__title">
            {words.map((w, i) => (
              <span
                key={i}
                className="word"
                style={{ animationDelay: `${0.15 + i * 0.09}s`, marginRight: "0.28em" }}
              >
                {w}
              </span>
            ))}
            <span
              className="word"
              style={{ animationDelay: `${0.15 + words.length * 0.09}s` }}
            >
              pela <em className="serif">raiz</em>.
            </span>
          </h1>

          <p className="lede">
            Alimentação natural, jejum e hábitos que previnem e revertem doenças.
            O caminho do <strong>Dr. Eduardo Corassa</strong> para você cuidar do corpo
            sem depender de remédios.
          </p>

          <div className="hero__cta">
            <a href="#caminhos" className="btn btn--primary">
              Conheça os cursos <Arrow className="arrow" />
            </a>
            <a href="#proof" className="btn btn--ghost">
              <Play size={16} /> Assista no YouTube
            </a>
          </div>

          <div className="hero__stats">
            <div className="stat">
              <div className="stat__num">10</div>
              <div className="stat__label">Livros publicados</div>
            </div>
            <div className="stat">
              <div className="stat__num">6</div>
              <div className="stat__label">Cursos online</div>
            </div>
            <div className="stat">
              <div className="stat__num">5–10</div>
              <div className="stat__label">Dias de retiro detox</div>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <Leaf className="hero__leaf hero__leaf--1" size={60} />
          <Leaf className="hero__leaf hero__leaf--2" size={90} />
          <div className="hero__portrait">
            {/* Substituir pela foto do Dr. Corassa: /public/dr-corassa.jpg */}
            <span className="placeholder">foto · Dr. Eduardo Corassa</span>
          </div>
          <div className="hero__badge">
            <span className="dot">✦</span>
            <div>
              <small>ABORDAGEM</small>
              <strong>Natural &amp; baseada em evidências</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
