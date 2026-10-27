"use client";

import React, { useState } from "react";
import styles from "./header.module.scss";
import Link from "next/link";
import Image from "next/image";
import passportsize from "../../../public/assets/images/krish-vaghasiya-profile.jpg";
import Menuicon from "../../../public/assets/icons/menuicon";
import Menucloseicon from "../../../public/assets/icons/menucloseicon";
import Sidebar from "../sidebar";
import { scrollPageToLenis } from "@/hooks/useLenis";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className="headerContainer">
          <div className={styles.headerflx}>
            <div className={styles.headerlogomain}>
              <div className={styles.headerimg}>
                <Image src={passportsize} alt="Krish Vaghasiya" />
              </div>
              <Link
                href="/"
                onClick={(event) => {
                  if (window.location.pathname !== "/") {
                    return;
                  }

                  event.preventDefault();
                  if (!scrollPageToLenis(0)) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                Krish Vaghasiya
              </Link>
            </div>
            <div className={styles.headermenumain}>
              <button
                type="button"
                className={`${styles.headermenuicon} ${isMenuOpen ? styles.active : ""}`}
                aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <div className={styles.headermenuiconopen}>
                  <Menuicon />
                </div>
                <div className={styles.headermenuiconclose}>
                  <Menucloseicon />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
