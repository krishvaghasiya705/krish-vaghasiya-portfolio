"use client";

import { useEffect, useRef } from "react";

const SCROLL_IDLE_DELAY = 180;
const FADE_DURATION = 250;

export default function ScrollAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    let idleTimer: number | undefined;
    let fadeFrame = 0;
    let playRequested = false;
    let isScrolling = false;
    let fadeTarget: number | null = null;
    let autoplayWarningShown = false;

    const fadeTo = (targetVolume: number, pauseWhenDone: boolean) => {
      if (
        fadeTarget === targetVolume ||
        (fadeFrame === 0 && audio.volume === targetVolume)
      ) {
        return;
      }

      cancelAnimationFrame(fadeFrame);
      fadeTarget = targetVolume;

      const startVolume = audio.volume;
      const startTime = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - startTime) / FADE_DURATION, 1);
        const easedProgress = progress * progress * (3 - 2 * progress);
        audio.volume =
          startVolume + (targetVolume - startVolume) * easedProgress;

        if (progress < 1) {
          fadeFrame = requestAnimationFrame(animate);
        } else if (pauseWhenDone) {
          fadeFrame = 0;
          fadeTarget = null;
          audio.pause();
        } else {
          fadeFrame = 0;
          fadeTarget = null;
        }
      };

      fadeFrame = requestAnimationFrame(animate);
    };

    const requestPlayback = () => {
      if (!audio.paused || playRequested) {
        return;
      }

      playRequested = true;
      audio.play().then(
        () => {
          playRequested = false;
          if (!isScrolling) {
            audio.pause();
          }
        },
        (error: unknown) => {
          playRequested = false;

          if (
            error instanceof DOMException &&
            error.name === "NotAllowedError"
          ) {
            if (!autoplayWarningShown) {
              console.warn(
                "The browser blocked scroll audio playback. Unmuted audio can only start after a user gesture.",
              );
              autoplayWarningShown = true;
            }
            return;
          }

          console.error("Unable to play scroll audio.", error);
        },
      );
    };

    const schedulePause = () => {
      if (idleTimer !== undefined) {
        window.clearTimeout(idleTimer);
      }

      idleTimer = window.setTimeout(() => {
        isScrolling = false;
        fadeTo(0, true);
      }, SCROLL_IDLE_DELAY);
    };

    const handleScroll = () => {
      isScrolling = true;
      requestPlayback();
      fadeTo(1, false);
      schedulePause();
    };

    const handleScrollIntent = () => {
      isScrolling = true;
      requestPlayback();
      schedulePause();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest('[role="scrollbar"]')
      ) {
        handleScrollIntent();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      ) {
        handleScrollIntent();
      }
    };

    audio.volume = 0;
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScrollIntent, { passive: true });
    window.addEventListener("touchmove", handleScrollIntent, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScrollIntent);
      window.removeEventListener("touchmove", handleScrollIntent);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);

      if (idleTimer !== undefined) {
        window.clearTimeout(idleTimer);
      }
      cancelAnimationFrame(fadeFrame);
      audio.pause();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/WE%20ON%20GO.mp3"
      loop
      preload="metadata"
      aria-hidden="true"
    />
  );
}
