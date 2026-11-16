import { useEffect, useState } from "react";
import Booking from "@/components/Booking";
import DirectionChooser from "@/components/DirectionChooser";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Nav from "@/components/Nav";
import Packages from "@/components/Packages";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Story, { Ticker } from "@/components/Story";
import Testimonials from "@/components/Testimonials";
import { Icon } from "@/components/ui";
import { BookingProvider } from "@/lib/booking";
import { scrollToId } from "@/lib/motion";
import { ThemeProvider, useTheme } from "@/lib/theme";

function StickyReserve() {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => scrollToId("booking")}
      className={`group fixed right-5 bottom-5 z-[84] flex items-center gap-3 border border-ink bg-ink px-5 py-3.5 text-ondark shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] transition-all duration-500 md:hidden ${
        theme === "plum" ? "rounded-full" : ""
      } ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <Icon name="coupe" className="h-4 w-4 text-accent" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Reserve a date</span>
    </button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        <div className="relative min-h-screen bg-paper">
          <div className="grain-layer" aria-hidden />
          <DirectionChooser />
          <Nav />
          <main>
            <Hero />
            <Ticker />
            <Story />
            <Services />
            <Menu />
            <Process />
            <Packages />
            <Gallery />
            <Testimonials />
            <Booking />
            <Faq />
          </main>
          <Footer />
          <StickyReserve />
        </div>
      </BookingProvider>
    </ThemeProvider>
  );
}
