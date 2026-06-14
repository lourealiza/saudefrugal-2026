import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pillars from "@/components/Pillars";
import Feature from "@/components/Feature";
import Ebook from "@/components/Ebook";
import Proof from "@/components/Proof";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { WhatsApp } from "@/components/icons";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Pillars />
        <Feature />
        <Ebook />
        <Proof />
      </main>
      <Footer />

      <a
        className="wa-float"
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
      >
        <WhatsApp />
      </a>

      <ScrollReveal />
    </>
  );
}
