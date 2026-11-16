import { useEffect, useRef } from "react";
import { ADDONS, BAR_STYLES, PACKAGES } from "@/lib/data";
import { gsap, reduced, scrollToId, useReveal } from "@/lib/motion";
import { money, useBooking } from "@/lib/booking";
import { useTheme } from "@/lib/theme";
import { Icon, SectionHead } from "./ui";

/* animated figure ------------------------------------------------------ */
export function Money({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const cur = useRef(value);
  useEffect(() => {
    if (!ref.current) return;
    if (reduced()) {
      ref.current.textContent = money(value);
      cur.current = value;
      return;
    }
    const o = { v: cur.current };
    gsap.to(o, {
      v: value,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = money(Math.round(o.v));
      },
      onComplete: () => (cur.current = value),
    });
  }, [value]);
  return <span ref={ref} className={className}>{money(value)}</span>;
}

export default function Packages() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const { state, set, toggleAddon, pkg, breakdown, subtotal, deposit, perGuest } = useBooking();

  const quoteFor = (id: string) => {
    const p = PACKAGES.find((x) => x.id === id)!;
    return p.base + p.perGuest * state.guests + 150;
  };

  return (
    <section id="packages" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper py-24 md:py-32" : "bg-paper2 py-24 md:py-36"}`}>
      {!plum && <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(90% 60% at 50% 0%, color-mix(in oklab, var(--c-latte) 45%, transparent), transparent 65%)" }} />}

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index="04"
            kicker="Packages & Pricing"
            title={plum ? "Three ways to *host*, priced honestly" : "Three bars. One honest number."}
            className="max-w-2xl"
          />
          {/* guest slider */}
          <div className="w-full max-w-md border border-line bg-paper p-6" data-reveal>
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-accentink">Your guest count</span>
              <span className="display text-[2.6rem] leading-none text-ink">{state.guests}</span>
            </div>
            <input
              type="range"
              min={20}
              max={300}
              step={5}
              value={state.guests}
              onChange={(e) => set("guests", Number(e.target.value))}
              aria-label="Guest count"
              className="mt-5"
            />
            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.16em] text-ink/60">
              <span>20</span>
              <span>Intimate · 60 · Room-filling</span>
              <span>300+</span>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-ink/60">
              Drag to price the night live. Every figure below updates instantly — this is the same maths as your
              written quote.
            </p>
          </div>
        </div>

        {/* --------------------------------------------------------- tiers */}
        <div className="mt-16 grid items-start gap-6 lg:grid-cols-3 lg:gap-5">
          {PACKAGES.map((p, i) => {
            const on = state.pkgId === p.id;
            const featured = !!p.featured;
            return (
              <div
                key={p.id}
                data-reveal
                data-reveal-dist="50"
                data-reveal-delay={i * 0.09}
                className={`relative flex h-full flex-col border transition-all duration-500 ${
                  featured ? "lg:-mt-8 lg:mb-8" : ""
                } ${plum ? (on ? "border-accent2 bg-paper2" : "border-line bg-paper") : on ? "border-accent bg-paper" : "border-line bg-paper"} ${
                  on ? "shadow-[0_36px_80px_-46px_rgba(0,0,0,0.55)]" : ""
                }`}
              >
                {featured && (
                  <span className={`absolute -top-3 left-6 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${plum ? "bg-accent2 text-ink" : "bg-accent text-ink"}`}>
                    Most requested
                  </span>
                )}
                <div className={`border-b p-7 ${plum ? "border-line" : "border-line"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="eyebrow text-ink/60">{p.kicker}</span>
                      <h3 className="display mt-3 text-[2.4rem] leading-none text-ink">{p.name}</h3>
                    </div>
                    <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${on ? "border-accent2 bg-accent2 text-ink" : "border-line text-ink/60"}`}>
                      <Icon name={on ? "check" : "plus"} className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="display-it mt-4 text-[1.05rem] leading-snug text-ink/70">{p.tagline}</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-ink/60">from</span>
                    <span className="display text-[2.6rem] leading-none text-ink">
                      <Money value={quoteFor(p.id)} />
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-ink/60">
                    <span>{p.hours}</span>
                    <span>{p.guests}</span>
                    <span>{money(p.perGuest)}/guest</span>
                  </div>
                </div>

                <ul className="flex-1 space-y-3 p-7">
                  {p.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-3 text-[13px] leading-relaxed text-ink/75">
                      <span className={`mt-[6px] h-1.5 w-1.5 shrink-0 rotate-45 ${on ? "bg-accent2" : "bg-ink/25"}`} />
                      {inc}
                    </li>
                  ))}
                </ul>

                <div className="p-7 pt-0">
                  <button
                    onClick={() => {
                      set("pkgId", p.id);
                      scrollToId("booking");
                    }}
                    className={`btn w-full ${on ? "btn-line" : "btn-solid"} ${plum ? "!rounded-full" : ""}`}
                  >
                    <span>{on ? "Selected — go to booking" : `Choose ${p.name}`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------- add-ons + bar style */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5" data-reveal>
              <h3 className="display text-[1.9rem] leading-none text-ink">Add to the night</h3>
              <span className="rule flex-1" />
              <span className="eyebrow text-ink/60">{state.addons.length} selected</span>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {ADDONS.map((a) => {
                const on = state.addons.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAddon(a.id)}
                    data-reveal
                    data-reveal-dist="24"
                    className={`group flex items-start gap-4 border p-5 text-left transition-all duration-500 ${
                      plum ? "rounded-xl" : ""
                    } ${on ? "border-accent2 bg-accent2/12" : "border-line bg-paper hover:border-accent2/70 hover:bg-paper2/50"}`}
                  >
                    <span className={`mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${on ? "border-accent2 bg-accent2 text-ink" : "border-line text-transparent group-hover:border-accent2"}`}>
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-[13.5px] font-semibold text-ink">{a.name}</span>
                        <span className="display shrink-0 text-[1.15rem] text-accentink">
                          +{a.perGuest ? `${money(a.price)}/guest` : money(a.price)}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[12px] leading-relaxed text-ink/65">{a.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-12" data-reveal>
              <h3 className="display text-[1.9rem] leading-none text-ink">Choose the bar</h3>
              <p className="mt-3 text-[13px] text-ink/60">Four formats, all styled with your florals and lit to the room.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {BAR_STYLES.map((b) => {
                  const on = state.barStyle === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => set("barStyle", b.id)}
                      className={`border p-4 text-left transition-all duration-500 ${plum ? "rounded-xl" : ""} ${on ? "border-ink bg-ink text-ondark" : "border-line bg-paper hover:border-accent2"}`}
                    >
                      <span className="flex gap-1">
                        {b.swatch.map((c) => (
                          <span key={c} className={`h-6 w-6 ${plum ? "rounded-full" : ""} border ${on ? "border-ondark/25" : "border-line"}`} style={{ background: c }} />
                        ))}
                      </span>
                      <span className="mt-4 block text-[12.5px] font-semibold">{b.name}</span>
                      <span className={`mt-1 block text-[11px] leading-relaxed ${on ? "text-ondark/60" : "text-ink/62"}`}>{b.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------- the receipt */}
          <div className="lg:col-span-5">
            <div className={`sticky top-32 border bg-paper ${plum ? "rounded-2xl" : ""}`} data-reveal data-reveal-dir="x" data-reveal-dist="40">
              <div className={`flex items-center justify-between border-b px-7 py-5 ${plum ? "border-line" : "border-line"}`}>
                <span className="eyebrow text-accentink">Live estimate</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink/60">{pkg.name} · {state.guests} guests</span>
              </div>
              <ul className="divide-y divide-[var(--c-line-soft)] px-7">
                {breakdown.map((l) => (
                  <li key={l.label} className="flex items-start justify-between gap-5 py-4">
                    <span>
                      <span className="block text-[13px] text-ink/85">{l.label}</span>
                      {l.note && <span className="mt-1 block text-[10.5px] uppercase tracking-[0.12em] text-ink/60">{l.note}</span>}
                    </span>
                    <span className="display shrink-0 text-[1.25rem] text-ink">
                      <Money value={l.value} />
                    </span>
                  </li>
                ))}
              </ul>
              <div className={`border-t px-7 py-6 ${plum ? "border-line" : "border-line"}`}>
                <div className="flex items-end justify-between">
                  <span className="eyebrow text-ink/62">Estimated total</span>
                  <span className="display text-[2.9rem] leading-none text-ink">
                    <Money value={subtotal} />
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className={`border p-4 ${plum ? "rounded-xl border-line" : "border-line"}`}>
                    <div className="text-[9.5px] uppercase tracking-[0.18em] text-ink/60">Deposit to hold</div>
                    <div className="display mt-2 text-[1.5rem] text-accentink">
                      <Money value={deposit} />
                    </div>
                  </div>
                  <div className={`border p-4 ${plum ? "rounded-xl border-line" : "border-line"}`}>
                    <div className="text-[9.5px] uppercase tracking-[0.18em] text-ink/60">Per guest</div>
                    <div className="display mt-2 text-[1.5rem] text-accentink">
                      <Money value={perGuest} />
                    </div>
                  </div>
                </div>
                <button onClick={() => scrollToId("booking")} className={`btn btn-solid mt-6 w-full ${plum ? "!rounded-full" : ""}`}>
                  <span>Reserve with this estimate</span>
                </button>
                <p className="mt-4 text-center text-[10.5px] leading-relaxed text-ink/60">
                  Indicative only. Your written quote follows the consultation call and matches this to within 5%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
