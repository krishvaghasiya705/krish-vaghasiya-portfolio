import React from "react";
import styles from "./header.module.scss";
import Link from "next/link";
import Image from "next/image";
import passportsize from "../../../public/assets/images/passport-size.png";
import Menuicon from "../../../public/assets/icons/menuicon";
import Menucloseicon from "../../../public/assets/icons/menucloseicon";
import Sidebar from "../sidebar";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className="headerContainer">
          <div className={styles.headerflx}>
            <div className={styles.headerlogomain}>
              <div className={styles.headerimg}>
                <Image src={passportsize} alt="Krish Vaghasiya" />
              </div>
              <Link href="/">Krish Vaghasiya</Link>
            </div>
            <div className={styles.headermenumain}>
              <div className={styles.headermenuicon}>
                <div className={styles.headermenuiconopen}>
                  <Menuicon />
                </div>
                <div className={styles.headermenuiconclose}>
                  <Menucloseicon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar />
    </>
  );
}
