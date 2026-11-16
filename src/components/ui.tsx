import type { ReactNode } from "react";
import { Words } from "@/lib/motion";

/* ------------------------------------------------------------------ ICONS */
const P: Record<string, ReactNode> = {
  shaker: (
    <>
      <path d="M9 3h6v3l2 4v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9l2-4V3Z" />
      <path d="M7 10h10M9 3h6" />
    </>
  ),
  coupe: (
    <>
      <path d="M4 5h16l-7 8v7M8 20h8" />
      <circle cx="15" cy="8" r="1.2" />
    </>
  ),
  citrus: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c3 4 5.5 5.5 5.5 9.5A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-8.5C7 10 9 8.5 9 6c1.5 1 3 1.5 3-3Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s6-1 10-5c3-3 5-7 5-11Z" />
      <path d="M5 20C8 14 12 10 18 7" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 2.5h4v4l2.5 4v10a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 7.5 20.5v-10l2.5-4v-4Z" />
      <path d="M7.5 13h9" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7z" />
      <circle cx="7" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </>
  ),
  star: <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z" />,
  quote: (
    <path d="M9.5 6C6.5 7.6 5 10 5 13.2V18h5.5v-5.5H8c0-2 .8-3.4 2.6-4.5L9.5 6Zm9 0C15.5 7.6 14 10 14 13.2V18h5.5v-5.5H17c0-2 .8-3.4 2.6-4.5L18.5 6Z" />
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  arrowUp: <path d="M12 20V4m-6 6 6-6 6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  close: <path d="M6 6 18 18M18 6 6 18" />,
  menu: <path d="M3 7h18M3 12h18M3 17h12" />,
  phone: <path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />,
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  ice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M9 4v16M4 9h16" />
    </>
  ),
  sparkle: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" />,
  glass2: (
    <>
      <path d="M7 3h10l-1.4 8.5A3.7 3.7 0 0 1 12 14.6a3.7 3.7 0 0 1-3.6-3.1L7 3Z" />
      <path d="M12 14.6V20M8.5 20h7" />
    </>
  ),
};

export function Icon({ name, className = "h-5 w-5", stroke = true }: { name: keyof typeof P | string; className?: string; stroke?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : "none"}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {P[name] ?? null}
    </svg>
  );
}

export const SERVICE_ICONS = ["coupe", "truck", "sparkle", "shaker", "bottle", "leaf"];

/* --------------------------------------------------------------- MONOGRAM */
export function Monogram({ className = "h-8 w-8", spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22.4" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <g className={spin ? "spin-slow" : ""} style={{ transformOrigin: "24px 24px" }}>
        <path d="M15 15h18l-8 9.4V33" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5 33h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="29.5" cy="19.5" r="1.7" fill="currentColor" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- EYEBROW */
export function Eyebrow({ children, dark, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span className={`eyebrow inline-flex items-center gap-3 ${dark ? "text-accent" : "text-accentink"} ${className}`}>
      <span className={`inline-block h-px w-8 ${dark ? "bg-accent/60" : "bg-accent2/60"}`} />
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- ORNAMENT */
export function Ornament({ dark, className = "" }: { dark?: boolean; className?: string }) {
  const c = dark ? "text-accent/70" : "text-accentink/70";
  return (
    <span className={`flex items-center gap-3 ${c} ${className}`} aria-hidden>
      <span className="h-px w-10 bg-current opacity-50" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10Z" />
      </svg>
      <span className="h-px w-10 bg-current opacity-50" />
    </span>
  );
}

/* ----------------------------------------------------------- SECTION HEAD */
export function SectionHead({
  index,
  kicker,
  title,
  lede,
  dark,
  align = "left",
  className = "",
}: {
  index?: string;
  kicker: string;
  title: string;
  lede?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-3xl text-center" : ""} ${className}`}>
      <div className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}>
        {index && (
          <span className={`display text-2xl ${dark ? "text-accent/70" : "text-accentink/70"}`} data-reveal>
            {index}
          </span>
        )}
        <Eyebrow dark={dark}>{kicker}</Eyebrow>
      </div>
      <Words
        Tag="h2"
        className={`display mt-5 text-[clamp(2.4rem,6vw,5.2rem)] ${dark ? "text-ondark" : "text-ink"}`}
      >
        {title}
      </Words>
      {lede && (
        <p
          data-reveal
          data-reveal-delay="0.15"
          className={`mt-6 max-w-xl text-[15px] leading-relaxed ${centered ? "mx-auto" : ""} ${
            dark ? "text-ondarkdim" : "text-ink/70"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- BUTTON */
export function Btn({
  children,
  variant = "solid",
  onClick,
  href,
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  variant?: "solid" | "line" | "dark-line";
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = `btn ${variant === "solid" ? "btn-solid" : variant === "line" ? "btn-line" : "btn-dark-line"} ${
    disabled ? "pointer-events-none opacity-40" : ""
  } ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <Icon name="arrow" className="h-4 w-4" />
    </>
  );
  if (href)
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/* ---------------------------------------------------------------- MARQUEE */
export function Marquee({
  items,
  dark,
  speed = 46,
  separator = "✦",
  className = "",
}: {
  items: string[];
  dark?: boolean;
  speed?: number;
  separator?: string;
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={`marquee-host overflow-hidden ${className}`}>
      <div className="marquee-track" style={{ ["--mq-dur" as string]: `${speed}s` }}>
        {row.map((it, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className={`display px-6 leading-[1.14] text-[clamp(1.6rem,3.4vw,2.9rem)] ${dark ? "text-ondark" : "text-ink"}`}>{it}</span>
            <span className={`text-xs ${dark ? "text-accent" : "text-accentink"}`}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- STRENGTH */
export function StrengthMeter({ level, dark }: { level: number; dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-[3px]" title={level === 0 ? "Zero proof" : `Strength ${level}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-3 w-[3px] rounded-full transition-all duration-300 ${
            i <= level
              ? dark
                ? "bg-accent"
                : "bg-accent2"
              : dark
                ? "bg-ondark/20"
                : "bg-ink/15"
          }`}
        />
      ))}
    </span>
  );
}
