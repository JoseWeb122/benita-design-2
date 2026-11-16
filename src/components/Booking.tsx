import { useEffect, useMemo, useRef, useState } from "react";
import { ADDONS, BAR_STYLES, BRAND, EVENT_TYPES, IMG, PACKAGES } from "@/lib/data";
import { gsap, reduced, scrollToId, useReveal } from "@/lib/motion";
import { MAX_COCKTAILS, cocktailById, money, useBooking } from "@/lib/booking";
import { useTheme } from "@/lib/theme";
import { Btn, Eyebrow, Icon, SectionHead } from "./ui";
import { Money } from "./Packages";

const STEPS = ["The Event", "The Bar", "The Details", "Review"];
const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const today = new Date().toISOString().slice(0, 10);

type Errors = Partial<Record<string, string>>;

export default function Booking() {
  const { theme } = useTheme();
  const plum = theme === "plum";
  const root = useReveal([theme]);
  const { state, set, toggleAddon, pkg, breakdown, subtotal, deposit, perGuest, reference, submit, reset } = useBooking();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const panelRef = useRef<HTMLDivElement>(null);

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (!state.date) e.date = "Choose the date you want the bar.";
      else if (state.date < today) e.date = "That date has already been poured.";
      if (!state.venue.trim()) e.venue = "Tell us where the night happens.";
      if (!state.city.trim()) e.city = "Which region?";
    }
    if (s === 2) {
      if (!state.name.trim()) e.name = "We would like a name for the booking.";
      if (!emailRe.test(state.email)) e.email = "A valid email, so we can send the quote.";
      if (state.phone.replace(/\D/g, "").length < 7) e.phone = "A number we can reach you on the day.";
      if (!state.agree) e.agree = "Please confirm we may contact you about this enquiry.";
    }
    if (s === 3) {
      for (let k = 0; k <= 2; k++) Object.assign(e, validate(k));
    }
    return e;
  };

  const animateStep = () => {
    if (reduced() || !panelRef.current) return;
    gsap.fromTo(
      panelRef.current.querySelectorAll("[data-step-el]"),
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.75, ease: "expo.out", stagger: 0.055 },
    );
  };

  useEffect(() => {
    animateStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      gsap.fromTo(panelRef.current, { x: -8 }, { x: 0, duration: 0.55, ease: "elastic.out(1,0.35)" });
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const chosen = state.cocktails.map(cocktailById).filter(Boolean);
  const chosenAddons = state.addons.map((id) => ADDONS.find((a) => a.id === id)).filter(Boolean);
  const style = BAR_STYLES.find((b) => b.id === state.barStyle)!;
  const dateLabel = state.date
    ? new Date(state.date + "T18:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "Date to be confirmed";

  const ics = useMemo(() => {
    const d = (state.date || today).replace(/-/g, "");
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Benita Bar Co.//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${reference || "draft"}@benitabar.co`,
      `DTSTAMP:${d}T000000Z`,
      `DTSTART:${d}T180000`,
      `DTEND:${d}T235900`,
      `SUMMARY:${state.eventType} — ${pkg.name} bar service (Benita Bar Co.)`,
      `LOCATION:${state.venue || "Venue TBC"}\\, ${state.city}`,
      `DESCRIPTION:Reference ${reference || "draft"}\\nGuests: ${state.guests}\\nMenu: ${chosen.map((c) => c!.name).join(", ") || "TBC"}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }, [state, pkg, chosen, reference]);

  const downloadIcs = () => {
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `benita-bar-${reference || "enquiry"}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const field = (k: string) => `field ${errors[k] ? "field-err" : ""}`;
  const err = (k: string) => (errors[k] ? <span className="mt-2 block text-[11px] text-[#b4442e]">{errors[k]}</span> : null);

  /* ------------------------------------------------------------ SUCCESS */
  if (reference) {
    return (
      <section id="booking" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper2 py-24 md:py-32" : "bg-ink py-24 text-ondark md:py-32"}`}>
        <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
          <div className="duo mx-auto h-40 w-40 overflow-hidden rounded-full" data-reveal>
            <img src={IMG.coupe} alt="Champagne coupe" className="kenburns" />
          </div>
          <span className={`eyebrow mt-9 block ${plum ? "text-accentink" : "text-accent"}`}>Enquiry received</span>
          <h2 className={`display mt-5 text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[0.95] ${plum ? "text-ink" : "text-ondark"}`}>
            Your date is <span className="display-it">asked for</span>
          </h2>
          <p className={`mx-auto mt-6 max-w-xl text-[15px] leading-relaxed ${plum ? "text-ink/70" : "text-ondarkdim"}`}>
            Reference <strong className={plum ? "text-accentink" : "text-accent"}>{reference}</strong>. Benita replies
            personally within one working day — usually with two questions about your room and a proposed tasting date.
          </p>

          <div className={`mt-10 grid gap-px overflow-hidden text-left ${plum ? "bg-line rounded-2xl" : "bg-ondark/12"}`}>
            {[
              ["Event", `${state.eventType} · ${state.guests} guests`],
              ["Date", dateLabel],
              ["Where", `${state.venue || "TBC"}, ${state.city}`],
              ["Bar", `${pkg.name} · ${style.name}`],
              ["Menu", chosen.map((c) => c!.name).join(" · ") || "To be written together"],
              ["Estimate", `${money(subtotal)} total · ${money(deposit)} deposit`],
            ].map(([k, v]) => (
              <div key={k} className={`flex flex-wrap items-baseline justify-between gap-3 px-6 py-4 ${plum ? "bg-paper" : "bg-ink"}`}>
                <span className={`text-[10px] uppercase tracking-[0.2em] ${plum ? "text-ink/60" : "text-ondark/60"}`}>{k}</span>
                <span className={`display text-[1.15rem] ${plum ? "text-ink" : "text-ondark"}`}>{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Btn variant={plum ? "solid" : "dark-line"} onClick={downloadIcs}>
              Add to calendar
            </Btn>
            <Btn
              variant={plum ? "line" : "dark-line"}
              onClick={() => {
                reset();
                setStep(0);
                setErrors({});
              }}
            >
              Plan another event
            </Btn>
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------------------- FORM */
  return (
    <section id="booking" ref={root} className={`relative overflow-hidden ${plum ? "bg-paper py-24 md:py-32" : "bg-paper2 py-24 md:py-36"}`}>
      {!plum && <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(80% 50% at 10% 0%, color-mix(in oklab, var(--c-latte) 60%, transparent), transparent 62%)" }} />}

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index="07"
            kicker="Reserve a Date"
            title={plum ? "Tell me about the *night*" : "Four steps. One honest quote."}
            className="max-w-2xl"
          />
          <p data-reveal className={`max-w-sm text-[13.5px] leading-relaxed ${plum ? "text-ink/65" : "text-ink/60"}`}>
            Nothing here is sent to a call centre. Your answers land with Benita, who will reply personally within one
            working day with a written quote and two possible tasting dates.
          </p>
        </div>

        {/* stepper */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-5" data-reveal>
          {STEPS.map((s, i) => {
            const done = i < step;
            const on = i === step;
            return (
              <button
                key={s}
                onClick={() => (i <= step ? setStep(i) : null)}
                disabled={i > step}
                className={`group flex items-center gap-3 text-left ${i > step ? "cursor-not-allowed opacity-40" : ""}`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center border text-[11px] transition-all duration-500 ${plum ? "rounded-full" : ""} ${
                    on ? "border-ink bg-ink text-paper" : done ? "border-accent2 bg-accent2 text-ink" : "border-line text-ink/62"
                  }`}
                >
                  {done ? <Icon name="check" className="h-3.5 w-3.5" /> : `0${i + 1}`}
                </span>
                <span className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${on ? "text-ink" : "text-ink/62"}`}>{s}</span>
                {i < STEPS.length - 1 && <span className={`hidden h-px w-10 sm:block ${done ? "bg-accent2" : "bg-line"}`} />}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ------------------------------------------------ form panel */}
          <div ref={panelRef} className={`lg:col-span-8 ${plum ? "" : ""}`}>
            {step === 0 && (
              <div className="space-y-10">
                <Field label="What are we pouring for?" n="01">
                  <div data-step-el className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map((e) => (
                      <button
                        key={e}
                        onClick={() => set("eventType", e)}
                        className={`chip ${plum ? "!rounded-full" : ""} ${state.eventType === e ? "chip-on" : ""}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid gap-10 sm:grid-cols-2">
                  <Field label="Date of the event" n="02">
                    <div data-step-el>
                      <input type="date" aria-label="Date of the event" min={today} value={state.date} onChange={(ev) => set("date", ev.target.value)} className={field("date")} />
                      {err("date")}
                    </div>
                  </Field>
                  <Field label="Guest count" n="03">
                    <div data-step-el>
                      <div className="flex items-baseline gap-4">
                        <input type="range" min={20} max={300} step={5} value={state.guests} onChange={(ev) => set("guests", Number(ev.target.value))} aria-label="Guest count" />
                        <span className="display w-16 shrink-0 text-right text-[2rem] leading-none text-ink">{state.guests}</span>
                      </div>
                      <p className="mt-3 text-[11.5px] text-ink/62">Above 300 we add a second bar and a bar-back as standard.</p>
                    </div>
                  </Field>
                </div>

                <div className="grid gap-10 sm:grid-cols-2">
                  <Field label="Venue or address" n="04">
                    <div data-step-el>
                      <input value={state.venue} onChange={(ev) => set("venue", ev.target.value)} placeholder="Stonebridge Estate, 44 Vine Rd" className={field("venue")} />
                      {err("venue")}
                    </div>
                  </Field>
                  <Field label="Region" n="05">
                    <div data-step-el>
                      <select aria-label="Region" value={state.city} onChange={(ev) => set("city", ev.target.value)} className={`${field("city")} cursor-pointer`}>
                        {[...BRAND.areas, "Elsewhere in California", "Further afield"].map((a) => (
                          <option key={a}>{a}</option>
                        ))}
                      </select>
                      {err("city")}
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-10">
                <Field label="Which bar?" n="06">
                  <div data-step-el className="grid gap-3">
                    {PACKAGES.map((p) => {
                      const on = state.pkgId === p.id;
                      const total = p.base + p.perGuest * state.guests + 150;
                      return (
                        <button
                          key={p.id}
                          onClick={() => set("pkgId", p.id)}
                          className={`flex items-center justify-between gap-5 border p-5 text-left transition-all duration-500 ${plum ? "rounded-xl" : ""} ${
                            on ? "border-accent2 bg-accent2/10" : "border-line bg-paper hover:border-accent2/60"
                          }`}
                        >
                          <span>
                            <span className="flex items-baseline gap-3">
                              <span className="display text-[1.7rem] leading-none text-ink">{p.name}</span>
                              <span className="eyebrow text-ink/60">{p.kicker}</span>
                            </span>
                            <span className="mt-2 block text-[12.5px] text-ink/60">
                              {p.hours} · {p.guests} · {p.includes.length} inclusions
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="display block text-[1.5rem] leading-none text-accentink">{money(total)}</span>
                            <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-ink/60">with {state.guests} guests</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label="Bar format" n="07">
                  <div data-step-el className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                              <span key={c} className={`h-5 w-5 border ${plum ? "rounded-full" : ""} ${on ? "border-ondark/30" : "border-line"}`} style={{ background: c }} />
                            ))}
                          </span>
                          <span className="mt-3 block text-[12.5px] font-semibold">{b.name}</span>
                          <span className={`mt-1 block text-[11px] ${on ? "text-ondark/60" : "text-ink/62"}`}>{b.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label={`Your menu — ${state.cocktails.length}/${MAX_COCKTAILS}`} n="08">
                  <div data-step-el>
                    <div className="flex flex-wrap gap-2">
                      {chosen.length === 0 && <span className="text-[13px] text-ink/62">No drinks chosen yet — the menu can be written together at tasting.</span>}
                      {chosen.map((c) => (
                        <span key={c!.id} className={`group inline-flex items-center gap-2 border border-accent2 bg-accent2/10 px-3 py-2 text-[11.5px] text-ink`}>
                          {c!.name}
                          <button onClick={() => set("cocktails", state.cocktails.filter((x) => x !== c!.id))} aria-label={`Remove ${c!.name}`} className="text-ink/60 transition-colors hover:text-ink">
                            <Icon name="close" className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <button onClick={() => scrollToId("menu")} className="chip !border-dashed">
                        <Icon name="plus" className="h-3 w-3" /> Choose from the menu
                      </button>
                    </div>
                  </div>
                </Field>

                <Field label="Add to the night" n="09">
                  <div data-step-el className="grid gap-2 sm:grid-cols-2">
                    {ADDONS.map((a) => {
                      const on = state.addons.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => toggleAddon(a.id)}
                          className={`flex items-center justify-between gap-4 border px-4 py-3 text-left transition-all duration-500 ${plum ? "rounded-xl" : ""} ${
                            on ? "border-accent2 bg-accent2/10" : "border-line bg-paper hover:border-accent2/60"
                          }`}
                        >
                          <span>
                            <span className="block text-[12.5px] font-semibold text-ink">{a.name}</span>
                            <span className="mt-0.5 block text-[11px] text-ink/62">{a.desc}</span>
                          </span>
                          <span className="display shrink-0 text-[1.1rem] text-accentink">
                            {a.perGuest ? `+${money(a.price)}/g` : `+${money(a.price)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="Your name" n="10">
                  <div data-step-el>
                    <input aria-label="Your name" value={state.name} onChange={(ev) => set("name", ev.target.value)} placeholder="Amara Okafor" className={field("name")} autoComplete="name" />
                    {err("name")}
                  </div>
                </Field>
                <Field label="Email" n="11">
                  <div data-step-el>
                    <input aria-label="Email address" value={state.email} onChange={(ev) => set("email", ev.target.value)} placeholder="you@address.com" className={field("email")} autoComplete="email" />
                    {err("email")}
                  </div>
                </Field>
                <Field label="Phone" n="12">
                  <div data-step-el>
                    <input aria-label="Phone number" value={state.phone} onChange={(ev) => set("phone", ev.target.value)} placeholder="(415) 555-0100" className={field("phone")} autoComplete="tel" />
                    {err("phone")}
                  </div>
                </Field>
                <Field label="How did you find us?" n="13">
                  <div data-step-el>
                    <select aria-label="How did you find us?" value={state.referral} onChange={(ev) => set("referral", ev.target.value)} className={`${field("referral")} cursor-pointer`}>
                      {["Referral from a friend", "Wedding planner", "Venue recommendation", "Instagram", "Search", "Press feature", "We worked together before"].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Anything else we should know?" n="14">
                    <div data-step-el>
                      <textarea
                        rows={4}
                        value={state.message}
                        onChange={(ev) => set("message", ev.target.value)}
                        placeholder="The room, the crowd, the drinks you already love, the allergies, the grandmother whose recipe should be in there…"
                        className={`${field("message")} resize-none border border-line px-4 py-3`}
                      />
                    </div>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <label data-step-el className="flex cursor-pointer items-start gap-4">
                    <input
                      type="checkbox"
                      checked={state.agree}
                      onChange={(ev) => set("agree", ev.target.checked)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                        state.agree ? "border-accent2 bg-accent2 text-ink" : errors.agree ? "border-[#b4442e] text-transparent" : "border-line text-transparent"
                      }`}
                    >
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-ink/65">
                      I am happy for Benita Bar Co. to contact me about this enquiry and to hold my date for seven days
                      while we talk. No payment is taken here — this is a conversation, not a checkout.
                    </span>
                  </label>
                  {err("agree")}
                </div>
              </div>
            )}

            {step === 3 && (
              <div data-step-el className="space-y-8">
                <div className="duo relative aspect-[16/7] w-full overflow-hidden">
                  <img src={IMG.toast} alt="Guests raising coupes in a toast" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 to-transparent p-7">
                    <div>
                      <Eyebrow dark>One last look</Eyebrow>
                      <p className="display mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none text-ondark">
                        {state.eventType} · {state.guests} guests · {dateLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-px bg-line sm:grid-cols-2">
                  {[
                    ["Venue", `${state.venue || "To be confirmed"}, ${state.city}`],
                    ["Package", `${pkg.name} — ${pkg.hours}`],
                    ["Bar format", style.name],
                    ["Menu", chosen.map((c) => c!.name).join(", ") || "Written together at tasting"],
                    ["Add-ons", chosenAddons.length ? chosenAddons.map((a) => a!.name).join(", ") : "None"],
                    ["Contact", `${state.name || "—"} · ${state.email || "—"}`],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-paper px-6 py-5">
                      <span className="eyebrow text-ink/60">{k}</span>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">{v}</p>
                    </div>
                  ))}
                  {state.message && (
                    <div className="bg-paper px-6 py-5 sm:col-span-2">
                      <span className="eyebrow text-ink/60">Notes</span>
                      <p className="display-it mt-2 text-[1.15rem] leading-relaxed text-ink/80">“{state.message}”</p>
                    </div>
                  )}
                </div>

                <div className="border border-line bg-paper p-6">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-accentink">Estimated total</span>
                    <span className="display text-[2.4rem] leading-none text-ink">
                      <Money value={subtotal} />
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[12px] text-ink/65">
                    <span>{money(deposit)} deposit (30%)</span>
                    <span>{money(perGuest)} per guest</span>
                    <span>Balance due 14 days before</span>
                  </div>
                </div>
              </div>
            )}

            {/* nav buttons */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
              <button onClick={back} disabled={step === 0} className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/62 transition-colors hover:text-ink disabled:opacity-30`}>
                <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back
              </button>
              <div className="flex items-center gap-4">
                <span className="hidden text-[11px] uppercase tracking-[0.16em] text-ink/60 sm:block">
                  Step {step + 1} of {STEPS.length}
                </span>
                {step < STEPS.length - 1 ? (
                  <Btn onClick={next} variant={plum ? "solid" : "solid"} className={plum ? "!rounded-full" : ""}>
                    Continue
                  </Btn>
                ) : (
                  <Btn onClick={() => { const e = validate(3); setErrors(e); if (!Object.keys(e).length) submit(); }} className={plum ? "!rounded-full" : ""}>
                    Send the enquiry
                  </Btn>
                )}
              </div>
            </div>
          </div>

          {/* --------------------------------------------- sticky summary */}
          <aside className="lg:col-span-4">
            <div className={`sticky top-32 border bg-paper ${plum ? "rounded-2xl" : ""}`} data-reveal data-reveal-dir="x" data-reveal-dist="40">
              <div className="border-b border-line px-6 py-5">
                <span className="eyebrow text-accentink">Your evening so far</span>
              </div>
              <div className="space-y-4 px-6 py-6">
                {[
                  ["Event", state.eventType],
                  ["Date", dateLabel],
                  ["Guests", `${state.guests}`],
                  ["Package", pkg.name],
                  ["Bar", style.name],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-[var(--c-line-soft)] pb-3">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-ink/60">{k}</span>
                    <span className="text-right text-[13px] text-ink/85">{v}</span>
                  </div>
                ))}
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-ink/60">Menu</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {chosen.length ? (
                      chosen.map((c) => (
                        <span key={c!.id} className="border border-accent2/60 bg-accent2/10 px-2 py-1 text-[10.5px] text-ink">
                          {c!.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[12px] text-ink/60">Not chosen yet</span>
                    )}
                  </div>
                </div>
                {chosenAddons.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-ink/60">Add-ons</span>
                    <ul className="mt-2 space-y-1">
                      {chosenAddons.map((a) => (
                        <li key={a!.id} className="flex items-baseline justify-between gap-3 text-[12px] text-ink/70">
                          <span>{a!.name}</span>
                          <span className="display text-accentink">{a!.perGuest ? `${money(a!.price)}/g` : money(a!.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="border-t border-line bg-paper2/60 px-6 py-6">
                {breakdown.slice(0, 3).map((l) => (
                  <div key={l.label} className="flex items-baseline justify-between gap-4 py-1 text-[12px] text-ink/60">
                    <span className="truncate">{l.label}</span>
                    <span className="shrink-0 tabular-nums">{money(l.value)}</span>
                  </div>
                ))}
                {breakdown.length > 3 && (
                  <div className="py-1 text-[12px] text-ink/60">+ {breakdown.length - 3} more line{breakdown.length > 4 ? "s" : ""}</div>
                )}
                <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                  <span className="eyebrow text-ink/62">Estimate</span>
                  <span className="display text-[2.1rem] leading-none text-ink">
                    <Money value={subtotal} />
                  </span>
                </div>
                <button onClick={() => scrollToId("booking")} className={`btn btn-line mt-5 w-full ${plum ? "!rounded-full" : ""}`}>
                  <span>{money(deposit)} holds the date</span>
                </button>
                <p className="mt-4 text-center text-[10.5px] leading-relaxed text-ink/60">
                  Prefer to talk? {BRAND.phone} · {BRAND.email}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- FIELD WRAP */
function Field({ label, n, children }: { label: string; n: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="display text-[0.95rem] text-accentink/70">{n}</span>
        <span className="eyebrow text-ink/65">{label}</span>
        <span className="rule flex-1" />
      </div>
      {children}
    </div>
  );
}
