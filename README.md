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
  cursos/page.tsx  # catálogo de cursos (filtro + como funciona + FAQ)
  sobre/page.tsx   # página institucional do Dr. Corassa
  globals.css      # design system (tokens, tipografia, seções, páginas)
components/
  Header.tsx       # navegação sticky (client — estado de scroll)
  CourseCatalog.tsx# catálogo filtrável por categoria (client)
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

## Deploy (GitHub Pages)

O site é publicado automaticamente via GitHub Actions a cada `push` na `main`
(workflow em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)),
como **export estático** (`output: 'export'`).

### Preview atual (subcaminho)
Enquanto o domínio próprio não está ativo, o build usa `NEXT_PUBLIC_BASE_PATH=/saudefrugal-2026`
para funcionar em:

> https://lourealiza.github.io/saudefrugal-2026/

### Go-live no domínio próprio (saudefrugal.com.br)
Quando quiser apontar o domínio (isso **substitui o site atual no ar**):

1. **DNS** (no Cloudflare do domínio):
   - 4 registros **A** do apex `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** `www` → `lourealiza.github.io`
   - Durante a verificação, deixe como **DNS only** (nuvem cinza)
2. No repositório: **Settings → Pages → Custom domain** = `saudefrugal.com.br` e marque **Enforce HTTPS**.
3. No workflow [`deploy.yml`](.github/workflows/deploy.yml), **remova** o bloco
   `env: NEXT_PUBLIC_BASE_PATH: /saudefrugal-2026` do passo de build (o site
   passa a servir na raiz). O arquivo [`public/CNAME`](public/CNAME) já contém o domínio.
4. Faça `push` — o deploy republica na raiz do domínio.

> Para alternar local/raiz manualmente: `NEXT_PUBLIC_BASE_PATH=/saudefrugal-2026 npm run build`
> (subcaminho) vs `npm run build` (raiz).

## Alternativa: deploy na Vercel

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # produção
```
Na Vercel não há export estático nem `basePath` — bastaria remover `output: 'export'`.
