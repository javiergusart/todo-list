import { useAuth } from "../hooks/useAuth.js";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";

function Header() {
  const { email, isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>
      <Navigation />
      {isAuthenticated ? (
        <div>
          <p>Signed in as {email || "current user"}</p>
          <Logoff />
        </div>
      ) : null}
    </header>
  );
}

export default Header;
