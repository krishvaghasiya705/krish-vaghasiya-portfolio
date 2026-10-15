"use client";

import type { RefObject } from "react";
import styles from "./customscrollbar.module.scss";
import { useCustomScrollbar } from "@/hooks/useCustomScrollbar";

type CustomScrollbarProps = {
  targetRef?: RefObject<HTMLElement | null>;
  placement?: "page" | "sidebar";
};

export default function CustomScrollbar({
  targetRef,
  placement = "page",
}: CustomScrollbarProps) {
  const {
    trackRef,
    isScrollable,
    thumbStyle,
    valueNow,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
  } = useCustomScrollbar(targetRef);

  return (
    <div
      className={`${styles.scrollbarmain} ${styles[placement]} ${
        isScrollable ? "" : styles.hidden
      }`}
      aria-hidden={!isScrollable}
    >
      <div className={styles.scrollbaroutline}>
        <div
          ref={trackRef}
          className={styles.scrollbarboxmain}
          role="scrollbar"
          aria-label={placement === "page" ? "Page scroll" : "Sidebar scroll"}
          aria-controls={
            placement === "page"
              ? "page-scroll-target"
              : "sidebar-scroll-content"
          }
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={valueNow}
          tabIndex={isScrollable ? 0 : -1}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onKeyDown={onKeyDown}
        >
          <div className={styles.scrollbarbox} style={thumbStyle} />
        </div>
      </div>
    </div>
  );
}
