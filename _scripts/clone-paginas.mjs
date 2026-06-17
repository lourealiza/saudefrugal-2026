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
const AUTH = "Basic " + Buffer.from(process.env.WP_AUTH || "").toString("base64");
const APPLY = process.argv.includes("--apply");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1] || null;

if (!process.env.WP_AUTH) {
  console.error('ERRO: defina WP_AUTH. Ex: $env:WP_AUTH="usuario:application-password"');
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
  return { ok: r.ok, status: r.status, json: await r.json().catch(() => null), text: null };
}
const authGet = (url) => req(url, { headers: { Authorization: AUTH } });

const log = [];
let done = 0, failed = 0, noLayout = 0;

for (const slug of PAGES) {
  // 1) Lê a página da raiz COM meta
  const src = await authGet(`${ROOT}/pages?slug=${slug}&_fields=id,slug,title,content,template,meta`);
  const p = (src.json || []).find((x) => x.slug === slug) || (src.json || [])[0];
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
  const ex = await authGet(`${SITE2026}/pages?slug=${slug}&status=any&_fields=id,slug`);
  const dest = (ex.json || []).find((x) => x.slug === slug);

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
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
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
