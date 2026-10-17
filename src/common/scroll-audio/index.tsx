"use client";

import { useEffect, useRef } from "react";

const FADE_DURATION = 250;
const AUDIO_URL = "/WE%20ON%20GO.mp3";

export default function ScrollAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    let fadeFrame = 0;
    let playRequested = false;
    let isScrolling = false;
    let fadeTarget: number | null = null;
    let autoplayWarningShown = false;
    const abortController = new AbortController();
    let audioObjectUrl: string | undefined;
    let isAudioReady = false;

    const root = document.documentElement;
    delete root.dataset.scrollAudioReady;
    delete root.dataset.scrollAudioFailed;

    const signalAudioReady = (failed = false) => {
      isAudioReady = !failed;
      root.dataset.scrollAudioReady = String(!failed);
      root.dataset.scrollAudioFailed = String(failed);
      window.dispatchEvent(new Event("scroll-audio-ready"));
    };

    const handleAudioCanPlay = () => {
      signalAudioReady();
      if (isScrolling) {
        requestPlayback();
      }
    };
    const handleAudioError = () => {
      console.error("Unable to load scroll audio.", audio.error);
      signalAudioReady(true);
    };

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
      if (!isAudioReady || !audio.paused || playRequested) {
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

    const handleLenisScrollState = (event: Event) => {
      const { isScrolling: lenisIsScrolling } = (
        event as CustomEvent<{ isScrolling: boolean }>
      ).detail;

      if (lenisIsScrolling) {
        isScrolling = true;
        requestPlayback();
        fadeTo(1, false);
        return;
      }

      isScrolling = false;
      fadeTo(0, true);
    };

    audio.volume = 0;
    audio.addEventListener("canplay", handleAudioCanPlay, { once: true });
    audio.addEventListener("error", handleAudioError, { once: true });
    window.addEventListener("lenis-scroll-state", handleLenisScrollState);

    void (async () => {
      try {
        const response = await fetch(AUDIO_URL, {
          signal: abortController.signal,
          cache: "force-cache",
        });
        if (!response.ok) {
          throw new Error(
            `Audio request failed with status ${response.status}`,
          );
        }

        const audioBlob = await response.blob();
        audioObjectUrl = URL.createObjectURL(audioBlob);
        audio.src = audioObjectUrl;
        audio.load();
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        console.error("Unable to download scroll audio.", error);
        signalAudioReady(true);
      }
    })();

    return () => {
      abortController.abort();
      window.removeEventListener("lenis-scroll-state", handleLenisScrollState);
      audio.removeEventListener("canplay", handleAudioCanPlay);
      audio.removeEventListener("error", handleAudioError);

      cancelAnimationFrame(fadeFrame);
      audio.pause();
      if (audioObjectUrl) {
        URL.revokeObjectURL(audioObjectUrl);
      }
      delete root.dataset.scrollAudioReady;
      delete root.dataset.scrollAudioFailed;
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      preload="none"
      aria-hidden="true"
    />
  );
}
