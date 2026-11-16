import { useEffect, useMemo, useState } from "react";
import { GALLERY } from "@/lib/data";
import { gsap, useReveal } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Icon, SectionHead } from "./ui";

export default function Gallery() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const [filter, setFilter] = useState<string>("All");
  const [index, setIndex] = useState<number | null>(null);

  const cats = useMemo(() => ["All", ...Array.from(new Set(GALLERY.map((g) => g.cat)))], []);
  const items = useMemo(() => (filter === "All" ? GALLERY : GALLERY.filter((g) => g.cat === filter)), [filter]);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    gsap.fromTo(".gl-box", { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(".gl-panel", { opacity: 0, y: 26, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" });
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, items.length]);

  const cur = index !== null ? items[index] : null;

  return (
    <section id="gallery" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper2 py-24 md:py-32" : "bg-paper py-24 md:py-36"}`}>
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index="05"
            kicker="The Portfolio"
            title={plum ? "Rooms we *lit*, bars we built" : "The room, the bar, the hour before"}
            className="max-w-2xl"
          />
          <div className="flex flex-wrap gap-2" data-reveal>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setFilter(c);
                  setIndex(null);
                }}
                className={`chip ${plum ? "!rounded-full" : ""} ${filter === c ? "chip-on" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-14 grid gap-5 md:grid-cols-12 ${plum ? "md:gap-6" : "md:gap-5"}`}>
          {items.map((g, i) => (
            <button
              key={g.img + g.caption}
              onClick={() => setIndex(i)}
              data-reveal
              data-reveal-dist="46"
              data-reveal-delay={Math.min(i * 0.05, 0.3)}
              className={`group relative block text-left ${g.span} ${plum ? "" : ""}`}
            >
              <div className={`duo relative w-full overflow-hidden bg-ink2 ${g.ratio} ${plum ? "arch" : ""}`}>
                <img
                  src={g.img}
                  alt={g.caption}
                  className="transition-transform duration-[1.6s] ease-out group-hover:scale-[1.08]"
                />
                <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
                {plum && (
                  <span className="pointer-events-none absolute inset-x-5 bottom-5 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-ondark">{g.caption}</span>
                  </span>
                )}
                {!plum && (
                  <span className="pointer-events-none absolute right-4 bottom-4 flex h-10 w-10 translate-y-3 items-center justify-center border border-ondark/40 bg-ink/40 text-ondark opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Icon name="plus" className="h-4 w-4" />
                  </span>
                )}
              </div>
              {!plum && (
                <span className="mt-3 flex items-baseline justify-between gap-4 border-b border-line pb-2">
                  <span className="text-[12.5px] text-ink/75">{g.caption}</span>
                  <span className="eyebrow shrink-0 text-accentink">{g.cat}</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* lightbox */}
      {cur && index !== null && (
        <div className="gl-box fixed inset-0 z-[88] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-label={cur.caption}>
          <button aria-label="Close" className="absolute inset-0 bg-ink/88 backdrop-blur-[2px]" onClick={() => setIndex(null)} />
          <div className="gl-panel relative w-full max-w-5xl">
            <div className="duo relative aspect-[16/10] w-full overflow-hidden">
              <img src={cur.img} alt={cur.caption} />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
              <div>
                <span className="eyebrow text-accent">{cur.cat}</span>
                <p className="display mt-2 text-[1.6rem] leading-none text-ondark">{cur.caption}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.2em] text-ondark/62">
                  {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setIndex((index - 1 + items.length) % items.length)}
                  aria-label="Previous image"
                  className="flex h-11 w-11 items-center justify-center border border-ondark/25 text-ondark transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => setIndex((index + 1) % items.length)}
                  aria-label="Next image"
                  className="flex h-11 w-11 items-center justify-center border border-ondark/25 text-ondark transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIndex(null)}
                  aria-label="Close"
                  className="flex h-11 w-11 items-center justify-center border border-ondark/25 text-ondark transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
