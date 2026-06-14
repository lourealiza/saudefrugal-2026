/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages (no Node server).
  output: "export",
  // Pages serves folders; /cursos -> /cursos/index.html
  trailingSlash: true,
  // GitHub Pages can't run the Next.js image optimizer.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
