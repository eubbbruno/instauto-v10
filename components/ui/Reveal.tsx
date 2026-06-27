"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";

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
 * Scroll-reveal premium com GSAP via IntersectionObserver.
 * À prova de falhas: usa IO (recalcula layout nativamente), então conteúdo
 * NUNCA fica preso invisível mesmo que imagens carreguem depois.
 * Respeita prefers-reduced-motion (não esconde nada).
 */
export function Reveal({ children, className, delay = 0, y = 28, stagger }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIso(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // deixa visível, sem animação

    const targets: Element[] = stagger != null ? Array.from(el.children) : [el];
    if (targets.length === 0) return;

    gsap.set(targets, { opacity: 0, y });

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              delay,
              stagger: stagger ?? 0,
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      gsap.set(targets, { clearProps: "all" });
    };
  }, [delay, y, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
