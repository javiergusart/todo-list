import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

function Logon() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setIsLoggingOn(true);

    const result = await login(email, password);

    if (result.success) {
      setPassword("");
    } else {
      setAuthError(result.error);
    }

    if (!result.success) {
      setIsLoggingOn(false);
      return;
    }

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

export default Logon;
