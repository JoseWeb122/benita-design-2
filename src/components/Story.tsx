import { BRAND, IMG, PRESS, TICKER } from "@/lib/data";
import { useReveal } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Eyebrow, Icon, Marquee, Ornament, SectionHead } from "./ui";

export function Ticker() {
  const { theme } = useTheme();
  if (theme === "plum") return null;
  return (
    <div className="relative overflow-hidden border-y border-line bg-paper2 py-4">
      <Marquee items={TICKER} speed={52} separator="✦" />
    </div>
  );
}

export default function Story() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);

  const creds = [
    "RBS & food-handler certified",
    "$2M general and liquor liability",
    "Preferred vendor at 14 venues",
    "Hand-cut clear ice programme",
  ];

  return (
    <section id="story" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper py-24 md:py-32" : "bg-paper py-24 md:py-36"}`}>
      {plum && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(80% 50% at 85% 0%, color-mix(in oklab, var(--c-paper-2) 90%, transparent), transparent 60%)" }}
        />
      )}

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        {plum ? <PlumLayout creds={creds} /> : <EspressoLayout creds={creds} />}
      </div>

      {/* press */}
      <div className="relative mx-auto mt-24 max-w-[1500px] px-5 md:mt-32 md:px-8">
        <div className="flex items-center gap-6" data-reveal>
          <Eyebrow dark={false}>Kind words & quiet press</Eyebrow>
          <span className="rule flex-1" />
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {PRESS.map((p, i) => (
            <div key={p.name} data-reveal data-reveal-delay={i * 0.08} className="group">
              <div className="display text-[1.35rem] leading-tight text-ink transition-colors duration-500 group-hover:text-accentink">
                {p.name}
              </div>
              <div className="mt-3 border-l border-line pl-4 text-[12.5px] italic leading-relaxed text-ink/60">{p.line}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- ESPRESSO */
function EspressoLayout({ creds }: { creds: string[] }) {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <SectionHead
          index="01"
          kicker="The Story"
          title="Twelve years behind other people's *best* nights"
        />
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <p data-reveal className="text-[15.5px] leading-[1.9] text-ink/75">
            I learned to pour in a twelve-seat room in Healdsburg where the ice was cut by hand and nobody was in a
            hurry. Twelve years later that is still the whole method: fewer drinks, made properly, for the people you
            actually invited.
          </p>
          <p data-reveal data-reveal-delay="0.1" className="text-[15.5px] leading-[1.9] text-ink/75">
            Benita Bar Co. is me, a walnut bar on brass wheels, and a cellar of syrups, shrubs and bitters I make
            myself. I take a limited number of dates each season so that every menu is tasted before it is poured.
          </p>
        </div>

        <blockquote data-reveal className="relative mt-12 border-l-2 border-accent2 pl-7">
          <p className="display-it text-[clamp(1.5rem,2.8vw,2.15rem)] leading-[1.35] text-ink">
            “You will know my handwriting on the menu card, and you will know my name by the second round.”
          </p>
          <footer className="mt-5 flex items-center gap-4">
            <svg viewBox="0 0 200 46" className="h-9 w-36 text-accentink" fill="none" aria-hidden>
              <path
                d="M6 34c10-16 16-24 20-24s2 14 6 20 8-4 10-12 4-14 8-14 2 12 6 18 8-2 12-10 6-12 10-12 2 14 6 20 8-6 12-14 8-12 12-10 4 12 10 16 14-2 20-10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="eyebrow text-ink/62">Benita — Founder & Head Bartender</span>
          </footer>
        </blockquote>

        <ul className="mt-12 grid gap-x-8 gap-y-4 border-t border-line pt-8 sm:grid-cols-2">
          {creds.map((c, i) => (
            <li key={c} data-reveal data-reveal-delay={i * 0.06} className="flex items-center gap-3 text-[13px] text-ink/70">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent2/50 text-accentink">
                <Icon name="check" className="h-3 w-3" />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-5">
        <div className="relative" data-parallax-host>
          <div className="duo relative aspect-[4/5] w-full overflow-hidden bg-ink2" data-reveal data-reveal-dir="clip">
            <img src={IMG.benita} alt="Benita behind the bar" data-parallax="6" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden w-56 border border-line bg-paper p-5 md:block" data-reveal data-reveal-delay="0.2">
            <span className="eyebrow text-accentink">Studio</span>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink/70">{BRAND.studio}</p>
            <p className="mt-3 text-[12.5px] text-ink/62">{BRAND.hours[0][1]}</p>
          </div>
          <div className="absolute -top-4 right-4 flex items-center gap-2 border border-line bg-paper px-4 py-2" data-reveal data-reveal-delay="0.3">
            <span className="h-2 w-2 rounded-full bg-accent2" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink/60">Booking {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- PLUM */
function PlumLayout({ creds }: { creds: string[] }) {
  return (
    <div>
      <SectionHead
        align="center"
        kicker="The Story"
        title="A bar that arrives with roses, ice and *intention*"
        lede="Benita Bar Co. is one bartender, a cellar of house-made syrups and shrubs, and a deliberately small calendar — so every menu is tasted before it is ever poured."
      />
      <Ornament dark={false} className="mt-9 justify-center" />

      <div className="mt-16 grid items-start gap-10 lg:grid-cols-12">
        <div className="relative lg:col-span-5" data-parallax-host>
          <div className="duo arch relative aspect-[3/4] w-full overflow-hidden" data-reveal data-reveal-dir="clip">
            <img src={IMG.benita} alt="Benita behind the bar" data-parallax="5" />
          </div>
          <div className="duo arch absolute -bottom-10 -right-4 hidden w-32 overflow-hidden border-2 border-paper sm:block lg:-right-8 lg:w-40" data-reveal data-reveal-delay="0.25">
            <img src={IMG.spritz} alt="Blush pink hibiscus fizz" className="aspect-[3/4]" />
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-6">
          <p data-reveal className="display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.4] text-ink">
            I learned to pour in a twelve-seat room where the ice was cut by hand and nobody was in a hurry. That is
            still the whole method — <span className="display-it text-accentink">fewer drinks, made properly</span>, for
            the people you actually invited.
          </p>
          <div className="mt-8 grid gap-7 sm:grid-cols-2">
            <p data-reveal data-reveal-delay="0.08" className="text-[15px] leading-[1.9] text-ink/70">
              We build the bar around the room rather than dropping one into it: walnut or marble or matte black,
              dressed with your florist's leftovers and lit low enough that people lean in.
            </p>
            <p data-reveal data-reveal-delay="0.16" className="text-[15px] leading-[1.9] text-ink/70">
              Then we write the menu. Named for the people and places that matter, tasted at my bar with you sitting
              across from me, printed on cotton card stock and left beside every plate.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {creds.map((c, i) => (
              <div key={c} data-reveal data-reveal-delay={i * 0.06} className="flex items-center gap-3 border border-line bg-paper2/60 px-4 py-3">
                <Icon name="sparkle" className="h-4 w-4 shrink-0 text-accentink" />
                <span className="text-[12.5px] text-ink/75">{c}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-5" data-reveal>
            <svg viewBox="0 0 200 46" className="h-10 w-40 text-accentink" fill="none" aria-hidden>
              <path
                d="M6 34c10-16 16-24 20-24s2 14 6 20 8-4 10-12 4-14 8-14 2 12 6 18 8-2 12-10 6-12 10-12 2 14 6 20 8-6 12-14 8-12 12-10 4 12 10 16 14-2 20-10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="eyebrow text-ink/62">Benita — Founder & Head Bartender</span>
          </div>
        </div>
      </div>
    </div>
  );
}
