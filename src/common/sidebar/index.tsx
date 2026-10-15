"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./sidebar.module.scss";
import Link from "next/link";
import Gmailicon from "../../../public/assets/icons/gmailicon";
import Linkedinicon from "../../../public/assets/icons/linkedinicon";
import Instagramicon from "../../../public/assets/icons/instagramicon";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const textRef = useRef<HTMLElement>(null);
  const hasInitialized = useRef(false);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    const sidebar = textRef.current;

    if (!sidebar) {
      return;
    }

    const text = sidebar.querySelectorAll<HTMLElement>(
      `.${styles.flxitem} p, .${styles.flxitem} a, .${styles.schedulecall}`,
    );

    if (!hasInitialized.current) {
      hasInitialized.current = true;

      if (!isOpen) {
        gsap.set(text, { opacity: 0, y: -5 });
        return;
      }
    }

    if (isOpen) {
      const tween = gsap.fromTo(
        text,
        { opacity: 0, y: -5 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          delay: 0.58,
          stagger: 0.04,
          ease: "power2.out",
        },
      );

      return () => {
        tween.kill();
      };
    }

    const tween = gsap.to(text, {
      opacity: 0,
      y: -5,
      duration: 0.12,
      stagger: 0.015,
      ease: "power1.in",
    });

    return () => {
      tween.kill();
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`${styles.clickoutside} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={textRef}
        className={`${styles.sidebarmain} ${isOpen ? styles.open : ""}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className={styles.sidebartop}>
          <div className={styles.flxitem}>
            <p>Work</p>
            <div className={styles.worklink}>
              <Link href={"/"} onClick={onClose}>
                <span>Work 1</span>
              </Link>
            </div>
            <div className={styles.worklink}>
              <Link href={"/"} onClick={onClose}>
                <span>Work 2</span>
              </Link>
            </div>
            <div className={styles.worklink}>
              <Link href={"/"} onClick={onClose}>
                <span>Work 3</span>
              </Link>
            </div>
            <div className={styles.worklink}>
              <Link href={"/"} onClick={onClose}>
                <span>Work 4</span>
              </Link>
            </div>
            <div className={styles.worklink}>
              <Link href={"/"} onClick={onClose}>
                <span>Work 5</span>
              </Link>
            </div>
          </div>
          <div className={styles.flxitem}>
            <p>About</p>
            <div className={styles.worklink}>
              <Link href={"/"} onClick={onClose}>
                <span>Professional</span>
              </Link>
            </div>
            <div className={styles.worklink}>
              <Link href={"/"} onClick={onClose}>
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.sidebarbottom}>
          <a
            href="https://calendly.com/krishvaghasiya/discovery-call"
            target="_blank"
            className={styles.schedulecall}
            onClick={onClose}
          >
            Schedule a call
          </a>

          <div className={styles.socialLinks}>
            <a
              href={"mailto:kvaghasiya705@gmail.com"}
              target="_blank"
              onClick={onClose}
            >
              <Gmailicon />
            </a>
            <a href={"/"} target="_blank" onClick={onClose}>
              <Linkedinicon />
            </a>
            <a href={"/"} target="_blank" onClick={onClose}>
              <Instagramicon />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
