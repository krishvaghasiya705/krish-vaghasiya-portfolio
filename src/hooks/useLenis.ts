"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    let previousScroll = lenis.scroll;
    const removeScrollListener = lenis.on("scroll", (instance) => {
      const hasMoved = instance.scroll !== previousScroll;
      previousScroll = instance.scroll;

      window.dispatchEvent(
        new CustomEvent("lenis-scroll-state", {
          detail: {
            isScrolling: Boolean(instance.isScrolling) && hasMoved,
          },
        }),
      );
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    let rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      removeScrollListener();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
