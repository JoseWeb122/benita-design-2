import { PROCESS } from "@/lib/data";
import { gsap, useReveal } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Eyebrow, Icon } from "./ui";
import { useEffect, useRef } from "react";

export default function Process() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const host = document.getElementById("process-list");
    if (!line || !host) return;
    const tween = gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: host, start: "top 70%", end: "bottom 80%", scrub: 0.8 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [theme]);

  return (
    <section id="process" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper2 py-24 md:py-32" : "bg-paper py-24 md:py-36"}`}>
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* sticky column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-36">
              <Eyebrow>{plum ? "How it happens" : "The Method"}</Eyebrow>
              <h2 className="display mt-6 text-[clamp(2.4rem,5.2vw,4.4rem)] leading-[0.95] text-ink">
                From a forty-minute
                <span className="display-it block text-accentink">call to last call</span>
              </h2>
              <p className="mt-7 max-w-sm text-[14.5px] leading-relaxed text-ink/70">
                Five movements, always in the same order. Nothing is bought before it is tasted and nothing is loaded
                in before the room is ready for it.
              </p>
              <div className="mt-9 flex items-center gap-4 border border-line px-5 py-4">
                <Icon name="calendar" className="h-6 w-6 shrink-0 text-accentink" />
                <div>
                  <div className="display text-[1.3rem] leading-none text-ink">Typically 6 – 9 weeks</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-ink/62">From first call to event day</div>
                </div>
              </div>
            </div>
          </div>

          {/* steps */}
          <div id="process-list" className="relative lg:col-span-8">
            <span className={`absolute top-2 bottom-2 left-[26px] w-px ${plum ? "bg-line" : "bg-line"} md:left-[34px]`} />
            <span
              ref={lineRef}
              className="absolute top-2 bottom-2 left-[26px] w-px origin-top bg-accent2 md:left-[34px]"
            />
            <ol className="space-y-10 md:space-y-14">
              {PROCESS.map((p, i) => (
                <li key={p.num} data-reveal data-reveal-dist="34" data-reveal-delay={i * 0.05} className="relative grid grid-cols-[54px_1fr] gap-6 md:grid-cols-[70px_1fr] md:gap-8">
                  <span className={`relative z-10 mt-1 flex h-[54px] w-[54px] items-center justify-center rounded-full border bg-paper md:h-[70px] md:w-[70px] ${plum ? "border-accent2/60" : "border-accent2/50"}`}>
                    <span className="display text-[1.35rem] text-accentink md:text-[1.7rem]">{p.num}</span>
                  </span>
                  <div className={`group border-b pb-8 ${plum ? "border-line" : "border-line"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-none text-ink transition-transform duration-700 group-hover:translate-x-2">
                        {p.title}
                      </h3>
                      <span className="eyebrow text-ink/60">{p.meta}</span>
                    </div>
                    <p className="mt-4 max-w-2xl text-[14px] leading-[1.85] text-ink/70">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
