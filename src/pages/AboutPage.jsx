import styles from "../styles/ui.module.css";

function AboutPage() {
  return (
    <section className={`${styles.pageSection} ${styles.sectionStack}`}>
      <div className={styles.heroCard}>
        <h2 className={styles.sectionTitle}>About This App</h2>
        <p className={styles.pageText}>
          This todo app helps you manage tasks, track completion, and practice
          authenticated client-side routing.
        </p>
      </div>

      <section className={styles.contentGrid}>
        <div className={styles.detailCard}>
          <h3 className={styles.subsectionTitle}>Features</h3>
          <ul className={styles.featureList}>
            <li>Create, edit, and complete todos.</li>
            <li>Filter todos by status, sorting, and text search.</li>
            <li>Protect account-specific pages behind authentication.</li>
          </ul>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.subsectionTitle}>Technologies</h3>
          <ul className={styles.featureList}>
            <li>React 19 for UI rendering.</li>
            <li>React Router 7 for navigation and route protection.</li>
            <li>Vite for local development and production builds.</li>
            <li>CSS Modules for scoped component styling.</li>
          </ul>
        </div>
      </section>
    </section>
  );
}

export default AboutPage;
