const videoIds = ["i_tSMfCXGUs", "YdSayRXL2Rg", "bWOMJt3VWxg"];

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
          {videoIds.map((id) => (
            <div key={id} className="video-embed reveal">
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title="Vídeo do canal Saúde Frugal"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
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
