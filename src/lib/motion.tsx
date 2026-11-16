import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ElementType } from "react";

gsap.registerPlugin(ScrollTrigger);

export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };

/**
 * Wires up every [data-reveal], [data-words], [data-count] and [data-parallax]
 * node inside the returned ref, once, as it enters the viewport.
 */
export function useReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (reduced()) {
      gsap.set(root.querySelectorAll("[data-reveal]"), { clearProps: "opacity,transform" });
      gsap.set(root.querySelectorAll(".w-i"), { y: 0 });
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        n.textContent = n.dataset.count || "0";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // word-mask headings
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
        const words = el.querySelectorAll<HTMLElement>(".w-i");
        const delay = Number(el.dataset.wordsDelay || 0);
        gsap.to(words, {
          y: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.028,
          delay,
          scrollTrigger: { trigger: el, start: el.dataset.wordsStart || "top 92%", once: true },
        });
      });

      // generic fade / rise blocks
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const dist = Number(el.dataset.revealDist ?? 44);
        const dir = el.dataset.revealDir ?? "y";
        const from: gsap.TweenVars = { opacity: 0, ease: "power3.out", duration: Number(el.dataset.revealDur ?? 1.1) };
        if (dir === "y") from.y = dist;
        else if (dir === "x") from.x = dist;
        else if (dir === "scale") { from.scale = Number(el.dataset.revealScale ?? 1.06); }
        else if (dir === "clip") { from.clipPath = "inset(0 0 100% 0)"; }
        gsap.fromTo(
          el,
          from,
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            clipPath: "inset(0 0 0% 0)",
            delay: Number(el.dataset.revealDelay ?? 0),
            scrollTrigger: { trigger: el, start: el.dataset.revealStart || "top 90%", once: true },
          },
        );
      });

      // count-up figures
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("en-US");
          },
        });
      });

      // scrubbed parallax
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 10);
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("[data-parallax-host]") || el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          },
        );
      });

      // horizontal drift
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        const amount = Number(el.dataset.drift || 8);
        gsap.fromTo(
          el,
          { xPercent: -amount },
          {
            xPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1.4 },
          },
        );
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/** Split a string into mask-revealed words. Wrap a word in *asterisks* for italic accent. */
export function Words({
  children,
  className = "",
  delay = 0,
  start = "top 92%",
  Tag = "span",
}: {
  children: string;
  className?: string;
  delay?: number;
  start?: string;
  Tag?: ElementType;
}) {
  const parts = children.split(" ");
  const H = Tag;
  return (
    <H className={className} data-words="" data-words-delay={delay} data-words-start={start}>
      {parts.map((raw, i) => {
        const accent = raw.startsWith("*") && raw.endsWith("*");
        const word = accent ? raw.slice(1, -1) : raw;
        return (
          <span key={i}>
            <span className="wm">
              <span className={`w-i ${accent ? "display-it text-accentink" : ""}`}>{word}</span>
            </span>
            {i < parts.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </H>
  );
}

/** Simple mount-in timeline for hero elements. */
export function useHeroTimeline(build: (tl: gsap.core.Timeline) => void, deps: unknown[] = []) {
  useEffect(() => {
    if (reduced()) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.25 });
    build(tl);
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: reduced() ? "auto" : "smooth" });
}


