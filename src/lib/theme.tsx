import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ThemeId = "espresso" | "plum";

export const THEME_META: Record<
  ThemeId,
  { name: string; subtitle: string; swatch: string[]; ink: string; accent: string; accent2: string }
> = {
  espresso: {
    name: "Espresso & Latte",
    subtitle: "Warm luxury · amber evening",
    swatch: ["#281914", "#493027", "#C7A477", "#D8C0A3", "#F5EFE5"],
    ink: "#281914",
    accent: "#C7A477",
    accent2: "#A77B56",
  },
  plum: {
    name: "Plum & Rose",
    subtitle: "Romantic luxury · moody bloom",
    swatch: ["#351B32", "#54283F", "#D4A1AA", "#C49A9D", "#FBF5F1"],
    ink: "#351B32",
    accent: "#D4A1AA",
    accent2: "#C49A9D",
  },
};

type ThemeCtx = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  toggle: () => void;
  wiping: boolean;
};

const Ctx = createContext<ThemeCtx>({ theme: "espresso", setTheme: () => {}, toggle: () => {}, wiping: false });
export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof document === "undefined") return "espresso";
    return (document.documentElement.dataset.theme as ThemeId) || "espresso";
  });
  const [wiping, setWiping] = useState(false);
  const [curtainTo, setCurtainTo] = useState<ThemeId | null>(null);

  const setTheme = useCallback(
    (next: ThemeId) => {
      if (next === theme || wiping) return;
      setCurtainTo(next);
      setWiping(true);
      window.setTimeout(() => {
        setThemeState(next);
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("benita-theme", next);
        } catch {
          /* private mode */
        }
      }, 460);
      window.setTimeout(() => ScrollTrigger.refresh(), 760);
      window.setTimeout(() => {
        setWiping(false);
        setCurtainTo(null);
      }, 1180);
    },
    [theme, wiping],
  );

  const toggle = useCallback(() => setTheme(theme === "espresso" ? "plum" : "espresso"), [theme, setTheme]);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme === "espresso" ? "dark" : "light";
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, setTheme, toggle, wiping }}>
      {children}
      {curtainTo && (
        <div key={curtainTo} aria-hidden className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
          <div
            className="curtain absolute inset-y-[-10%] left-[-15%] w-[130%]"
            style={{ background: THEME_META[curtainTo].ink }}
          >
            <div className="absolute inset-y-0 left-[62%] w-px" style={{ background: THEME_META[curtainTo].accent }} />
            <div className="absolute inset-y-0 left-[64%] w-[2px] opacity-40" style={{ background: THEME_META[curtainTo].accent }} />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ color: THEME_META[curtainTo].accent }}
            >
              <span className="eyebrow block opacity-90">{THEME_META[curtainTo].name}</span>
              <span className="display-it mt-2 block text-3xl md:text-5xl" style={{ color: THEME_META[curtainTo].swatch[4] }}>
                pouring…
              </span>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
