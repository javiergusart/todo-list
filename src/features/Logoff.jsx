import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import styles from "../styles/ui.module.css";

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoggingOff, setIsLoggingOff] = useState(false);

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError("");

    const result = await logout();

    if (result.success) {
      navigate("/login", { replace: true });
      return;
    }

    setError(result.error);
    setIsLoggingOff(false);
  }

  return (
    <>
      {error ? (
        <div className={`${styles.statusMessage} ${styles.errorMessage}`}>
          <p role="alert">{error}</p>
        </div>
      ) : null}
      <button
        className={`${styles.button} ${styles.secondaryButton}`}
        type="button"
        onClick={handleLogoff}
        disabled={isLoggingOff}
      >
        {isLoggingOff ? "Logging out..." : "Log Out"}
      </button>
    </>
  );
}

export default Logoff;
