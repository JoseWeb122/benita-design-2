import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ADDONS, COCKTAILS, PACKAGES, type Pkg } from "./data";

export type BookingState = {
  eventType: string;
  date: string;
  guests: number;
  venue: string;
  city: string;
  pkgId: string;
  addons: string[];
  barStyle: string;
  cocktails: string[];
  name: string;
  email: string;
  phone: string;
  message: string;
  referral: string;
  agree: boolean;
};

const TRAVEL = 150;
const EXTRA_COCKTAIL = 120;
const COCKTAIL_ALLOWANCE: Record<string, number> = { pour: 2, house: 4, estate: 6 };
export const MAX_COCKTAILS = 4;

const initial: BookingState = {
  eventType: "Wedding",
  date: "",
  guests: 90,
  venue: "",
  city: "Napa Valley",
  pkgId: "house",
  addons: [],
  barStyle: "walnut",
  cocktails: ["late-bloomer", "amber-vow"],
  name: "",
  email: "",
  phone: "",
  message: "",
  referral: "Referral from a friend",
  agree: false,
};

type BookingCtx = {
  state: BookingState;
  set: <K extends keyof BookingState>(k: K, v: BookingState[K]) => void;
  toggleAddon: (id: string) => void;
  toggleCocktail: (id: string) => boolean;
  pkg: Pkg;
  breakdown: Line[];
  subtotal: number;
  deposit: number;
  perGuest: number;
  reference: string | null;
  submit: () => string;
  reset: () => void;
};

export type Line = { label: string; value: number; note?: string };

const Ctx = createContext<BookingCtx | null>(null);

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initial);
  const [reference, setReference] = useState<string | null>(null);

  const set = useCallback(<K extends keyof BookingState>(k: K, v: BookingState[K]) => {
    setState((s) => ({ ...s, [k]: v }));
  }, []);

  const toggleAddon = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      addons: s.addons.includes(id) ? s.addons.filter((a) => a !== id) : [...s.addons, id],
    }));
  }, []);

  const toggleCocktail = useCallback((id: string) => {
    let added = false;
    setState((s) => {
      if (s.cocktails.includes(id)) return { ...s, cocktails: s.cocktails.filter((c) => c !== id) };
      if (s.cocktails.length >= MAX_COCKTAILS) return s;
      added = true;
      return { ...s, cocktails: [...s.cocktails, id] };
    });
    return added;
  }, []);

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === state.pkgId) || PACKAGES[1], [state.pkgId]);

  const breakdown = useMemo<Line[]>(() => {
    const lines: Line[] = [
      { label: `${pkg.name} — base`, value: pkg.base, note: `${pkg.hours} of service` },
      { label: `Stock, ice & labour — ${state.guests} guests`, value: pkg.perGuest * state.guests, note: `${money(pkg.perGuest)} per guest` },
      { label: "Travel, load-in & teardown", value: TRAVEL, note: "Within 60 miles of Napa" },
    ];
    state.addons.forEach((id) => {
      const a = ADDONS.find((x) => x.id === id);
      if (!a) return;
      lines.push({
        label: a.name,
        value: a.perGuest ? a.price * state.guests : a.price,
        note: a.desc,
      });
    });
    const allowance = COCKTAIL_ALLOWANCE[pkg.id] ?? 2;
    const extra = Math.max(0, state.cocktails.length - allowance);
    if (extra > 0) {
      lines.push({
        label: `${extra} additional signature cocktail${extra > 1 ? "s" : ""}`,
        value: extra * EXTRA_COCKTAIL,
        note: `${money(EXTRA_COCKTAIL)} each — R&D, sourcing & tasting`,
      });
    }
    return lines;
  }, [pkg, state.guests, state.addons, state.cocktails.length]);

  const subtotal = useMemo(() => breakdown.reduce((n, l) => n + l.value, 0), [breakdown]);
  const deposit = Math.round(subtotal * 0.3);
  const perGuest = state.guests > 0 ? Math.round(subtotal / state.guests) : 0;

  const submit = useCallback(() => {
    const code = `BNC-${Math.floor(1000 + Math.random() * 8999)}`;
    setReference(code);
    return code;
  }, []);

  const reset = useCallback(() => {
    setReference(null);
    setState(initial);
  }, []);

  const value = useMemo(
    () => ({
      state,
      set,
      toggleAddon,
      toggleCocktail,
      pkg,
      breakdown,
      subtotal,
      deposit,
      perGuest,
      reference,
      submit,
      reset,
    }),
    [state, set, toggleAddon, toggleCocktail, pkg, breakdown, subtotal, deposit, perGuest, reference, submit, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

export const cocktailById = (id: string) => COCKTAILS.find((c) => c.id === id);
