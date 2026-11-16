import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/data";
import { gsap, scrollToId, useReveal } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Icon, SectionHead, SERVICE_ICONS } from "./ui";

export default function Services() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const hostRef = useRef<HTMLDivElement>(null);
  const followRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const host = hostRef.current;
      const follow = followRef.current;
      if (!host || !follow) return;
      const xTo = gsap.quickTo(follow, "x", { duration: 0.85, ease: "power3" });
      const yTo = gsap.quickTo(follow, "y", { duration: 1.05, ease: "power3" });
      const move = (e: MouseEvent) => {
        const r = host.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      };
      host.addEventListener("mousemove", move);
      return () => host.removeEventListener("mousemove", move);
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    const follow = followRef.current;
    if (!follow) return;
    gsap.to(follow, {
      opacity: hover === null ? 0 : 1,
      scale: hover === null ? 0.86 : 1,
      rotate: hover === null ? -6 : -3,
      duration: 0.55,
      ease: "power3.out",
    });
  }, [hover]);

  useEffect(() => {
    if (followRef.current) gsap.set(followRef.current, { opacity: 0, scale: 0.86, rotate: -6 });
  }, []);

  return (
    <section id="services" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper2 py-24 md:py-32" : "bg-ink py-24 text-ondark md:py-36"}`}>
      {!plum && (
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(90% 60% at 20% 0%, rgba(199,164,119,0.16), transparent 60%)" }} />
      )}
      {plum && (
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 50% at 10% 100%, rgba(212,161,170,0.35), transparent 65%)" }} />
      )}

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            dark={!plum}
            index="02"
            kicker="What we do"
            title={plum ? "Six ways to hand your guests a *better* hour" : "Six ways the bar becomes the room"}
            className="max-w-2xl"
          />
          <p data-reveal className={`max-w-sm text-[14px] leading-relaxed ${plum ? "text-ink/65" : "text-ondarkdim"}`}>
            Every service below can be taken alone or layered into one evening. Most hosts take the bar, the menu and
            one indulgence — the masterclass or the espresso cart.
          </p>
        </div>

        {/* rows */}
        <div ref={hostRef} className="relative mt-14 lg:mt-20">
          <div className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <div ref={followRef} className={`duo relative h-72 w-56 overflow-hidden ${plum ? "arch" : ""} shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)]`}>
              {SERVICES.map((s, i) => (
                <img
                  key={s.num}
                  src={s.img}
                  alt=""
                  className={`absolute inset-0 transition-opacity duration-500 ${hover === i ? "opacity-100" : "opacity-0"}`}
                  style={{ filter: "var(--img-filter)" }}
                />
              ))}
              <div className="absolute inset-0 border border-ondark/25" />
            </div>
          </div>

          <ul>
            {SERVICES.map((s, i) => (
              <li key={s.num}>
                <button
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => scrollToId("booking")}
                  data-reveal
                  data-reveal-dist="30"
                  data-reveal-delay={i * 0.04}
                  className={`group grid w-full grid-cols-12 items-center gap-4 border-b py-7 text-left transition-colors duration-500 md:gap-8 md:py-9 ${
                    plum ? "border-line hover:border-accent2" : "border-ondark/15 hover:border-accent"
                  }`}
                >
                  <span className={`col-span-2 flex items-center gap-3 md:col-span-1 ${plum ? "text-accentink" : "text-accent"}`}>
                    <Icon name={SERVICE_ICONS[i]} className="h-5 w-5 shrink-0 transition-transform duration-500 group-hover:-rotate-12" />
                    <span className="display text-[1.1rem] opacity-70 md:hidden">{s.num}</span>
                  </span>

                  <span className="col-span-10 md:col-span-4">
                    <span className="display hidden text-[1.1rem] text-ink/60 md:inline-block md:w-10">{s.num}</span>
                    <span
                      className={`display block text-[clamp(1.6rem,3.2vw,2.6rem)] leading-none transition-transform duration-700 group-hover:translate-x-3 ${
                        plum ? "text-ink" : "text-ondark"
                      }`}
                    >
                      {s.title}
                    </span>
                  </span>

                  <span className={`col-span-12 text-[13.5px] leading-relaxed md:col-span-5 ${plum ? "text-ink/65" : "text-ondarkdim"}`}>
                    {s.desc}
                  </span>

                  <span className="col-span-12 flex items-center justify-end gap-3 md:col-span-2">
                    <span className={`hidden gap-2 lg:flex ${plum ? "text-ink/60" : "text-ondark/60"}`}>
                      {s.bullets.map((b) => (
                        <span key={b} className="border border-current px-2 py-1 text-[9px] uppercase tracking-[0.14em]">
                          {b}
                        </span>
                      ))}
                    </span>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:rotate-45 ${plum ? "border-line text-accentink group-hover:bg-accent2 group-hover:text-ink" : "border-ondark/25 text-accent group-hover:bg-accent group-hover:text-ink"}`}>
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
