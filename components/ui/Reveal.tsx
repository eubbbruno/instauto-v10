"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// useLayoutEffect no cliente (evita flash), useEffect no SSR
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** anima os filhos diretos em sequência (stagger) — estilo Apple/Linear */
  stagger?: number;
};

/**
 * Scroll-reveal premium com GSAP + ScrollTrigger.
 * - Sem `stagger`: anima o bloco inteiro ao entrar na viewport.
 * - Com `stagger`: anima os filhos diretos em cascata.
 */
export function Reveal({ children, className, delay = 0, y = 28, stagger }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIso(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets: gsap.TweenTarget =
        stagger != null ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.9,
        ease: "power3.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, y, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
