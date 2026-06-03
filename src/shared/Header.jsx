import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

function Header() {
  const { email, isAuthenticated, logout } = useAuth();
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogOut() {
    setLogoutError("");
    setIsLoggingOut(true);

    const result = await logout();

    if (!result.success) {
      setLogoutError(result.error);
    }

    setIsLoggingOut(false);
  }

  return (
    <header>
      <h1>Todo List</h1>
      {logoutError ? <p role="alert">{logoutError}</p> : null}
      {isAuthenticated ? (
        <div>
          <p>Signed in as {email || "current user"}</p>
          <button type="button" onClick={handleLogOut} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
