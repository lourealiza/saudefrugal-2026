# Saúde Frugal 2026 — Redesign

Redesign da homepage do **Dr. Eduardo Corassa · Saúde Frugal**, construído em Next.js (App Router) e pronto para deploy na Vercel.

## Conceito de design

Direção visual: **naturalismo editorial caloroso**.

- **Fundo** cor de papel/creme (não branco estéril) com textura sutil de grão.
- **Verde-erva** profundo como cor primária (autoridade em saúde, natural).
- **Terracota/argila** como cor de ação nos CTAs (no lugar do laranja estridente do site antigo).
- **Tipografia**: serifa display [Fraunces](https://fonts.google.com/specimen/Fraunces) (orgânica, editorial) + corpo [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk).

O objetivo do redesign foi transformar o site de uma "lista de links" em uma **homepage com funil de conversão**: hero com proposta de valor clara → quatro caminhos (Cursos, Retiros, Livros, Consulta) → retiro em destaque → captura de e-mail (e-book) → prova social → rodapé.

## Stack

- [Next.js 15](https://nextjs.org/) — App Router, componentes server/client
- React 19 + TypeScript
- CSS puro com design tokens (sem framework de UI) — veja [`app/globals.css`](app/globals.css)
- Fontes via `next/font` (self-hosted, sem layout shift)

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # build de produção
npm run start      # serve o build de produção
```

## Estrutura

```
app/
  layout.tsx       # fontes, metadados, <html>
  page.tsx         # composição da home
  globals.css      # design system (tokens, tipografia, seções)
components/
  Header.tsx       # navegação sticky (client — estado de scroll)
  Hero.tsx         # headline editorial + stats + retrato
  Marquee.tsx      # faixa rolante de temas
  Pillars.tsx      # quatro caminhos
  Feature.tsx      # retiro em destaque
  Ebook.tsx        # captura de e-mail / lead magnet
  Proof.tsx        # vídeos + depoimento
  Footer.tsx       # rodapé + redes sociais
  ScrollReveal.tsx # animações de entrada por scroll (IntersectionObserver)
  icons.tsx        # ícones SVG inline
```

## Pendências para produção (conteúdo real)

Os pontos abaixo usam placeholders e devem ser substituídos pelo material do cliente:

- [ ] **Foto do Dr. Corassa** no hero → `components/Hero.tsx` (`.hero__portrait`)
- [ ] **Foto do retiro** → `components/Feature.tsx` (`.feature__media`)
- [ ] **Capa real do e-book** → `components/Ebook.tsx`
- [ ] **Thumbnails / links reais dos vídeos** do YouTube → `components/Proof.tsx`
- [ ] **Depoimentos reais** (com autorização) → `components/Proof.tsx`
- [ ] **Número do WhatsApp** e URLs das redes sociais → `Header`, `Footer`, `wa.me/`
- [ ] Integrar o formulário do e-book a um provedor de e-mail (Mailchimp/Brevo/etc.)
- [ ] Links de navegação reais para as páginas internas (cursos, loja, blog)

## Deploy na Vercel

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # produção
```
