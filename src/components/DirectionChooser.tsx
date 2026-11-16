import { useEffect, useRef, useState } from "react";
import { gsap, reduced } from "@/lib/motion";
import { THEME_META, useTheme, type ThemeId } from "@/lib/theme";
import { IMG } from "@/lib/data";
import { Icon, Monogram } from "./ui";

const COPY: Record<ThemeId, { letter: string; headline: string; body: string; img: string; traits: string[] }> = {
  espresso: {
    letter: "A",
    headline: "Espresso & Latte",
    body: "Warm luxury — natural textures, cinematic amber light, oversized Cormorant Garamond and cream editorial sections that turn espresso-dark for drama.",
    img: IMG.heroA,
    traits: ["Cormorant Garamond + Manrope", "Sharp editorial frames", "Printed cocktail list"],
  },
  plum: {
    letter: "B",
    headline: "Plum & Rose",
    body: "Romantic luxury — deep plum interiors, blush editorial pages, arch-framed imagery, soft atmospheric light and Playfair Display set like fashion copy.",
    img: IMG.heroB,
    traits: ["Playfair Display + Inter", "Arch-topped imagery", "Card menu with modal detail"],
  },
};

export default function DirectionChooser() {
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<ThemeId | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("benita-theme");
    } catch {
      /* ignore */
    }
    if (saved) return;
    const t = window.setTimeout(() => setOpen(true), 420);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open || !root.current) return;
    document.body.style.overflow = "hidden";
    if (!reduced()) {
      gsap.fromTo(".dc-panel", { yPercent: (i) => (i === 0 ? -100 : 100) }, { yPercent: 0, duration: 1.1, ease: "expo.inOut", stagger: 0.08 });
      gsap.fromTo(".dc-ui", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08, delay: 0.55 });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const choose = (t: ThemeId) => {
    setOpen(false);
    document.body.style.overflow = "";
    if (t !== theme) window.setTimeout(() => setTheme(t), 220);
    else {
      try {
        localStorage.setItem("benita-theme", t);
      } catch {
        /* ignore */
      }
    }
  };

  if (!open) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] flex flex-col bg-[#1A1210]">
      <header className="dc-ui flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-[#F5EFE5] md:px-10">
        <span className="flex items-center gap-3">
          <Monogram className="h-9 w-9 text-[#C7A477]" />
          <span className="leading-none">
            <span className="display block text-[1.4rem]">Benita Bar Co.</span>
            <span className="eyebrow block !text-[8px] text-[#F5EFE5]/50">Two design directions</span>
          </span>
        </span>
        <button
          onClick={() => choose(theme)}
          className="group inline-flex items-center gap-2 border border-[#F5EFE5]/25 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#F5EFE5]/70 transition-colors hover:border-[#C7A477] hover:text-[#C7A477]"
        >
          Skip — enter with {theme === "espresso" ? "A" : "B"}
          <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        {(Object.keys(COPY) as ThemeId[]).map((t) => {
          const c = COPY[t];
          const m = THEME_META[t];
          const on = hover === t;
          return (
            <button
              key={t}
              onMouseEnter={() => setHover(t)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(t)}
              onClick={() => choose(t)}
              className="dc-panel group relative flex min-h-[52svh] flex-1 items-end overflow-hidden text-left transition-[flex-grow] duration-700 ease-out md:min-h-0"
              style={{ flexGrow: hover ? (on ? 1.5 : 0.75) : 1, background: m.ink }}
            >
              <img
                src={c.img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-25 transition-all duration-[1.4s] ease-out group-hover:scale-105 group-hover:opacity-40"
                style={{ filter: "saturate(.7) contrast(1.05)" }}
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${m.ink} 12%, transparent 78%)` }} />
              <div className="relative w-full p-7 md:p-10">
                <span className="display text-[3.4rem] leading-none" style={{ color: m.accent }}>
                  {c.letter}
                </span>
                <h2 className="display mt-3 text-[clamp(2rem,4.4vw,3.6rem)] leading-none" style={{ color: m.swatch[4] }}>
                  {c.headline}
                </h2>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em]" style={{ color: m.accent }}>
                  {m.subtitle}
                </p>
                <p className="mt-5 max-w-md text-[13.5px] leading-relaxed" style={{ color: `${m.swatch[4]}b0` }}>
                  {c.body}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {m.swatch.map((s) => (
                    <span key={s} className="h-7 w-7 rounded-full border" style={{ background: s, borderColor: `${m.swatch[4]}30` }} />
                  ))}
                </div>
                <ul className="mt-6 hidden space-y-1.5 lg:block">
                  {c.traits.map((tr) => (
                    <li key={tr} className="text-[11.5px] uppercase tracking-[0.14em]" style={{ color: `${m.swatch[4]}90` }}>
                      — {tr}
                    </li>
                  ))}
                </ul>
                <span
                  className="mt-8 inline-flex items-center gap-3 border px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-500 group-hover:gap-5"
                  style={{ borderColor: m.accent, color: m.accent }}
                >
                  Preview direction {c.letter}
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <footer className="dc-ui px-6 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-[#F5EFE5]/35 md:px-10">
        You can switch direction at any time from the dock in the corner
      </footer>
    </div>
  );
}
