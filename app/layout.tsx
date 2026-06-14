import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dr. Eduardo Corassa · Saúde Frugal — Saúde de verdade pelo estilo de vida",
  description:
    "Cursos online, retiros presenciais, livros e consultas com o Dr. Eduardo Corassa. Medicina do estilo de vida, alimentação natural e jejum para transformar sua saúde.",
  keywords: [
    "saúde frugal",
    "Dr. Corassa",
    "alimentação natural",
    "jejum",
    "medicina do estilo de vida",
    "nutrição vegana",
  ],
  openGraph: {
    title: "Saúde Frugal — Dr. Eduardo Corassa",
    description:
      "Transforme sua saúde pelo estilo de vida: cursos, retiros, livros e consultas.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
