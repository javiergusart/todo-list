import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import styles from "../styles/ui.module.css";

function getNavLinkClassName({ isActive }) {
  return isActive
    ? `${styles.navLink} ${styles.navLinkActive}`
    : styles.navLink;
}

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav aria-label="Primary navigation" className={styles.nav}>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/about" className={getNavLinkClassName}>
            About
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" className={getNavLinkClassName}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={getNavLinkClassName}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={getNavLinkClassName}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
