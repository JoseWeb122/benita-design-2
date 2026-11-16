import { useEffect, useRef } from "react";
import { BRAND, COCKTAILS, IMG, STATS, TICKER } from "@/lib/data";
import { gsap, reduced, scrollToId, useHeroTimeline } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Btn, Eyebrow, Icon, Marquee, Ornament, StrengthMeter } from "./ui";

const HERO_COCKTAIL = COCKTAILS[0];

export default function Hero() {
  const { theme } = useTheme();
  return theme === "espresso" ? <HeroEspresso /> : <HeroPlum />;
}

/* ================================================================ OPTION A */
function HeroEspresso() {
  const root = useRef<HTMLElement>(null);

  useHeroTimeline((tl) => {
    tl.from(".he-eyebrow", { opacity: 0, y: 18, duration: 0.9 })
      .to(".he-mask .w-i", { y: "0%", duration: 1.35, stagger: 0.05, ease: "expo.out" }, "-=0.5")
      .from(".he-lede", { opacity: 0, y: 24, duration: 1 }, "-=0.9")
      .from(".he-cta > *", { opacity: 0, y: 22, duration: 0.85, stagger: 0.1 }, "-=0.8")
      .from(".he-stat", { opacity: 0, y: 20, duration: 0.7, stagger: 0.07 }, "-=0.7")
      .fromTo(".he-img", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "expo.inOut" }, 0.35)
      .from(".he-card", { opacity: 0, y: 40, scale: 0.96, duration: 1.1, ease: "expo.out" }, "-=0.9")
      .from(".he-badge", { opacity: 0, scale: 0.6, rotate: -25, duration: 1.1, ease: "expo.out" }, "-=1")
      .from(".he-rail", { opacity: 0, duration: 1 }, "-=1");
  }, []);

  useEffect(() => {
    if (reduced()) return;
    const root2 = root.current;
    if (!root2) return;
    const q = gsap.utils.selector(root2);
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(q(".he-par"), { x: x * -14, y: y * -10, duration: 1.4, ease: "power3.out", stagger: 0.04 });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const lines = ["Every good party", "ends at the *bar*"];

  return (
    <header ref={root} id="top" className="relative min-h-[100svh] overflow-hidden bg-paper">
      {/* paper texture wash */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 12% 8%, color-mix(in oklab, var(--c-latte) 55%, transparent) 0%, transparent 60%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, var(--c-paper-2), transparent)" }} />
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1500px] grid-cols-1 items-center gap-10 px-5 pt-28 pb-14 md:px-8 lg:grid-cols-12 lg:gap-6 lg:pt-36 lg:pb-20">
        {/* ---------------------------------------------- left: editorial type */}
        <div className="lg:col-span-7">
          <div className="he-eyebrow flex flex-wrap items-center gap-x-5 gap-y-2">
            <Eyebrow>{BRAND.line}</Eyebrow>
            <span className="hidden h-px w-16 bg-line sm:block" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-ink/62">{BRAND.est} · Napa Valley</span>
          </div>

          <h1 className="display mt-7 text-[clamp(3rem,8.4vw,7.6rem)] text-ink">
            <span className="he-mask block">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  <MaskedLine text={line} />
                </span>
              ))}
            </span>
          </h1>

          <div className="mt-8 flex gap-6">
            <span className="hidden w-px shrink-0 bg-line sm:block" />
            <p className="he-lede max-w-lg text-[15.5px] leading-[1.85] text-ink/72">
              So we bring it. Handcrafted cocktails, a bespoke menu written around your story and a bar styled to the
              room — for weddings, birthdays, corporate gatherings and every celebration that deserves better than a
              bottle on a table.
            </p>
          </div>

          <div className="he-cta mt-9 flex flex-wrap items-center gap-4">
            <Btn onClick={() => scrollToId("booking")}>Reserve your date</Btn>
            <Btn variant="line" onClick={() => scrollToId("menu")}>
              Explore the menu
            </Btn>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-y-6 border-t border-line pt-7 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="he-stat">
                <div className="display flex items-baseline text-[2.4rem] leading-none text-ink">
                  <span data-count={s.value}>0</span>
                  <span className="text-accent2">{s.suffix}</span>
                </div>
                <div className="mt-2 text-[10.5px] uppercase tracking-[0.18em] text-ink/62">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------- right: image + cards */}
        <div className="relative lg:col-span-5">
          <div className="he-img duo relative aspect-[4/5] w-full overflow-hidden bg-ink2 lg:aspect-[3/4]">
            <img src={IMG.heroA} alt="Bartender pouring a whiskey cocktail into a crystal coupe" className="kenburns" />
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(40,25,20,.62), transparent 45%)" }} />
            <div className="absolute inset-3 border border-ondark/20" />
          </div>

          {/* tonight's pour card */}
          <div className="he-card he-par absolute -left-4 bottom-8 w-[270px] border border-line bg-paper p-5 shadow-[0_28px_60px_-30px_rgba(40,25,20,0.7)] sm:-left-10">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-accentink">Now pouring</span>
              <StrengthMeter level={HERO_COCKTAIL.strength} />
            </div>
            <h3 className="display mt-3 text-[1.7rem] leading-none text-ink">{HERO_COCKTAIL.name}</h3>
            <ul className="mt-3 space-y-1 text-[11.5px] leading-relaxed text-ink/60">
              {HERO_COCKTAIL.ingredients.slice(0, 4).map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 bg-accent2" />
                  {i}
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollToId("menu")}
              className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:text-accentink"
            >
              See the full list <Icon name="arrow" className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* rotating seal */}
          <div className="he-badge he-par absolute -top-6 right-1 h-24 w-24 sm:-right-8 sm:h-32 sm:w-32">
            <svg viewBox="0 0 120 120" className="spin-slow h-full w-full text-accentink">
              <defs>
                <path id="heroCircle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" fill="none" />
              </defs>
              <text fontSize="8.6" letterSpacing="3.1" fill="currentColor" fontFamily="var(--f-body)" fontWeight="600">
                <textPath href="#heroCircle">RESERVE · TASTE · POUR · CELEBRATE · </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-accent">
                <Icon name="coupe" className="h-6 w-6" />
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------- bottom rail */}
      <div className="he-rail relative bg-ink text-ondark">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <button onClick={() => scrollToId("story")} className="group inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.24em] text-ondark/70 hover:text-accent">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ondark/25 transition-transform duration-500 group-hover:translate-y-1">
              <Icon name="arrowUp" className="h-4 w-4 rotate-180" />
            </span>
            Scroll — the story
          </button>
          <p className="text-[11px] tracking-wide text-ondark/65">
            Two Saturdays remain in the autumn calendar · {BRAND.areas.join(" · ")}
          </p>
        </div>
      </div>
    </header>
  );
}

/* ================================================================ OPTION B */
function HeroPlum() {
  const root = useRef<HTMLElement>(null);

  useHeroTimeline((tl) => {
    tl.from(".hp-eyebrow", { opacity: 0, y: 18, duration: 0.9 })
      .fromTo(".hp-arch", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut" }, 0.15)
      .to(".hp-mask .w-i", { y: "0%", duration: 1.3, stagger: 0.045, ease: "expo.out" }, "-=1.1")
      .from(".hp-lede", { opacity: 0, y: 22, duration: 1 }, "-=0.85")
      .from(".hp-cta > *", { opacity: 0, y: 20, duration: 0.85, stagger: 0.1 }, "-=0.8")
      .from(".hp-mini", { opacity: 0, x: -30, duration: 1, ease: "expo.out" }, "-=0.9")
      .from(".hp-meta > *", { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 }, "-=0.9")
      .from(".hp-ribbon", { opacity: 0, duration: 0.8 }, "-=0.6");
  }, []);

  const lines = ["Celebrations,", "*poured* by hand"];

  return (
    <header ref={root} id="top" className="relative min-h-[100svh] overflow-hidden bg-ink text-ondark">
      {/* atmospheric wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 78% 12%, rgba(196,154,157,0.28) 0%, transparent 62%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 8% 88%, rgba(84,40,63,0.85) 0%, transparent 66%)" }} />
        <div className="absolute inset-0 opacity-[0.16]" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 100%)" }} />
        {/* line-art florals */}
        <svg className="absolute inset-0 h-full w-full text-accent2 opacity-[0.13]" viewBox="0 0 800 900" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <g stroke="currentColor" strokeWidth="0.8">
            <path d="M640 40c-60 90-70 210-10 300 40 60 30 140-30 190" />
            <path d="M640 40c30 70 20 150-40 200" />
            <path d="M600 340c60-10 110 20 130 70-90 30-150-10-130-70Z" />
            <path d="M560 520c50 20 70 70 50 120-60-20-80-80-50-120Z" />
            <path d="M120 780c40-60 110-70 170-30-40 60-120 80-170 30Z" />
            <circle cx="700" cy="180" r="46" />
            <circle cx="700" cy="180" r="70" />
          </g>
        </svg>
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1500px] grid-cols-1 items-center gap-12 px-5 pt-28 pb-16 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-36">
        {/* image column first on desktop */}
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[440px]">
            <span className="absolute -inset-5 arch border border-accent2/25" aria-hidden />
            <span className="absolute -inset-10 arch border border-accent2/10" aria-hidden />
            <div className="hp-arch duo arch relative aspect-[3/4] w-full">
              <img src={IMG.heroB} alt="Plum-toned cocktail coupe garnished with a dried rose petal" className="kenburns" />
            </div>
            {/* offset second frame */}
            <div className="hp-mini duo absolute -bottom-10 -right-6 w-40 overflow-hidden border border-accent2/30 shadow-[0_30px_60px_-25px_rgba(0,0,0,.8)] sm:-right-14 sm:w-52">
              <img src={IMG.coupe} alt="Chilled coupe with citrus twist" className="aspect-[4/5] floaty" />
            </div>
            <div className="hp-mini absolute -top-6 -left-4 hidden items-center gap-3 border border-accent2/30 bg-ink/80 px-4 py-3 sm:flex">
              <Icon name="star" className="h-4 w-4 text-accent2" stroke={false} />
              <div className="leading-tight">
                <div className="display text-lg">5.0</div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-ondark/60">480+ events</div>
              </div>
            </div>
          </div>
        </div>

        {/* type column */}
        <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-10">
          <div className="hp-eyebrow flex flex-wrap items-center gap-x-5 gap-y-2">
            <Eyebrow dark>Benita Bar Co. — {BRAND.line}</Eyebrow>
          </div>

          <h1 className="display mt-6 text-[clamp(3rem,8.2vw,7.4rem)] text-ondark">
            <span className="hp-mask block">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  <MaskedLine text={line} outline={i === 1} />
                </span>
              ))}
            </span>
          </h1>

          <Ornament dark className="mt-7" />

          <p className="hp-lede mt-7 max-w-xl text-[15.5px] leading-[1.9] text-ondarkdim">
            A private bartender, a mobile bar dressed in roses and candlelight, and a drink menu written only for your
            evening. Weddings, birthdays, corporate gatherings and the celebrations you would rather not explain twice.
          </p>

          <div className="hp-cta mt-9 flex flex-wrap items-center gap-4">
            <Btn onClick={() => scrollToId("booking")}>Reserve your date</Btn>
            <Btn variant="dark-line" onClick={() => scrollToId("packages")}>
              See packages & pricing
            </Btn>
          </div>

          <div className="hp-meta mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-ondark/15 pt-7">
            {[
              { k: "Signature menus", v: "96 recipes" },
              { k: "Bar formats", v: "Walnut · Trailer · Marble" },
              { k: "Next opening", v: "October, Napa Valley" },
            ].map((m) => (
              <div key={m.k}>
                <div className="text-[9.5px] uppercase tracking-[0.2em] text-ondark/60">{m.k}</div>
                <div className="display-it mt-1 text-[1.15rem] text-accent">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ribbon */}
      <div className="hp-ribbon relative mt-2 bg-paper2 py-3 text-ink">
        <Marquee items={TICKER} speed={54} separator="❋" />
      </div>
    </header>
  );
}

/* --------------------------------------------------------- shared helpers */
function MaskedLine({ text, outline = false }: { text: string; outline?: boolean }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((raw, i) => {
        const isAccent = raw.startsWith("*") && raw.endsWith("*");
        const word = isAccent ? raw.slice(1, -1) : raw;
        const cls = isAccent ? (outline ? "w-i outline-word" : "w-i display-it text-accent2") : "w-i";
        return (
          <span key={i}>
            <span className="wm">
              <span className={cls}>
                {word}
              </span>
            </span>
            {i < parts.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </>
  );
}
