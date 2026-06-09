import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section>
      <h2>Page Not Found</h2>
      <p>The page you requested does not exist.</p>
      <nav>
        <ul>
          <li>
            <Link to="/">Go Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default NotFoundPage;
