import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import styles from "../styles/ui.module.css";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todos", { replace: true });
      return;
    }

    navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <section className={styles.pageSection}>
      <p className={styles.redirectText}>Redirecting...</p>
    </section>
  );
}

export default HomePage;
