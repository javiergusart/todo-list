import { Link } from "react-router";
import styles from "../styles/ui.module.css";

function NotFoundPage() {
  return (
    <section className={`${styles.pageSection} ${styles.sectionStack}`}>
      <h2 className={styles.sectionTitle}>Page Not Found</h2>
      <p className={styles.pageText}>The page you requested does not exist.</p>
      <div className={styles.buttonRow}>
        <Link
          className={`${styles.button} ${styles.primaryButton}`}
          to="/login"
        >
          Go to Login
        </Link>
        <Link
          className={`${styles.button} ${styles.secondaryButton}`}
          to="/about"
        >
          About
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
