"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./loadingscreen.module.scss";

const PAGE_READY_TIMEOUT_MS = 2000;

const waitForScrollAudio = () => {
  const root = document.documentElement;

  if (
    root.dataset.scrollAudioReady === "true" ||
    root.dataset.scrollAudioFailed === "true"
  ) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const handleAudioReady = () => {
      window.removeEventListener("scroll-audio-ready", handleAudioReady);
      resolve();
    };

    window.addEventListener("scroll-audio-ready", handleAudioReady, {
      once: true,
    });

    if (
      root.dataset.scrollAudioReady === "true" ||
      root.dataset.scrollAudioFailed === "true"
    ) {
      handleAudioReady();
    }
  });
};

const waitForPageReady = async () => {
  if (typeof window === "undefined") return;

  const pendingImages = Array.from(document.images).filter(
    (image) => image.loading !== "lazy" && !image.complete,
  );
  let timeoutId: number | undefined;

  try {
    await Promise.race([
      (async () => {
        await Promise.allSettled(pendingImages.map((image) => image.decode()));
        await document.fonts.ready;
      })(),
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(resolve, PAGE_READY_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
};

export function Loadingscreen() {
  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);

  useLayoutEffect(() => {
    if (initializedRef.current || typeof window === "undefined") {
      return;
    }

    initializedRef.current = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;

    body.style.overflow = "hidden";

    const runLoader = async () => {
      try {
        await waitForPageReady();
        await waitForScrollAudio();
      } catch (error) {
        console.warn("Preloader wait failed, continuing reveal.", error);
      } finally {
        const preloader = preloaderRef.current;

        if (!preloader) {
          setIsVisible(false);
          body.style.overflow = "";
          return;
        }

        if (reduceMotion) {
          setIsVisible(false);
          body.style.overflow = "";
          return;
        }

        const timeline = gsap.timeline({
          onComplete: () => {
            setIsVisible(false);
            body.style.overflow = "";
            gsap.set(preloader, { clearProps: "all" });
          },
        });

        timeline.to(preloader, {
          height: 0,
          borderRadius: "0 0 50% 50%",
          duration: 1.4,
          ease: "power4.inOut",
          transformOrigin: "center top",
        });
      }
    };

    runLoader();

    return () => {
      body.style.overflow = "";
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return <div ref={preloaderRef} className={styles.preloader} aria-busy="true" aria-live="polite" />;
}
