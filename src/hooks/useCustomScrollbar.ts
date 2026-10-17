"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import { scrollPageToLenis } from "@/hooks/useLenis";

type ScrollbarMetrics = {
  scrollTop: number;
  maxScroll: number;
  thumbSize: number;
  trackSize: number;
};

type DragState = {
  pointerId: number;
  offsetY: number;
};

const initialMetrics: ScrollbarMetrics = {
  scrollTop: 0,
  maxScroll: 0,
  thumbSize: 0,
  trackSize: 0,
};

export function useCustomScrollbar(
  targetRef?: RefObject<HTMLElement | null>,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [metrics, setMetrics] = useState(initialMetrics);

  const updateMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const target = targetRef?.current;
    const viewportSize = target ? target.clientHeight : window.innerHeight;
    const contentSize = target
      ? target.scrollHeight
      : Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        );
    const trackSize = track.clientHeight;
    const maxScroll = Math.max(contentSize - viewportSize, 0);
    const thumbSize =
      contentSize > 0
        ? Math.min(trackSize, Math.max(32, (trackSize * viewportSize) / contentSize))
        : trackSize;
    const scrollTop = target ? target.scrollTop : window.scrollY;

    setMetrics({ scrollTop, maxScroll, thumbSize, trackSize });
  }, [targetRef]);

  const scrollTo = useCallback(
    (scrollTop: number, immediate = false) => {
      const target = targetRef?.current;
      if (target) {
        target.scrollTo({
          top: scrollTop,
          behavior: immediate ? "instant" : "smooth",
        });
        return;
      }

      if (!scrollPageToLenis(scrollTop, immediate)) {
        window.scrollTo(0, scrollTop);
      }
    },
    [targetRef],
  );

  useEffect(() => {
    const target = targetRef?.current;
    const update = () => updateMetrics();
    const resizeObserver = new ResizeObserver(update);

    if (target) {
      target.addEventListener("scroll", update, { passive: true });
      resizeObserver.observe(target);
    } else {
      window.addEventListener("scroll", update, { passive: true });
      resizeObserver.observe(document.documentElement);
      resizeObserver.observe(document.body);
    }

    const track = trackRef.current;
    if (track) {
      resizeObserver.observe(track);
    }

    window.addEventListener("resize", update);
    update();

    return () => {
      if (target) {
        target.removeEventListener("scroll", update);
      } else {
        window.removeEventListener("scroll", update);
      }
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, [targetRef, updateMetrics]);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track || metrics.maxScroll <= 0) {
        return;
      }

      event.preventDefault();
      const trackRect = track.getBoundingClientRect();
      const thumbTop =
        (metrics.scrollTop / metrics.maxScroll) *
        Math.max(metrics.trackSize - metrics.thumbSize, 0);
      const isThumb =
        event.clientY >= trackRect.top + thumbTop &&
        event.clientY <= trackRect.top + thumbTop + metrics.thumbSize;
      const offsetY = isThumb
        ? event.clientY - (trackRect.top + thumbTop)
        : metrics.thumbSize / 2;

      dragRef.current = { pointerId: event.pointerId, offsetY };
      track.setPointerCapture(event.pointerId);

      if (!isThumb) {
        const nextThumbTop = event.clientY - trackRect.top - offsetY;
        const thumbTravel = Math.max(metrics.trackSize - metrics.thumbSize, 0);
        if (thumbTravel > 0) {
          scrollTo((nextThumbTop / thumbTravel) * metrics.maxScroll);
        }
      }
    },
    [metrics, scrollTo],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const track = trackRef.current;
      if (!drag || drag.pointerId !== event.pointerId || !track) {
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const thumbTravel = Math.max(metrics.trackSize - metrics.thumbSize, 0);
      if (thumbTravel === 0) {
        return;
      }

      const nextThumbTop = Math.min(
        thumbTravel,
        Math.max(0, event.clientY - trackRect.top - drag.offsetY),
      );
      scrollTo((nextThumbTop / thumbTravel) * metrics.maxScroll, true);
    },
    [metrics, scrollTo],
  );

  const onPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = targetRef?.current;
      const viewportSize = target ? target.clientHeight : window.innerHeight;
      let nextScrollTop: number | undefined;

      switch (event.key) {
        case "ArrowDown":
          nextScrollTop = metrics.scrollTop + 40;
          break;
        case "ArrowUp":
          nextScrollTop = metrics.scrollTop - 40;
          break;
        case "PageDown":
          nextScrollTop = metrics.scrollTop + viewportSize;
          break;
        case "PageUp":
          nextScrollTop = metrics.scrollTop - viewportSize;
          break;
        case "Home":
          nextScrollTop = 0;
          break;
        case "End":
          nextScrollTop = metrics.maxScroll;
          break;
      }

      if (nextScrollTop !== undefined) {
        event.preventDefault();
        scrollTo(Math.min(metrics.maxScroll, Math.max(0, nextScrollTop)));
      }
    },
    [metrics, scrollTo, targetRef],
  );

  const thumbTravel = Math.max(metrics.trackSize - metrics.thumbSize, 0);
  const thumbTop =
    metrics.maxScroll > 0
      ? (metrics.scrollTop / metrics.maxScroll) * thumbTravel
      : 0;

  return {
    trackRef,
    isScrollable: metrics.maxScroll > 0,
    thumbStyle: {
      height: `${metrics.thumbSize}px`,
      transform: `translateY(${thumbTop}px)`,
    },
    valueNow:
      metrics.maxScroll > 0
        ? Math.round((metrics.scrollTop / metrics.maxScroll) * 100)
        : 0,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onKeyDown,
  };
}
