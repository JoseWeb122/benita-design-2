import { useEffect, useRef, useState } from "react";
import { STATS, TESTIMONIALS } from "@/lib/data";
import { gsap, reduced, useReveal } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Icon, Ornament } from "./ui";

const DURATION = 7200;

export default function Testimonials() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  const go = (n: number) => setI((n + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    if (reduced()) return;
    tween.current?.kill();
    if (barRef.current) gsap.set(barRef.current, { scaleX: 0 });
    if (paused) return;
    tween.current = gsap.to(barRef.current, {
      scaleX: 1,
      duration: DURATION / 1000,
      ease: "none",
      onComplete: () => setI((v) => (v + 1) % TESTIMONIALS.length),
    });
    return () => {
      tween.current?.kill();
    };
  }, [i, paused]);

  useEffect(() => {
    if (reduced()) return;
    gsap.fromTo(`.tw-item-${i} .tw-in`, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 });
  }, [i]);

  const t = TESTIMONIALS[i];

  return (
    <section
      id="words"
      ref={root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative overflow-hidden ${plum ? "bg-paper py-24 md:py-32" : "bg-ink py-24 text-ondark md:py-36"}`}
    >
      {!plum && <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(70% 60% at 15% 20%, rgba(199,164,119,0.14), transparent 60%)" }} />}
      {plum && <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 50% at 90% 10%, rgba(212,161,170,0.28), transparent 62%)" }} />}

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className={`flex items-center justify-between gap-6 ${plum ? "" : ""}`}>
          <span className={`eyebrow ${plum ? "text-accentink" : "text-accent"}`}>Kind words · 06</span>
          <span className={`hidden h-px flex-1 ${plum ? "bg-line" : "bg-ondark/15"} sm:block`} />
          <span className={`text-[10.5px] uppercase tracking-[0.2em] ${plum ? "text-ink/60" : "text-ondark/60"}`}>
            {String(i + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
        </div>

        <div className={`grid gap-12 lg:grid-cols-12 ${plum ? "mt-12" : "mt-14"}`}>
          <div className={`tw-item-${i} lg:col-span-8`}>
            <Icon name="quote" className={`h-9 w-9 ${plum ? "text-accentink" : "text-accent"}`} stroke={false} />
            <blockquote className={`tw-in display mt-7 text-[clamp(1.7rem,4vw,3.2rem)] leading-[1.22] ${plum ? "text-ink" : "text-ondark"}`}>
              {t.quote}
            </blockquote>
            <div className="tw-in mt-9 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className={`display text-[1.5rem] leading-none ${plum ? "text-accentink" : "text-accent"}`}>{t.name}</span>
              <span className={`h-px w-10 ${plum ? "bg-line" : "bg-ondark/25"}`} />
              <span className={`text-[12px] uppercase tracking-[0.16em] ${plum ? "text-ink/65" : "text-ondark/65"}`}>{t.role}</span>
              <span className={`text-[12px] ${plum ? "text-ink/60" : "text-ondark/60"}`}>{t.place}</span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className={`border p-6 ${plum ? "rounded-2xl border-line bg-paper2/70" : "border-ondark/15"}`}>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Icon key={s} name="star" className="h-4 w-4" stroke={false} />
                ))}
                <span className={`ml-2 text-[11px] uppercase tracking-[0.16em] ${plum ? "text-ink/62" : "text-ondark/62"}`}>5.0 average</span>
              </div>
              <div className={`mt-6 space-y-4 border-t pt-5 ${plum ? "border-line" : "border-ondark/15"}`}>
                {STATS.slice(0, 3).map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-4">
                    <span className={`text-[12px] uppercase tracking-[0.14em] ${plum ? "text-ink/65" : "text-ondark/65"}`}>{s.label}</span>
                    <span className={`display text-[1.5rem] leading-none ${plum ? "text-ink" : "text-ondark"}`}>
                      {s.value}
                      {s.suffix}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`mt-7 flex items-center gap-3 border-t pt-5 ${plum ? "border-line" : "border-ondark/15"}`}>
                <button
                  onClick={() => go(i - 1)}
                  aria-label="Previous testimonial"
                  className={`flex h-11 w-11 items-center justify-center border transition-colors ${
                    plum ? "rounded-full border-line text-ink hover:border-accent2 hover:text-accentink" : "border-ondark/25 text-ondark hover:border-accent hover:text-accent"
                  }`}
                >
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => go(i + 1)}
                  aria-label="Next testimonial"
                  className={`flex h-11 w-11 items-center justify-center border transition-colors ${
                    plum ? "rounded-full border-line text-ink hover:border-accent2 hover:text-accentink" : "border-ondark/25 text-ondark hover:border-accent hover:text-accent"
                  }`}
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
                <div className={`relative h-px flex-1 ${plum ? "bg-line" : "bg-ondark/20"}`}>
                  <span ref={barRef} className={`absolute inset-0 origin-left scale-x-0 ${plum ? "bg-accent2" : "bg-accent"}`} />
                </div>
              </div>
              <div className="mt-5 flex gap-1.5">
                {TESTIMONIALS.map((_, d) => (
                  <button
                    key={d}
                    onClick={() => go(d)}
                    aria-label={`Testimonial ${d + 1}`}
                    className={`h-1.5 flex-1 transition-all duration-500 ${d === i ? "bg-accent" : plum ? "bg-line" : "bg-ondark/20"}`}
                  />
                ))}
              </div>
            </div>
            {plum && <Ornament className="mt-8 justify-center" />}
          </div>
        </div>
      </div>
    </section>
  );
}
