// CLONE FIEL — recria as PÁGINAS dos livros no /2026/ preservando o layout
// Elementor (_elementor_data + settings).
//
// PRÉ-REQUISITO: o mu-plugin _scripts/wp-mu-plugin/expose-elementor-meta.php
// precisa estar instalado em wp-content/mu-plugins/ NOS DOIS sites (raiz p/ ler,
// /2026/ p/ gravar). Sem ele, _elementor_data não aparece na REST e o clone
// copia só o texto, sem layout.
//
//   $env:WP_AUTH="usuario:application-password"
//   node _scripts/clone-paginas.mjs                 # DRY-RUN: valida leitura da meta
//   node _scripts/clone-paginas.mjs --only=a-dieta-do-eden          # testa 1 página
//   node _scripts/clone-paginas.mjs --only=a-dieta-do-eden --apply  # cria/atualiza essa página
//   node _scripts/clone-paginas.mjs --apply         # processa TODAS as 10
//
// RECOMENDADO: rode com --only=<slug> --apply em UMA página primeiro, confira o
// resultado no /2026/ (e clique em Elementor > Ferramentas > Regenerar CSS se o
// estilo não aparecer), e só então rode todas.
import { writeFileSync } from "node:fs";

const ROOT = "https://saudefrugal.com.br/wp-json/wp/v2";
const SITE2026 = "https://saudefrugal.com.br/2026/wp-json/wp/v2";
const APPLY = process.argv.includes("--apply");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1] || null;

// Credenciais SEPARADAS por site (Application Password é por instalação do WP):
//   WP_AUTH_ROOT  -> ler as páginas na raiz saudefrugal.com.br (precisa de edit_pages)
//   WP_AUTH_2026  -> gravar no /2026/
// Se uma delas não for definida, cai em WP_AUTH (compatibilidade).
// IMPORTANTE: use o LOGIN (username), não o e-mail — a raiz recusa e-mail.
const RAW_ROOT = process.env.WP_AUTH_ROOT || process.env.WP_AUTH || "";
const RAW_2026 = process.env.WP_AUTH_2026 || process.env.WP_AUTH || "";
const AUTH_ROOT = "Basic " + Buffer.from(RAW_ROOT).toString("base64");
const AUTH_2026 = "Basic " + Buffer.from(RAW_2026).toString("base64");

const isPlaceholder = (s) => /SEU_USUARIO|SUA_APPLICATION_PASSWORD|SEU_LOGIN_WP|usuario:application-password|login_do_wp/i.test(s);
if (!RAW_ROOT || !RAW_2026) {
  console.error(
    "ERRO: defina as credenciais dos DOIS sites (Application Password é por site):\n" +
      '  $env:WP_AUTH_ROOT="login_raiz:xxxx xxxx xxxx xxxx xxxx xxxx"   # ler na raiz\n' +
      '  $env:WP_AUTH_2026="login_2026:yyyy yyyy yyyy yyyy yyyy yyyy"  # gravar no /2026/'
  );
  process.exit(1);
}
if (isPlaceholder(RAW_ROOT) || isPlaceholder(RAW_2026)) {
  console.error("ERRO: alguma credencial ainda está com o texto de exemplo. Use o LOGIN real (não e-mail) e a Application Password gerada NAQUELE site.");
  process.exit(1);
}

// slug da PÁGINA na raiz (confirmados pelo cliente). O slug é reutilizado no /2026/.
const PAGES = [
  "a-dieta-do-eden",
  "jejum-higienista-a-cirurgia-da-natureza",
  "adietaanticancer",
  "dieta-antidiabetes",
  "nutricao-vegana",
  "vegan-fitness-receitas-do-atleta-natural",
  "crulinaria-frugal-doces-delicias",
  "crulinaria-frugal-receitas-do-paraiso",
  "delicias-da-natureza-cozinhando-sem-o-fogao",
  "veganismo-para-bebes-maes-e-pais",
].filter((s) => !ONLY || s === ONLY);

const ELEMENTOR_META = [
  "_elementor_data",
  "_elementor_page_settings",
  "_elementor_template_type",
  "_elementor_version",
  "_elementor_edit_mode",
  "_wp_page_template",
];

async function req(url, opts) {
  const r = await fetch(url, opts);
  return { ok: r.ok, status: r.status, json: await r.json().catch(() => null) };
}
const getRoot = (url) => req(url, { headers: { Authorization: AUTH_ROOT } });
const get2026 = (url) => req(url, { headers: { Authorization: AUTH_2026 } });
// REST de coleção devolve array; em erro (401/403/…) devolve objeto {code,message}.
const asList = (res) => (Array.isArray(res.json) ? res.json : null);
const errMsg = (res) =>
  `HTTP ${res.status}${res.json && res.json.code ? ` ${res.json.code}: ${String(res.json.message || "").replace(/<[^>]+>/g, "")}` : ""}`;

// Preflight: valida AS DUAS credenciais antes de iterar.
const meRoot = await getRoot(`${ROOT}/users/me?_fields=id,name,slug`);
if (!meRoot.ok) {
  console.error(
    `ERRO de autenticação na RAIZ: ${errMsg(meRoot)}\n` +
      "Use o LOGIN (não e-mail) e uma Application Password gerada NA RAIZ em WP_AUTH_ROOT."
  );
  process.exit(1);
}
const me2026 = await get2026(`${SITE2026}/users/me?_fields=id,name,slug`);
if (!me2026.ok) {
  console.error(`ERRO de autenticação no /2026/: ${errMsg(me2026)}\nVerifique WP_AUTH_2026.`);
  process.exit(1);
}
console.log(
  `Autenticado — raiz: ${meRoot.json?.name || meRoot.json?.slug} (#${meRoot.json?.id}) · ` +
    `/2026/: ${me2026.json?.name || me2026.json?.slug} (#${me2026.json?.id})\n`
);

const log = [];
let done = 0, failed = 0, noLayout = 0;

for (const slug of PAGES) {
  // 1) Lê a página da raiz COM meta
  const src = await getRoot(`${ROOT}/pages?slug=${slug}&_fields=id,slug,title,content,template,meta`);
  const list = asList(src);
  if (!list) {
    console.log(`✗ ${slug}: resposta inesperada da raiz — ${errMsg(src)} (mu-plugin instalado na RAIZ?)`);
    log.push({ slug, status: "erro-origem", http: src.status });
    failed++;
    continue;
  }
  const p = list.find((x) => x.slug === slug) || list[0];
  if (!p) {
    console.log(`✗ ${slug}: não encontrada na raiz`);
    log.push({ slug, status: "origem-inexistente" });
    failed++;
    continue;
  }
  const elData = p.meta?._elementor_data;
  const hasLayout = typeof elData === "string" && elData.length > 2;
  if (!hasLayout) {
    console.log(`⚠ ${slug}: _elementor_data NÃO veio na REST — mu-plugin instalado na RAIZ? (copiaria só texto)`);
    noLayout++;
  }

  // monta meta a copiar (só o que veio)
  const meta = {};
  for (const k of ELEMENTOR_META) if (p.meta && p.meta[k] != null && p.meta[k] !== "") meta[k] = p.meta[k];
  // garante modo builder no destino
  meta._elementor_edit_mode = "builder";
  if (!meta._elementor_template_type) meta._elementor_template_type = "wp-page";

  const title = (p.title?.rendered || slug).replace(/<[^>]+>/g, "");
  const payloadBase = { title, slug, status: "draft", content: p.content?.rendered || "", template: p.template || "", meta };

  // 2) Já existe no /2026/? (evita duplicata)
  const ex = await get2026(`${SITE2026}/pages?slug=${slug}&status=any&_fields=id,slug`);
  const dest = (asList(ex) || []).find((x) => x.slug === slug);

  if (!APPLY) {
    console.log(
      `• ${slug}: origem #${p.id} (layout ${hasLayout ? (elData.length + " bytes") : "AUSENTE"}) → ` +
        `${dest ? "atualizaria #" + dest.id : "criaria nova"} no /2026/ [dry-run]`
    );
    log.push({ slug, srcId: p.id, hasLayout, destId: dest?.id || null, action: "dry-run" });
    continue;
  }

  // 3) Cria ou atualiza
  const url = dest ? `${SITE2026}/pages/${dest.id}` : `${SITE2026}/pages`;
  const r = await req(url, {
    method: "POST",
    headers: { Authorization: AUTH_2026, "Content-Type": "application/json" },
    body: JSON.stringify(payloadBase),
  });
  if (r.ok) {
    console.log(`✓ ${slug}: ${dest ? "atualizada" : "criada"} #${r.json?.id} (layout ${hasLayout ? "ok" : "AUSENTE"})`);
    log.push({ slug, srcId: p.id, destId: r.json?.id, hasLayout, action: dest ? "atualizada" : "criada" });
    done++;
  } else {
    console.log(`✗ ${slug}: FALHA ${r.status} ${JSON.stringify(r.json).slice(0, 200)}`);
    log.push({ slug, status: "falha", http: r.status });
    failed++;
  }
}

writeFileSync("clone-paginas.log.json", JSON.stringify({ apply: APPLY, only: ONLY, log }, null, 2), "utf8");
console.log(
  `\n==> ${APPLY ? "Concluído" : "DRY-RUN"}: ${done} gravadas, ${noLayout} sem layout (cheque mu-plugin na raiz), ` +
    `${failed} falhas. Log: clone-paginas.log.json`
);
if (APPLY && done) {
  console.log(
    "Pós-gravação: no /2026/, vá em Elementor > Ferramentas > Regenerar Arquivos & Dados se o estilo não aparecer. " +
      "Imagens podem apontar para /wp-content/uploads da raiz (carregam, mas idealmente reimportar a mídia)."
  );
}
