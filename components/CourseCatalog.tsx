"use client";

import { useState } from "react";
import { Arrow } from "./icons";

type Course = {
  title: string;
  desc: string;
  level: "Iniciante" | "Intermediário" | "Todos os níveis";
  category: "Saúde" | "Receitas" | "Formação";
  c1: string;
  c2: string;
};

const courses: Course[] = [
  {
    title: "Mais Saúde com Jejum",
    desc: "Aprenda a jejuar com segurança para emagrecer, descansar o organismo e prevenir doenças.",
    level: "Iniciante",
    category: "Saúde",
    c1: "#4a7a4f",
    c2: "#1d4029",
  },
  {
    title: "Método de Saúde Máxima",
    desc: "O passo a passo completo do Dr. Corassa para reorganizar sua alimentação e seus hábitos.",
    level: "Todos os níveis",
    category: "Saúde",
    c1: "#5a8a5a",
    c2: "#234d2e",
  },
  {
    title: "Dieta Anticâncer",
    desc: "O que a ciência mostra sobre alimentação e prevenção do câncer, na prática e sem promessas mágicas.",
    level: "Intermediário",
    category: "Saúde",
    c1: "#3f7a4c",
    c2: "#14271a",
  },
  {
    title: "Dieta Antidiabetes",
    desc: "Estratégias alimentares para controlar a glicemia e reduzir a dependência de medicação — com seu médico.",
    level: "Intermediário",
    category: "Saúde",
    c1: "#6f9159",
    c2: "#2e5e3a",
  },
  {
    title: "Programa do Corpo Perfeito",
    desc: "Composição corporal saudável unindo alimentação natural, exercício e descanso.",
    level: "Todos os níveis",
    category: "Saúde",
    c1: "#7e9a6e",
    c2: "#3e6a40",
  },
  {
    title: "Leites e Queijos Vegetais",
    desc: "Faça em casa leites, queijos e cremes vegetais saborosos, sem ultraprocessados.",
    level: "Iniciante",
    category: "Receitas",
    c1: "#caa84a",
    c2: "#6f6320",
  },
  {
    title: "Doces à Vontade",
    desc: "Sobremesas naturais que cabem na rotina — doçura de verdade, sem açúcar refinado.",
    level: "Iniciante",
    category: "Receitas",
    c1: "#d08a4e",
    c2: "#7a3f1e",
  },
  {
    title: "Sorvetes e Milk-shakes",
    desc: "Versões geladas, cremosas e naturais dos clássicos que todo mundo ama.",
    level: "Iniciante",
    category: "Receitas",
    c1: "#c47b6a",
    c2: "#6a2f24",
  },
  {
    title: "Formação de Nutricionistas Higienistas",
    desc: "Formação aprofundada para profissionais que querem atuar com medicina do estilo de vida.",
    level: "Intermediário",
    category: "Formação",
    c1: "#3a5a8a",
    c2: "#16243d",
  },
];

const categories = ["Todos", "Saúde", "Receitas", "Formação"] as const;

export default function CourseCatalog() {
  const [active, setActive] = useState<(typeof categories)[number]>("Todos");
  const list =
    active === "Todos" ? courses : courses.filter((c) => c.category === active);

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
            key={c.title}
            className="course"
            style={{ ["--c1" as string]: c.c1, ["--c2" as string]: c.c2 }}
          >
            <div className="course__thumb">
              <span className="course__level">{c.level}</span>
            </div>
            <div className="course__body">
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="course__meta">
                <span>Online</span>
                <span className="dot-sep" />
                <span>No seu ritmo</span>
                <span className="dot-sep" />
                <span>Acesso vitalício</span>
              </div>
              <a href="#" className="course__cta">
                Ver curso <Arrow className="arrow" size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
