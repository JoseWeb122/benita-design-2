import { useState } from "react";
import { BRAND, SERVICES, TICKER } from "@/lib/data";
import { scrollToId, useReveal } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Icon, Marquee, Monogram } from "./ui";

const SOCIALS = ["Instagram", "Pinterest", "LinkedIn"];

export default function Footer() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
      setErr("That email does not look quite right.");
      return;
    }
    setErr("");
    setSent(true);
    setEmail("");
    window.setTimeout(() => setSent(false), 5200);
  };

  return (
    <footer id="contact" ref={root} className="relative overflow-hidden bg-ink text-ondark">
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(80% 60% at 80% 0%, rgba(199,164,119,0.14), transparent 60%)" }} />

      {/* wordmark marquee */}
      <div className="relative border-b border-ondark/12 py-6">
        <Marquee items={[BRAND.full, BRAND.line, "Handcrafted cocktails", "Napa Valley"]} dark speed={60} separator="✦" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* brand + newsletter */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4" data-reveal>
              <Monogram className="h-12 w-12 text-accent" />
              <div>
                <div className="display text-[2rem] leading-none">Benita</div>
                <div className="eyebrow mt-1.5 text-accent">{BRAND.line}</div>
              </div>
            </div>
            <p className="mt-7 max-w-md text-[14px] leading-[1.9] text-ondarkdim" data-reveal>
              A limited calendar of private bars across Northern California. Seasonal menus, house-made everything, and
              a bartender who learns your guests' names by the second round.
            </p>

            <form onSubmit={subscribe} className="mt-9 max-w-md" data-reveal>
              <span className="eyebrow text-accent">The Cellar Letter</span>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ondark/65">
                Four times a year: what is in season, one new recipe, and the dates that open first.
              </p>
              <div className="mt-4 flex items-end gap-3">
                <div className="flex-1">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="field !border-ondark/25 !text-ondark placeholder:!text-ondark/60 focus:!border-accent"
                  />
                  {err && <span className="mt-2 block text-[11px] text-[#e2a08d]">{err}</span>}
                </div>
                <button type="submit" className={`btn btn-line shrink-0 !border-ondark/30 !text-ondark ${plum ? "!rounded-full" : ""}`}>
                  <span>{sent ? "Welcome" : "Subscribe"}</span>
                </button>
              </div>
              {sent && (
                <p className="mt-3 flex items-center gap-2 text-[12px] text-accent">
                  <Icon name="check" className="h-3.5 w-3.5" /> You are on the list — first letter lands with the spring menu.
                </p>
              )}
            </form>
          </div>

          {/* columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
            <div data-reveal>
              <span className="eyebrow text-accent">Explore</span>
              <ul className="mt-5 space-y-3">
                {[
                  ["story", "The Story"],
                  ["services", "Services"],
                  ["menu", "Cocktail Menu"],
                  ["packages", "Packages"],
                  ["gallery", "Gallery"],
                  ["booking", "Reserve"],
                ].map(([id, label]) => (
                  <li key={id}>
                    <button onClick={() => scrollToId(id)} className="link-u text-[13px] text-ondark/65 transition-colors hover:text-accent">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal data-reveal-delay="0.08">
              <span className="eyebrow text-accent">Services</span>
              <ul className="mt-5 space-y-3">
                {SERVICES.map((s) => (
                  <li key={s.num}>
                    <button onClick={() => scrollToId("services")} className="link-u text-left text-[13px] text-ondark/65 transition-colors hover:text-accent">
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* contact */}
          <div className="lg:col-span-3" data-reveal data-reveal-delay="0.14">
            <span className="eyebrow text-accent">Studio</span>
            <p className="mt-5 text-[13.5px] leading-relaxed text-ondark/70">{BRAND.studio}</p>
            <div className="mt-5 space-y-2">
              <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`} className="link-u block text-[13.5px] text-ondark/70 hover:text-accent">
                {BRAND.phone}
              </a>
              <a href={`mailto:${BRAND.email}`} className="link-u block text-[13.5px] text-ondark/70 hover:text-accent">
                {BRAND.email}
              </a>
            </div>

            <div className="mt-8 border-t border-ondark/12 pt-6">
              <span className="eyebrow text-accent">Hours</span>
              <ul className="mt-4 space-y-2">
                {BRAND.hours.map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-4 text-[12.5px] text-ondark/60">
                    <span>{k}</span>
                    <span className="text-right text-ondark/80">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-ondark/12 pt-6">
              <span className="eyebrow text-accent">Elsewhere</span>
              <div className="mt-4 flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s}
                    href="#top"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="border border-ondark/20 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-ondark/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* oversized wordmark */}
        <div className="mt-20 overflow-x-clip pb-4" data-reveal data-reveal-dir="clip">
          <div className="display group flex w-full items-end justify-between gap-6 leading-[0.8] text-ondark/12">
            <span className="text-[clamp(3.5rem,15vw,13rem)] transition-colors duration-700 group-hover:text-accent/35">Benita</span>
            <span className="display-it hidden text-[clamp(1rem,2.2vw,2rem)] text-ondark/25 md:block">poured, not served</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-ondark/12 pt-7">
          <p className="text-[11px] text-ondark/60">
            © {new Date().getFullYear()} Benita Bar Co. · RBS & food-handler certified · $2M liability insured · Sample
            data shown for design purposes.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-[11px] text-ondark/60">Serving {BRAND.areas.join(" · ")}</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ondark/60 transition-colors hover:text-accent"
            >
              Back to top
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ondark/25 transition-transform duration-500 group-hover:-translate-y-1">
                <Icon name="arrowUp" className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* seasonal strip */}
      <div className="relative flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-ondark/12 py-4">
        {TICKER.slice(0, 4).map((t) => (
          <span key={t} className="text-[10px] uppercase tracking-[0.22em] text-ondark/60">
            {t}
          </span>
        ))}
      </div>
    </footer>
  );
}
