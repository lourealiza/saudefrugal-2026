import { Leaf, Instagram, Youtube, Spotify, Facebook, TikTok, Kwai } from "./icons";
import { withBase } from "@/lib/base";

const social = [
  { label: "Instagram", href: "https://www.instagram.com/drcorassa/", Icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/saudefrugal", Icon: Youtube },
  { label: "Facebook", href: "https://www.facebook.com/Saudefrugal", Icon: Facebook },
  { label: "TikTok", href: "https://www.tiktok.com/@drcorassa2", Icon: TikTok },
  { label: "Kwai", href: "https://www.kwai.com/@saudefrugal", Icon: Kwai },
  { label: "Spotify", href: "https://open.spotify.com/show/0AJGVnHVKuEAflcisuhtB7", Icon: Spotify },
];

const cols = [
  {
    title: "Conteúdo",
    links: [
      { label: "Cursos online", href: "/cursos" },
      { label: "Retiros", href: "/retiros" },
      { label: "Livros", href: "/loja" },
      { label: "Blog", href: "/blog" },
      { label: "YouTube", href: "https://www.youtube.com/saudefrugal" },
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
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
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
