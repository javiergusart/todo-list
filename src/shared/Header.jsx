import { useAuth } from "../hooks/useAuth.js";
import Logoff from "../features/Logoff.jsx";
import styles from "../styles/ui.module.css";
import Navigation from "./Navigation.jsx";

function Header() {
  const { email, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>Portfolio Project</p>
          <h1 className={styles.title}>My Todos</h1>
          <p className={styles.lead}>
            A polished React task manager with authentication and filters.
          </p>
        </div>
        <div className={styles.headerMeta}>
          <Navigation />
          {isAuthenticated ? (
            <p className={styles.signedInText}>
              Signed in as {email || "current user"}
            </p>
          ) : null}
          {isAuthenticated ? <Logoff /> : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
