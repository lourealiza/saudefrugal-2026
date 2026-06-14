// Prefixes root-relative hrefs with the deploy base path so the site works
// both at the domain root (saudefrugal.com.br) and under a GitHub Pages
// subpath (lourealiza.github.io/saudefrugal-2026).
//
// Controlled by NEXT_PUBLIC_BASE_PATH (set in CI for the subpath preview;
// empty for the custom-domain production build).
export const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(href: string): string {
  // Only rewrite internal, root-relative links. Leave "#hash", external
  // URLs (https://…, mailto:, wa.me) and bare "#" placeholders untouched.
  return href.startsWith("/") ? `${base}${href}` : href;
}
