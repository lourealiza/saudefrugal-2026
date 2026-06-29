import { Leaf, Instagram, Youtube, Spotify, Facebook } from "./icons";
import { withBase } from "@/lib/base";
import { social } from "@/lib/site";

const cols = [
  {
    title: "Conteúdo",
    links: [
      { label: "Cursos online", href: "/cursos" },
      { label: "Retiros", href: "/retiros" },
      { label: "Livros", href: "/loja" },
      { label: "Blog", href: "#" },
      { label: "YouTube", href: social.youtube },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre o Dr. Corassa", href: "/sobre" },
      { label: "Palestras", href: "#" },
      { label: "Loja virtual", href: "/loja" },
      { label: "Contato", href: "/#contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidade", href: "#" },
      { label: "Termos de Uso", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer" id="contato">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <a href={withBase("/")} className="logo">
              <Leaf className="leaf" />
              <span>
                Dr. <b>Corassa</b>
              </span>
            </a>
            <p>
              Saúde de verdade pelo estilo de vida: alimentação natural, jejum e
              hábitos que transformam o corpo de dentro para fora.
            </p>
            <div className="footer__social">
              <a href={social.instagram} aria-label="Instagram">
                <Instagram />
              </a>
              <a href={social.youtube} aria-label="YouTube">
                <Youtube />
              </a>
              <a href={social.spotify} aria-label="Spotify">
                <Spotify />
              </a>
              <a href={social.facebook} aria-label="Facebook">
                <Facebook />
              </a>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="footer__col">
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={withBase(l.href)}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Dr. Eduardo Corassa · Saúde Frugal. Todos os direitos reservados.</span>
          <span>Feito com cuidado · saudefrugal.com.br</span>
        </div>
      </div>
    </footer>
  );
}
