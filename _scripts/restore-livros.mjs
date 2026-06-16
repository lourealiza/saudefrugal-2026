// Restaura o conteúdo ORIGINAL (verbatim) dos livros nos produtos WooCommerce
// do site /2026/, puxando dos produtos da raiz (saudefrugal.com.br).
//
// SEGURANÇA:
//  - DRY-RUN por padrão (não grava). Use --apply para gravar.
//  - Mapa de destino EXPLÍCITO por ID (sem adivinhação de slug/título).
//  - Trava anti-perda: não sobrescreve um destino que já tenha MAIS texto que a
//    origem, a menos que você passe --force.
//  - --create cria como RASCUNHO os livros que ainda não existem no /2026/.
//
//   $env:WP_AUTH="usuario:application-password"
//   node _scripts/restore-livros.mjs                 # dry-run
//   node _scripts/restore-livros.mjs --apply         # atualiza só os mapeados
//   node _scripts/restore-livros.mjs --apply --create# atualiza + cria faltantes (rascunho)
//   node _scripts/restore-livros.mjs --apply --force # permite sobrescrever destino maior
import { writeFileSync } from "node:fs";

const ROOT = "https://saudefrugal.com.br/wp-json/wp/v2";
const SITE2026 = "https://saudefrugal.com.br/2026/wp-json/wp/v2";
const AUTH = "Basic " + Buffer.from(process.env.WP_AUTH || "").toString("base64");

const APPLY = process.argv.includes("--apply");
const CREATE = process.argv.includes("--create");
const FORCE = process.argv.includes("--force");

if (!process.env.WP_AUTH) {
  console.error('ERRO: defina WP_AUTH. Ex (PowerShell): $env:WP_AUTH="usuario:application-password"');
  process.exit(1);
}

// Livros: rótulo, slug do produto ORIGINAL na raiz, e ID do produto de DESTINO
// no /2026/ (null = não existe lá ainda; será criado só com --create).
// Mapa montado a partir de produtos-2026.json (npm run books:list).
// dest preenchido após a 1ª migração (criação em massa de 2026-06-16).
// NÃO voltar para null — senão uma nova execução recriaria produtos duplicados.
const BOOKS = [
  { label: "A Dieta do Éden", src: "dieta-do-eden", dest: 768535 },
  { label: "Jejum Higienista", src: "jejum-higienista", dest: 768536 },
  { label: "A Dieta Anticâncer", src: "cancer-tratamentos-naturais", dest: 768537 },
  { label: "Dieta Antidiabetes", src: "dieta-antidiabetes-o-estilo-de-vida-que-combate-a-diabetes", dest: 768538 },
  { label: "Nutrição Vegana", src: "nutricao-vegana", dest: 768539 },
  { label: "Vegan Fitness", src: "vegan-fitness", dest: 768540 },
  { label: "Doces Delícias", src: "doces-delicias", dest: 768541 },
  { label: "CRUlinária Frugal", src: "crulinaria-frugal", dest: 768126 },
  { label: "Cozinhando sem o Fogão", src: "delicias-da-natureza-cozinhando-sem-o-fogao", dest: 766801 },
  { label: "Veganismo para pais, mães e bebês", src: "veganismo-para-os-pais", dest: 768544 },
  { label: "Combo 6 livros didáticos", src: "combo-6-livros-didaticos", dest: 768545 },
  { label: "Combo 10 Livros", src: "combo-10-livros", dest: 768546 },
  { label: "Livros de receitas | 4 livros", src: "livros-de-receitas-naturais", dest: 768547 },
  { label: "Combo Saúde Frugal (presente)", src: "combo-saudefrugal-dieta-do-eden", dest: 768548 },
];

async function getJson(url, auth = false) {
  const r = await fetch(url, auth ? { headers: { Authorization: AUTH } } : {});
  if (!r.ok) return null;
  return r.json();
}
const textLen = (html) => (html || "").replace(/<[^>]+>/g, "").trim().length;

console.log(
  `\nModo: ${APPLY ? "APPLY (GRAVANDO no /2026/)" : "DRY-RUN (nada será gravado)"}` +
    `${CREATE ? " · --create" : ""}${FORCE ? " · --force" : ""}\n`
);

const log = [];
let updated = 0, created = 0, skippedNoSource = 0, skippedNoDest = 0, skippedGuard = 0, failed = 0;

for (const { label, src, dest } of BOOKS) {
  // 1) Conteúdo original da raiz
  const arr = await getJson(`${ROOT}/product?slug=${src}&_fields=id,link,title,content,excerpt`);
  const s = arr && arr[0];
  if (!s) {
    console.log(`✗ ${label}: ORIGEM não encontrada (slug=${src}) — pulado`);
    log.push({ label, src, status: "sem-origem" });
    skippedNoSource++;
    continue;
  }
  const content = s.content?.rendered || "";
  const excerpt = s.excerpt?.rendered || "";
  const srcChars = textLen(content);

  // 2) Sem destino mapeado
  if (!dest) {
    if (!CREATE) {
      console.log(`⚠ ${label}: sem produto no /2026/ (use --create p/ criar rascunho). [origem ${srcChars} ch]`);
      log.push({ label, src, status: "sem-destino", srcChars });
      skippedNoDest++;
      continue;
    }
    if (!APPLY) {
      console.log(`＋ ${label}: seria CRIADO como rascunho (slug=${src}, ${srcChars} ch)`);
      log.push({ label, src, status: "dry-run-criar", srcChars });
      created++;
      continue;
    }
    const rc = await fetch(`${SITE2026}/product`, {
      method: "POST",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify({ title: label, slug: src, content, excerpt, status: "draft" }),
    });
    if (rc.ok) {
      const np = await rc.json().catch(() => ({}));
      console.log(`＋ ${label} → criado #${np.id} (rascunho, ${srcChars} ch)`);
      log.push({ label, src, destId: np.id, srcChars, status: "criado-rascunho" });
      created++;
    } else {
      const body = await rc.text().catch(() => "");
      console.log(`✗ ${label}: FALHA ao criar ${rc.status} ${body.slice(0, 160)}`);
      log.push({ label, src, status: "falha-criar", http: rc.status });
      failed++;
    }
    continue;
  }

  // 3) Destino mapeado: lê estado atual
  const cur = await getJson(`${SITE2026}/product/${dest}?_fields=id,slug,content`, true);
  if (!cur) {
    console.log(`✗ ${label}: destino #${dest} não acessível — pulado`);
    log.push({ label, src, destId: dest, status: "destino-inacessivel" });
    failed++;
    continue;
  }
  const curChars = textLen(cur.content?.rendered);

  // Trava anti-perda: destino já tem mais texto que a origem
  if (curChars > srcChars && !FORCE) {
    console.log(
      `⛔ ${label} → #${dest} (${cur.slug}): destino ${curChars} > origem ${srcChars} ch — ` +
        `PULADO p/ não perder conteúdo (use --force se realmente quiser sobrescrever)`
    );
    log.push({ label, src, destId: dest, curChars, srcChars, status: "guard-skip" });
    skippedGuard++;
    continue;
  }

  if (!APPLY) {
    console.log(`• ${label} → #${dest} (${cur.slug}): destino ${curChars} → origem ${srcChars} ch [seria atualizado]`);
    log.push({ label, src, destId: dest, curChars, srcChars, status: "dry-run-update" });
    continue;
  }

  const r = await fetch(`${SITE2026}/product/${dest}`, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify({ content, excerpt }),
  });
  if (r.ok) {
    console.log(`✓ ${label} → #${dest} (${cur.slug}): atualizado (${srcChars} ch)`);
    log.push({ label, src, destId: dest, srcChars, status: "atualizado" });
    updated++;
  } else {
    const body = await r.text().catch(() => "");
    console.log(`✗ ${label} → #${dest}: FALHA ${r.status} ${body.slice(0, 160)}`);
    log.push({ label, src, destId: dest, status: "falha", http: r.status });
    failed++;
  }
}

writeFileSync("restore-livros.log.json", JSON.stringify({ apply: APPLY, create: CREATE, force: FORCE, log }, null, 2), "utf8");
console.log(
  `\n==> ${APPLY ? "Concluído" : "DRY-RUN"}: ${updated} atualizados, ${created} ${APPLY ? "criados" : "a criar"}, ` +
    `${skippedGuard} barrados (destino maior), ${skippedNoDest} sem destino, ${skippedNoSource} sem origem, ${failed} falhas. ` +
    `Log: restore-livros.log.json`
);
if (!APPLY) console.log("Para gravar, rode com --apply (e --create p/ faltantes, --force p/ sobrescrever destino maior).");
