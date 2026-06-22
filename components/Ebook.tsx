import { Arrow } from "./icons";
import { withBase } from "@/lib/base";

export default function Ebook() {
  return (
    <section className="section" id="ebook">
      <div className="wrap">
        <div className="ebook reveal">
          <div>
            <p className="eyebrow" style={{ color: "var(--butter)", marginBottom: "1rem" }}>
              E-book gratuito
            </p>
            <h2>Melhorando sua dieta em 10 passos</h2>
            <p>
              Dicas e receitas para uma alimentação mais saudável — emagreça,
              fortaleça a imunidade e previna doenças crônicas. Baixe agora,
              é de graça.
            </p>
            <form
              className="ebook__form"
              action="#"
              aria-label="Receber e-book gratuito"
            >
              <input
                type="email"
                name="email"
                placeholder="Seu melhor e-mail"
                required
                aria-label="E-mail"
              />
              <button type="submit" className="btn btn--light">
                Quero baixar <Arrow className="arrow" />
              </button>
            </form>
          </div>

          <img
            className="ebook__cover"
            src={withBase("/ebook-saude-frugal.webp")}
            alt="Capa do livro Saúde Frugal — O guia ao crudivorismo frugívoro, de Eduardo Corassa"
          />
        </div>
      </div>
    </section>
  );
}
