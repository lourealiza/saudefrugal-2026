"use client";

import { useEffect, useState } from "react";
import { Leaf, Menu } from "./icons";
import { withBase } from "@/lib/base";

const links = [
  { label: "Sobre", href: "/sobre" },
  { label: "Cursos", href: "/cursos" },
  { label: "Retiros", href: "/#retiro" },
  { label: "Livros", href: "/#loja" },
  { label: "Loja", href: "/#loja" },
  { label: "Contato", href: "/#contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header" data-scrolled={scrolled}>
      <div className="wrap header__inner">
        <a href={withBase("/")} className="logo" aria-label="Dr. Corassa · Saúde Frugal">
          <Leaf className="leaf" />
          <span>
            Dr. <b>Corassa</b>
          </span>
        </a>

        <nav className="nav" aria-label="Navegação principal">
          <ul className="nav__links">
            {links.map((l) => (
              <li key={l.label}>
                <a href={withBase(l.href)}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a href={withBase("/#contato")} className="btn btn--primary">
            Agendar consulta
          </a>
          <button className="nav__toggle" aria-label="Abrir menu">
            <Menu />
          </button>
        </nav>
      </div>
    </header>
  );
}
