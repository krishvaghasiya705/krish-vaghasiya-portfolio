"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./customcursor.module.scss";

export default function Customcursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reducedMotion ? 0 : 0.55;

    gsap.set(cursor, { autoAlpha: 0 });

    const moveX = gsap.quickTo(cursor, "x", {
      duration,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(cursor, "y", {
      duration,
      ease: "power3.out",
    });
    let hasMoved = false;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const x = event.clientX + 16;
      const y = event.clientY + 18;

      if (!hasMoved) {
        gsap.set(cursor, { x, y, autoAlpha: 1 });
        hasMoved = true;
        return;
      }

      moveX(x);
      moveY(y);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      gsap.killTweensOf(cursor);
    };
  }, []);

  return (
    <div className={styles.customcursormain} aria-hidden="true">
      <div ref={cursorRef} className={styles.customcursor} />
    </div>
  );
}
