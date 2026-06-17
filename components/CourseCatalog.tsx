"use client";

import { useState } from "react";
import { Arrow } from "./icons";
import { withBase } from "@/lib/base";
import { cursos } from "@/lib/data/cursos";

const categories = ["Todos", "Saúde", "Receitas"] as const;

export default function CourseCatalog() {
  const [active, setActive] = useState<(typeof categories)[number]>("Todos");
  const list = active === "Todos" ? cursos : cursos.filter((c) => c.categoria === active);

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filtrar cursos por categoria">
        {categories.map((cat) => (
          <button
            key={cat}
            className="chip"
            role="tab"
            aria-selected={active === cat}
            data-active={active === cat}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="courses">
        {list.map((c) => (
          <article
            key={c.slug}
            className="course"
            style={{ ["--c1" as string]: c.c1, ["--c2" as string]: c.c2 }}
          >
            <a href={withBase(`/cursos/${c.slug}`)} className="course__thumb">
              <span className="course__level">{c.nivel}</span>
            </a>
            <div className="course__body">
              <h3>
                <a href={withBase(`/cursos/${c.slug}`)}>{c.title}</a>
              </h3>
              <p>{c.excerpt}</p>
              <div className="course__meta">
                <span>Online</span>
                <span className="dot-sep" />
                <span>No seu ritmo</span>
                <span className="dot-sep" />
                <span>Acesso vitalício</span>
              </div>
              <a href={withBase(`/cursos/${c.slug}`)} className="course__cta">
                Ver curso <Arrow className="arrow" size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
