import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

function navLinkStyle({ isActive }) {
  return {
    fontWeight: isActive ? "700" : "400",
    textDecoration: isActive ? "underline" : "none",
  };
}

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav aria-label="Primary navigation">
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: "1rem",
          padding: 0,
        }}
      >
        <li>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" style={navLinkStyle}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" style={navLinkStyle}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" style={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
