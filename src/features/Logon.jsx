import { useState } from "react";

function Logon({ onSetEmail = () => {}, onSetToken = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setIsLoggingOn(true);

    try {
      const response = await fetch("/api/users/logon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        onSetEmail(data.name);
        onSetToken(data.csrfToken);
        setPassword("");
        return;
      }

      setAuthError(
        `Authentication failed: ${data?.message ?? "Unknown error"}`,
      );
    } catch (error) {
      setAuthError(`Error: ${error.name} | ${error.message}`);
    } finally {
      setIsLoggingOn(false);
    }
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
