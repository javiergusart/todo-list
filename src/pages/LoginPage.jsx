import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import styles from "../styles/ui.module.css";

function getRedirectTarget(locationState) {
  const from = locationState?.from;

  if (!from?.pathname) {
    return "/todos";
  }

  return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
}

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  const redirectTarget = getRedirectTarget(location.state);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setAuthError("Enter your email and password.");
      return;
    }

    setIsLoggingOn(true);

    const result = await login(normalizedEmail, password);

    if (result.success) {
      setEmail("");
      setPassword("");
      setIsLoggingOn(false);
      return;
    }

    setAuthError(result.error);
    setIsLoggingOn(false);
  }

  return (
    <section className={`${styles.pageSection} ${styles.authCard}`}>
      <div className={styles.heroCard}>
        <h2 className={styles.sectionTitle}>Log On</h2>
        <p className={styles.pageText}>
          Sign in to view your protected routes and manage your tasks.
        </p>
      </div>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        {authError ? (
          <div className={`${styles.statusMessage} ${styles.errorMessage}`}>
            <p role="alert">{authError}</p>
          </div>
        ) : null}
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={120}
          autoComplete="email"
        />
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          maxLength={120}
          autoComplete="current-password"
        />
        <button
          className={`${styles.button} ${styles.primaryButton}`}
          type="submit"
          disabled={isLoggingOn}
        >
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
