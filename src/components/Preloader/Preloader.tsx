"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./preloader.module.scss";

const waitForPageReady = async () => {
  if (typeof window === "undefined") return;

  const images = Array.from(document.images);
  const imageTasks = images.map((image) => {
    if (image.complete && image.naturalWidth > 0) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const handleDone = () => resolve();
      image.addEventListener("load", handleDone, { once: true });
      image.addEventListener("error", handleDone, { once: true });
    });
  });

  await Promise.allSettled(imageTasks);

  if (document.fonts && "ready" in document.fonts) {
    await document.fonts.ready;
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
};

export function Preloader() {
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
