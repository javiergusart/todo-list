import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import styles from "../styles/ui.module.css";

const initialStats = {
  total: 0,
  completed: 0,
  active: 0,
};

function ProfilePage() {
  const { email, token } = useAuth();
  const [todoStats, setTodoStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (response.status === 404) {
          setTodoStats(initialStats);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        const todos = data.tasks ?? data;
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch {
        setError(
          "We could not load your statistics right now. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionRate = todoStats.total
    ? Math.round((todoStats.completed / todoStats.total) * 100)
    : 0;

  return (
    <section className={`${styles.pageSection} ${styles.sectionStack}`}>
      <div className={styles.heroCard}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <p className={styles.pageText}>
          Signed in as {email || "Current user"}
        </p>
        <p className={styles.pageText}>Status: Authenticated</p>
      </div>

      <section className={styles.sectionStack}>
        <h3 className={styles.subsectionTitle}>Todo Statistics</h3>
        {isLoading ? (
          <div className={`${styles.statusMessage} ${styles.infoMessage}`}>
            <p>Loading statistics...</p>
          </div>
        ) : null}
        {error ? (
          <div className={`${styles.statusMessage} ${styles.errorMessage}`}>
            <p role="alert">{error}</p>
          </div>
        ) : null}
        {!isLoading && !error ? (
          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Total todos</p>
              <p className={styles.statValue}>{todoStats.total}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Completed</p>
              <p className={styles.statValue}>{todoStats.completed}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Active</p>
              <p className={styles.statValue}>{todoStats.active}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Completion rate</p>
              <p className={styles.statValue}>{completionRate}%</p>
            </div>
          </div>
        ) : null}
      </section>
    </section>
  );
}

export default ProfilePage;
