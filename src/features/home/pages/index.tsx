import Header from "../components/header";
import Hero from "../components/hero";
import About from "../components/about";
import Skills from "../components/skills";
import Contact from "../components/contact";
import Footer from "../components/footer";
import CursorSpotlight from "@/shared/components/cursor-spotlight";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <CursorSpotlight />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
