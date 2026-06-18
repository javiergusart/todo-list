import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import styles from "../styles/ui.module.css";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { from: location },
      });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) {
    return (
      <section className={styles.pageSection}>
        <p className={styles.redirectText}>Redirecting to login...</p>
      </section>
    );
  }

  return children;
}

export default RequireAuth;
