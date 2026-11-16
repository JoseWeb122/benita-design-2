import { useState } from "react";
import { BRAND, FAQ } from "@/lib/data";
import { useReveal } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Icon, SectionHead } from "./ui";

export default function Faq() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper py-24 md:py-32" : "bg-paper py-24 md:py-36"}`}>
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-36">
              <SectionHead index="08" kicker="Questions" title={plum ? "The things hosts *always* ask" : "Before you ask"} />
              <div className={`mt-9 border p-6 ${plum ? "rounded-2xl bg-paper2/70 border-line" : "border-line bg-paper2/50"}`} data-reveal>
                <span className="eyebrow text-accentink">Still curious?</span>
                <p className="mt-4 text-[13.5px] leading-relaxed text-ink/70">
                  Ask me anything — including the questions you think are too small. If your date is not workable I will
                  tell you, and I will suggest someone good.
                </p>
                <div className="mt-6 space-y-3">
                  <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`} className="group flex items-center gap-3 text-[13px] text-ink transition-colors hover:text-accentink">
                    <Icon name="phone" className="h-4 w-4 text-accentink" />
                    {BRAND.phone}
                  </a>
                  <a href={`mailto:${BRAND.email}`} className="group flex items-center gap-3 text-[13px] text-ink transition-colors hover:text-accentink">
                    <Icon name="mail" className="h-4 w-4 text-accentink" />
                    {BRAND.email}
                  </a>
                  <span className="flex items-center gap-3 text-[13px] text-ink/60">
                    <Icon name="pin" className="h-4 w-4 text-accentink" />
                    {BRAND.studio}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-line">
              {FAQ.map((f, i) => {
                const on = open === i;
                return (
                  <li key={f.q} className="border-b border-line" data-reveal data-reveal-dist="24">
                    <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="group flex w-full items-start justify-between gap-6 py-6 text-left">
                      <span className="flex items-start gap-5">
                        <span className="display mt-1 text-[0.95rem] text-accentink/70">{String(i + 1).padStart(2, "0")}</span>
                        <span className={`display text-[clamp(1.25rem,2.4vw,1.85rem)] leading-tight transition-colors duration-500 ${on ? "text-accentink" : "text-ink group-hover:text-ink/70"}`}>
                          {f.q}
                        </span>
                      </span>
                      <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${on ? "rotate-45 border-accent2 bg-accent2 text-ink" : "border-line text-ink/62 group-hover:border-accent2 group-hover:text-accentink"}`}>
                        <Icon name="plus" className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-7 pl-[3.1rem] text-[14px] leading-[1.9] text-ink/70">{f.a}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
