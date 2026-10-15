import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.hero}>
        <p className={styles.kicker}>Portfolio</p>
        <h1>Krish Vaghasiya</h1>
        <p className={styles.tagline}>
          Web designer and developer crafting refined digital experiences with a
          cinematic eye for detail.
        </p>
        <div className={styles.meta}>
          <span>UI/UX</span>
          <span>Web Design</span>
          <span>Front-End</span>
        </div>
      </main>
    </div>
  );
}
