"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function useGsap(
  effect: (context: gsap.Context) => void | (() => void),
  dependencies: React.DependencyList = []
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      effect(ctx);
    }, containerRef);

    return () => ctx.revert();
  }, dependencies);

  return containerRef;
}
