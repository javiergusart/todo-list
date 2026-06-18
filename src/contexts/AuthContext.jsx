import { useEffect, useState } from "react";
import AuthContext from "./authContext.js";
const AUTH_STORAGE_KEY = "tdl-auth";

function readStoredAuth() {
  const fallbackAuth = { email: "", token: "" };

  if (typeof window === "undefined") {
    return fallbackAuth;
  }

  try {
    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
      return fallbackAuth;
    }

    const parsedAuth = JSON.parse(storedAuth);

    return {
      email: parsedAuth.email ?? "",
      token: parsedAuth.token ?? "",
    };
  } catch {
    return fallbackAuth;
  }
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(() => readStoredAuth().email);
  const [token, setToken] = useState(() => readStoredAuth().token);

  useEffect(() => {
    if (token || email) {
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ email, token }),
      );
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [email, token]);

  async function login(userEmail, password) {
    try {
      const response = await fetch("/api/users/logon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userEmail, password }),
      });
      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      }

      return {
        success: false,
        error: "Unable to sign in with those credentials.",
      };
    } catch {
      return {
        success: false,
        error: "Unable to sign in right now. Please try again.",
      };
    }
  }

  async function logout() {
    const clearAuthState = () => {
      setEmail("");
      setToken("");
    };

    if (!token) {
      clearAuthState();
      return { success: true };
    }

    try {
      const response = await fetch("/api/users/logoff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        await response.json();
      }

      clearAuthState();

      if (!response.ok) {
        return {
          success: false,
          error: "Unable to log out right now. Please try again.",
        };
      }

      return { success: true };
    } catch {
      clearAuthState();
      return {
        success: false,
        error: "Unable to log out right now. Please try again.",
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
