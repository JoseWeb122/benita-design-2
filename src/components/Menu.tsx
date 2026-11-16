import { useEffect, useMemo, useState } from "react";
import { CATS, COCKTAILS, type Cat, type Cocktail } from "@/lib/data";
import { gsap, scrollToId, useReveal } from "@/lib/motion";
import { MAX_COCKTAILS, useBooking } from "@/lib/booking";
import { useTheme } from "@/lib/theme";
import { Icon, Ornament, SectionHead, StrengthMeter } from "./ui";

export default function Menu() {
  const { theme } = useTheme();
  return theme === "espresso" ? <MenuEspresso /> : <MenuPlum />;
}

/* -------------------------------------------------------------- helpers */
function Plate({ c, className = "" }: { c: Cocktail; className?: string }) {
  if (c.img) return <img src={c.img} alt={c.name} className={className} />;
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ background: "radial-gradient(120% 120% at 30% 20%, var(--c-ink-2), var(--c-ink))" }}>
      <span className="display absolute text-[7rem] leading-none text-ondark/8">{c.name.charAt(0)}</span>
      <Icon name={c.cat === "zero" ? "leaf" : c.cat === "classic" ? "glass2" : "sparkle"} className="relative h-10 w-10 text-accent/70" />
    </div>
  );
}

function SelectDots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-1.5">
      {Array.from({ length: MAX_COCKTAILS }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-6 transition-all duration-500 ${i < n ? "bg-accent" : "bg-current opacity-20"}`}
        />
      ))}
    </span>
  );
}

function Filters({
  cat,
  setCat,
  counts,
  dark,
  pill,
}: {
  cat: Cat | "all";
  setCat: (c: Cat | "all") => void;
  counts: Record<string, number>;
  dark?: boolean;
  pill?: boolean;
}) {
  const items: { id: Cat | "all"; label: string }[] = [{ id: "all", label: "Everything" }, ...CATS.map((c) => ({ id: c.id, label: c.label }))];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((it) => {
        const on = cat === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setCat(it.id)}
            className={`chip ${pill ? "!rounded-full" : ""} ${on ? "chip-on" : dark ? "!border-ondark/25 !text-ondark/70 hover:!text-ondark" : ""}`}
          >
            {it.label}
            <span className={`text-[9px] ${on ? "text-accent" : "opacity-50"}`}>{counts[it.id]}</span>
          </button>
        );
      })}
    </div>
  );
}

function Detail({ c, dark }: { c: Cocktail; dark?: boolean }) {
  const row = dark ? "border-ondark/12" : "border-line";
  return (
    <div className="grid gap-8 py-7 md:grid-cols-[160px_1fr_1fr]">
      <div className={`duo ${dark ? "" : "arch"} aspect-[4/5] w-40 overflow-hidden`}>
        <Plate c={c} />
      </div>
      <div>
        <span className={`eyebrow ${dark ? "text-accent" : "text-accentink"}`}>Build</span>
        <ul className="mt-4 space-y-2">
          {c.ingredients.map((i) => (
            <li key={i} className={`flex items-baseline gap-3 border-b pb-2 text-[13.5px] ${row} ${dark ? "text-ondark/85" : "text-ink/80"}`}>
              <span className="h-1 w-1 shrink-0 bg-accent2" />
              {i}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        {[
          ["Glassware", c.glass],
          ["Base", c.base],
          ["Garnish", c.garnish],
        ].map(([k, v]) => (
          <div key={k}>
            <div className={`text-[9.5px] uppercase tracking-[0.2em] ${dark ? "text-ondark/60" : "text-ink/60"}`}>{k}</div>
            <div className={`display-it mt-1 text-[1.15rem] ${dark ? "text-ondark" : "text-ink"}`}>{v}</div>
          </div>
        ))}
        <div className={`border-t pt-4 text-[13px] leading-relaxed ${row} ${dark ? "text-ondarkdim" : "text-ink/65"}`}>
          {c.notes}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ ESPRESSO */
function MenuEspresso() {
  const root = useReveal([]);
  const { state, toggleCocktail } = useBooking();
  const [cat, setCat] = useState<Cat | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: COCKTAILS.length };
    CATS.forEach((x) => (c[x.id] = COCKTAILS.filter((k) => k.cat === x.id).length));
    return c;
  }, []);

  const list = useMemo(() => (cat === "all" ? COCKTAILS : COCKTAILS.filter((c) => c.cat === cat)), [cat]);
  const active = COCKTAILS.find((c) => c.id === open) ?? null;

  const pick = (c: Cocktail) => {
    const added = toggleCocktail(c.id);
    if (!added && !state.cocktails.includes(c.id)) {
      setFlash(`A ${MAX_COCKTAILS}-drink menu keeps the bar fast — remove one to add another.`);
      window.setTimeout(() => setFlash(null), 3200);
    } else {
      setFlash(added ? `${c.name} added to your menu.` : `${c.name} removed.`);
      window.setTimeout(() => setFlash(null), 2400);
    }
  };

  return (
    <section id="menu" ref={root} className="relative overflow-hidden bg-ink py-24 text-ondark md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(80% 55% at 85% 8%, rgba(199,164,119,0.18), transparent 62%)" }} />
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            dark
            index="03"
            kicker="The Menu"
            title="Fifteen drinks. Pick four, or let me *write* yours"
            className="max-w-2xl"
          />
          <div data-reveal className="w-full max-w-xs border border-ondark/15 p-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-accent">Your menu</span>
              <span className="display text-2xl">
                {state.cocktails.length}
                <span className="text-ondark/60">/{MAX_COCKTAILS}</span>
              </span>
            </div>
            <div className="mt-4 text-ondark/70">
              <SelectDots n={state.cocktails.length} />
            </div>
            <p className={`mt-4 min-h-[36px] text-[11.5px] leading-relaxed transition-opacity duration-300 ${flash ? "text-accent opacity-100" : "text-ondark/60 opacity-100"}`}>
              {flash ?? "Tap the plus beside any drink to build the list you want poured on the night."}
            </p>
            <button
              onClick={() => scrollToId("booking")}
              disabled={state.cocktails.length === 0}
              className="btn btn-line mt-2 w-full !border-ondark/25 !py-3 !text-[10px] !text-ondark disabled:opacity-40"
            >
              <span>Take this menu to booking</span>
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-y border-ondark/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          <Filters cat={cat} setCat={setCat} counts={counts} dark />
          <span className="display-it text-[1.1rem] text-accent/85">
            {CATS.find((c) => c.id === cat)?.blurb ?? "The full list, as it sits in the book"}
          </span>
        </div>

        <ul className="mt-4">
          {list.map((c, i) => {
            const on = state.cocktails.includes(c.id);
            const isOpen = open === c.id;
            return (
              <li key={c.id} data-reveal data-reveal-dist="26" data-reveal-delay={Math.min(i * 0.03, 0.2)}>
                <div className={`group border-b border-ondark/12 transition-colors duration-500 ${isOpen ? "bg-ondark/[0.04]" : "hover:bg-ondark/[0.03]"}`}>
                  <div className="flex items-center gap-4 py-5 md:gap-8">
                    <span className="display hidden w-10 shrink-0 text-[1rem] text-ondark/60 md:block">{String(i + 1).padStart(2, "0")}</span>
                    <button onClick={() => setOpen(isOpen ? null : c.id)} className="flex min-w-0 flex-1 items-center gap-4 text-left md:gap-8">
                      <span className="min-w-0 flex-1">
                        <span className={`display block truncate text-[clamp(1.4rem,2.6vw,2.1rem)] leading-tight transition-transform duration-700 group-hover:translate-x-2 ${isOpen ? "text-accent" : ""}`}>
                          {c.name}
                        </span>
                        <span className="mt-1 block text-[10.5px] uppercase tracking-[0.18em] text-ondark/60">
                          {c.base} · {c.glass}
                        </span>
                      </span>
                      <span className="hidden max-w-sm flex-1 text-[13px] leading-relaxed text-ondarkdim lg:block">{c.notes}</span>
                      <span className="hidden shrink-0 text-ondark/70 sm:block">
                        <StrengthMeter level={c.strength} dark />
                      </span>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-45 border-accent text-accent" : "border-ondark/25 text-ondark/60 group-hover:border-accent group-hover:text-accent"}`}>
                        <Icon name="plus" className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    <button
                      onClick={() => pick(c)}
                      aria-label={on ? `Remove ${c.name}` : `Add ${c.name}`}
                      className={`shrink-0 border px-3 py-2 text-[9.5px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                        on ? "border-accent bg-accent text-ink" : "border-ondark/25 text-ondark/70 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {on ? "On menu" : "Add"}
                    </button>
                  </div>
                  <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <div className="border-t border-ondark/10">{active && isOpen && <Detail c={c} dark />}</div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border border-ondark/15 p-7 md:flex-row md:items-center" data-reveal>
          <div>
            <h3 className="display text-[1.8rem] leading-none">Can't find the drink you want?</h3>
            <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-ondarkdim">
              Most menus end up half-written from scratch. Tell me about the person the night is for and I will build
              something that only exists once — tasted with you before it is ever poured.
            </p>
          </div>
          <button onClick={() => scrollToId("booking")} className="btn btn-solid shrink-0 !bg-accent !text-ink hover:!text-ink">
            <span>Commission a cocktail</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ PLUM */
function MenuPlum() {
  const root = useReveal([]);
  const { state, toggleCocktail } = useBooking();
  const [cat, setCat] = useState<Cat | "all">("all");
  const [modal, setModal] = useState<Cocktail | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: COCKTAILS.length };
    CATS.forEach((x) => (c[x.id] = COCKTAILS.filter((k) => k.cat === x.id).length));
    return c;
  }, []);
  const list = useMemo(() => (cat === "all" ? COCKTAILS : COCKTAILS.filter((c) => c.cat === cat)), [cat]);

  useEffect(() => {
    if (!modal) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    window.addEventListener("keydown", esc);
    gsap.fromTo(".mp-modal", { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "expo.out" });
    gsap.fromTo(".mp-back", { opacity: 0 }, { opacity: 1, duration: 0.4 });
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [modal]);

  const pick = (c: Cocktail) => {
    const added = toggleCocktail(c.id);
    setFlash(
      !added && !state.cocktails.includes(c.id)
        ? `A ${MAX_COCKTAILS}-drink menu keeps the bar fast — remove one first.`
        : added
          ? `${c.name} added to your menu.`
          : `${c.name} removed.`,
    );
    window.setTimeout(() => setFlash(null), 3000);
  };

  return (
    <section id="menu" ref={root} className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 45% at 15% 0%, var(--c-paper-2), transparent 60%)" }} />
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <SectionHead
          align="center"
          index="03"
          kicker="The Menu"
          title="Choose four. Or let me write something that exists *once*"
          lede="Every drink below is built to order at your bar — no pre-batching, no shortcuts, identical glassware for the zero-proof pours."
        />
        <Ornament className="mt-8 justify-center" />

        <div className="mt-12 flex flex-col items-center gap-6">
          <Filters cat={cat} setCat={setCat} counts={counts} pill />
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-line py-4">
            <span className="eyebrow text-accentink">Your menu — {state.cocktails.length}/{MAX_COCKTAILS}</span>
            <span className="text-ink/60">
              <SelectDots n={state.cocktails.length} />
            </span>
            <span className={`text-[11.5px] transition-opacity ${flash ? "text-accentink opacity-100" : "text-ink/60"}`}>
              {flash ?? "Tap a card to read the build, then add it to your night."}
            </span>
            <button onClick={() => scrollToId("booking")} className="btn btn-line !rounded-full !px-5 !py-2 !text-[9.5px]">
              <span>Take to booking</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => {
            const on = state.cocktails.includes(c.id);
            return (
              <article
                key={c.id}
                data-reveal
                data-reveal-dist="40"
                data-reveal-delay={Math.min(i * 0.05, 0.25)}
                className="group relative"
              >
                <button onClick={() => setModal(c)} className="block w-full text-left">
                  <div className="duo arch relative aspect-[4/5] w-full overflow-hidden bg-paper2">
                    <Plate c={c} className="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.07]" />
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 border border-ondark/30 bg-ink/45 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-ondark backdrop-blur-[1px]">
                      {CATS.find((x) => x.id === c.cat)?.label}
                    </span>
                    <span className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-ondark/90">Read the build</span>
                      <Icon name="arrow" className="h-4 w-4 text-ondark" />
                    </span>
                  </div>
                </button>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="display truncate text-[1.65rem] leading-none text-ink">{c.name}</h3>
                    <p className="mt-2 text-[10.5px] uppercase tracking-[0.18em] text-ink/60">
                      {c.base} · {c.glass}
                    </p>
                  </div>
                  <StrengthMeter level={c.strength} />
                </div>
                <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink/65">{c.notes}</p>
                <button
                  onClick={() => pick(c)}
                  className={`mt-5 inline-flex w-full items-center justify-center gap-2 border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                    on
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink/70 hover:border-accent2 hover:bg-accent2/10 hover:text-ink"
                  }`}
                >
                  <Icon name={on ? "check" : "plus"} className="h-3.5 w-3.5" />
                  {on ? "On your menu" : "Add to menu"}
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-16 grid items-center gap-8 border border-line bg-paper2/70 p-8 md:grid-cols-[1fr_auto] md:p-10" data-reveal>
          <div>
            <h3 className="display text-[clamp(1.6rem,3vw,2.4rem)] leading-none text-ink">The commissioned cocktail</h3>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink/70">
              Tell me who the night is for. I will build a drink around a memory, a garden, a grandmother's recipe or
              the colour of your flowers — tasted with you, printed on the menu card, poured only once.
            </p>
          </div>
          <button onClick={() => scrollToId("booking")} className="btn btn-solid !rounded-full">
            <span>Commission a cocktail</span>
          </button>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[88] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <button aria-label="Close" onClick={() => setModal(null)} className="mp-back absolute inset-0 bg-ink/70 backdrop-blur-[3px]" />
          <div className="mp-modal relative max-h-[92svh] w-full max-w-3xl overflow-y-auto bg-paper shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setModal(null)}
              aria-label="Close detail"
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-accent2 hover:text-accentink"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
            <div className="duo arch mx-auto mt-6 aspect-[16/10] w-[86%] overflow-hidden">
              <Plate c={modal} />
            </div>
            <div className="px-6 pb-8 md:px-10">
              <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="eyebrow text-accentink">{CATS.find((x) => x.id === modal.cat)?.label}</span>
                  <h3 className="display mt-2 text-[clamp(2rem,5vw,3rem)] leading-none text-ink">{modal.name}</h3>
                </div>
                <StrengthMeter level={modal.strength} />
              </div>
              <Detail c={modal} />
              <button
                onClick={() => {
                  pick(modal);
                }}
                className={`btn w-full ${state.cocktails.includes(modal.id) ? "btn-line" : "btn-solid"} !rounded-full`}
              >
                <span>{state.cocktails.includes(modal.id) ? "Remove from menu" : "Add to my menu"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
