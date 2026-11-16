import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/data";
import { useBooking } from "@/lib/booking";
import { gsap, ScrollTrigger, scrollToId } from "@/lib/motion";
import { THEME_META, useTheme, type ThemeId } from "@/lib/theme";
import { Icon, Monogram } from "./ui";

const LINKS = [
  { id: "story", label: "The Story" },
  { id: "services", label: "Services" },
  { id: "menu", label: "Cocktail Menu" },
  { id: "packages", label: "Packages" },
  { id: "gallery", label: "Gallery" },
  { id: "words", label: "Kind Words" },
  { id: "faq", label: "Questions" },
];

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const { state } = useBooking();
  const cocktails = state.cocktails.length;
  const soft = theme === "plum";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 60,
      onUpdate: (self) => setScrolled(self.scroll() > 60),
    });
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.25 },
    });
    const links = LINKS.map((l) => l.id);
    ScrollTrigger.batch(`#${links.join(", #")}`, {
      start: "top 55%",
      end: "bottom 45%",
      onEnter: (els) => setActive(els[0]?.id ?? ""),
      onEnterBack: (els) => setActive(els[0]?.id ?? ""),
    });
    return () => {
      st.kill();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!menuRef.current) return;
    if (open) {
      gsap.fromTo(
        menuRef.current.querySelectorAll("[data-mi]"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.06, delay: 0.15 },
      );
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 260 : 0);
  };

  return (
    <>
      {/* utility strip */}
      <div
        className={`fixed inset-x-0 top-0 z-[70] hidden bg-ink text-ondarkdim transition-all duration-500 lg:block ${
          scrolled ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-2">
          <div className="flex items-center gap-6">
            <span className="eyebrow !tracking-[0.28em] text-accent/80">{BRAND.est}</span>
            <span className="text-[11px] tracking-wide">
              Serving {BRAND.areas.slice(0, 4).join(" · ")}
            </span>
          </div>
          <div className="flex items-center gap-6 text-[11px] tracking-wide">
            <a href={`tel:${BRAND.phone.replace(/[^\d]/g, "")}`} className="link-u hover:text-accent">
              {BRAND.phone}
            </a>
            <a href={`mailto:${BRAND.email}`} className="link-u hover:text-accent">
              {BRAND.email}
            </a>
            <span className="inline-flex items-center gap-2 text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Two dates open this season
            </span>
          </div>
        </div>
      </div>

      <header
        className={`fixed inset-x-0 z-[75] transition-all duration-500 ${scrolled ? "top-0" : "top-0 lg:top-[33px]"}`}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled ? "bg-paper/95 backdrop-blur-[2px] shadow-[0_1px_0_var(--c-line)]" : "bg-transparent"
          }`}
        >
          <div className={`mx-auto flex max-w-[1500px] items-center justify-between px-5 md:px-8 ${scrolled ? "py-3" : "py-5"}`}>
            {/* wordmark */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group flex items-center gap-3 text-left">
              <Monogram className={`h-9 w-9 transition-transform duration-700 group-hover:rotate-[18deg] ${scrolled ? "text-accentink" : "text-ondark/90 lg:text-accent"}`} spin={false} />
              <span className="leading-none">
                <span className={`display block text-[1.55rem] tracking-[0.02em] ${scrolled ? "text-ink" : "text-ondark lg:text-ondark"}`}>
                  Benita
                </span>
                <span className={`eyebrow block !text-[8px] ${scrolled ? "text-ink/62" : "text-ondark/60"}`}>Bar Co.</span>
              </span>
            </button>

            {/* desktop links */}
            <nav className="hidden items-center gap-7 xl:flex">
              {LINKS.slice(0, 6).map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`link-u relative py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    scrolled ? (active === l.id ? "text-accentink" : "text-ink/70 hover:text-ink") : active === l.id ? "text-accent" : "text-ondark/75 hover:text-ondark"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* inline theme swap */}
              <div className={`hidden items-center gap-1 border p-1 md:flex ${soft ? "rounded-full" : ""} ${scrolled ? "border-line" : "border-ondark/25"}`}>
                {(Object.keys(THEME_META) as ThemeId[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    title={THEME_META[t].name}
                    aria-pressed={theme === t}
                    className={`group relative h-6 w-6 overflow-hidden transition-transform duration-300 hover:scale-110 ${soft ? "rounded-full" : ""}`}
                    style={{ background: THEME_META[t].ink }}
                  >
                    <span className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: THEME_META[t].swatch[2] }} />
                    {theme === t && <span className="absolute inset-0 border border-accent" />}
                  </button>
                ))}
              </div>

              {cocktails > 0 && (
                <button
                  onClick={() => go("booking")}
                  title="Drinks added to your menu"
                  className={`group hidden items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 lg:inline-flex ${soft ? "rounded-full" : ""} ${
                    scrolled ? "border-line text-ink hover:border-accentink" : "border-ondark/30 text-ondark hover:border-accent"
                  }`}
                >
                  <Icon name="glass2" className={`h-4 w-4 ${scrolled ? "text-accentink" : "text-accent"}`} />
                  Menu {cocktails}/4
                  <span className="flex gap-[3px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${i < cocktails ? (scrolled ? "bg-accentink" : "bg-accent") : scrolled ? "bg-ink/20" : "bg-ondark/25"}`} />
                    ))}
                  </span>
                </button>
              )}

              <button
                onClick={() => go("booking")}
                className={`btn btn-solid hidden !px-6 !py-3 !text-[10px] md:inline-flex ${soft ? "!rounded-full" : ""}`}
              >
                <span>Reserve a date</span>
              </button>

              <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Menu"
                className={`flex h-11 w-11 items-center justify-center border transition-colors xl:hidden ${soft ? "rounded-full" : ""} ${
                  scrolled ? "border-line text-ink" : "border-ondark/30 text-ondark"
                }`}
              >
                <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-px w-full origin-left scale-x-0 bg-accent" ref={barRef} />
        </div>
      </header>

      {/* mobile overlay */}
      {open && (
        <div ref={menuRef} className="fixed inset-0 z-[80] flex flex-col bg-ink px-6 py-7 text-ondark xl:hidden">
          <div className="flex items-center justify-between">
            <span className="display text-2xl">Benita</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center border border-ondark/25">
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-12 flex flex-col">
            {LINKS.map((l, i) => (
              <button
                key={l.id}
                data-mi
                onClick={() => go(l.id)}
                className="group flex items-baseline justify-between border-b border-ondark/12 py-4 text-left"
              >
                <span className="display text-[2.1rem] leading-none transition-transform duration-500 group-hover:translate-x-2">{l.label}</span>
                <span className="eyebrow text-accent/70">0{i + 1}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto grid gap-6 pt-10 sm:grid-cols-2" data-mi>
            <div>
              <span className="eyebrow text-accent">Studio</span>
              <p className="mt-3 text-sm text-ondarkdim">{BRAND.studio}</p>
            </div>
            <div>
              <span className="eyebrow text-accent">Reserve</span>
              <p className="mt-3 text-sm text-ondarkdim">
                {BRAND.phone}
                <br />
                {BRAND.email}
              </p>
            </div>
            <button onClick={() => go("booking")} className="btn btn-line !border-ondark/30 !text-ondark sm:col-span-2">
              <span>Reserve a date</span>
            </button>
          </div>
        </div>
      )}

      <ThemeDock />
    </>
  );
}

/* ------------------------------------------------------------ THEME DOCK */
function ThemeDock() {
  const { theme, setTheme, wiping } = useTheme();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const soft = theme === "plum";

  return (
    <div className="fixed bottom-5 left-5 z-[85] select-none">
      <div
        className="flex items-end gap-3"
        onMouseEnter={() => {
          setHovered(true);
          setOpen(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
          setOpen(false);
        }}
      >
        <div
          className={`overflow-hidden border border-line bg-paper/95 transition-all duration-500 ${soft ? "rounded-full" : ""} ${
            open ? "max-w-[420px] opacity-100" : "max-w-0 border-transparent opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <span className="eyebrow hidden whitespace-nowrap text-ink/60 sm:block">Design direction</span>
            {(Object.keys(THEME_META) as ThemeId[]).map((t, i) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                disabled={wiping}
                className={`group flex items-center gap-2 border px-3 py-2 text-left transition-all duration-300 ${soft ? "rounded-full" : ""} ${
                  theme === t ? "border-ink bg-ink text-ondark" : "border-line text-ink hover:border-accent2"
                }`}
              >
                <span className="flex">
                  {THEME_META[t].swatch.map((c) => (
                    <span key={c} className="h-4 w-2 first:rounded-l-full last:rounded-r-full" style={{ background: c }} />
                  ))}
                </span>
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] lg:block">
                  {String.fromCharCode(65 + i)} · {THEME_META[t].name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (!hovered) setOpen((o) => !o);
          }}
          aria-label="Switch design direction"
          aria-expanded={open}
          className={`group relative flex h-14 w-14 shrink-0 items-center justify-center border border-ink bg-ink text-ondark shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:-translate-y-1 ${
            soft ? "rounded-full" : ""
          }`}
        >
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-accent transition-transform duration-500 group-hover:scale-y-0" />
          </span>
          <span className="relative flex flex-col items-center gap-[3px]">
            <span className="block h-[3px] w-[18px] bg-ondark" style={{ background: THEME_META.espresso.accent }} />
            <span className="block h-[3px] w-[18px]" style={{ background: THEME_META.plum.accent2 }} />
          </span>
          <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-ink">
            {theme === "espresso" ? "A" : "B"}
          </span>
        </button>
      </div>
    </div>
  );
}
