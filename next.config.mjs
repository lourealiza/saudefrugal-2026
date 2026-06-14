// Empty for the custom-domain (root) build; "/saudefrugal-2026" for the
// GitHub Pages subpath preview. Set via NEXT_PUBLIC_BASE_PATH in CI.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages (no Node server).
  output: "export",
  // Pages serves folders; /cursos -> /cursos/index.html
  trailingSlash: true,
  // GitHub Pages can't run the Next.js image optimizer.
  images: { unoptimized: true },
  basePath: basePath || undefined,
  reactStrictMode: true,
};

export default nextConfig;
