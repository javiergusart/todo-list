import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

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
    setIsLoggingOn(true);

    const result = await login(email, password);

    if (result.success) {
      setPassword("");
      setIsLoggingOn(false);
      return;
    }

    setAuthError(result.error);
    setIsLoggingOn(false);
  }

  return (
    <section>
      <h2>Log On</h2>
      <form onSubmit={handleSubmit}>
        {authError ? <p role="alert">{authError}</p> : null}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={isLoggingOn}>
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
