function AboutPage() {
  return (
    <section>
      <h2>About This App</h2>
      <p>
        This todo app helps you manage tasks, track completion, and practice
        authenticated client-side routing.
      </p>

      <section>
        <h3>Features</h3>
        <ul>
          <li>Create, edit, and complete todos.</li>
          <li>Filter todos by status, sorting, and text search.</li>
          <li>Protect account-specific pages behind authentication.</li>
        </ul>
      </section>

      <section>
        <h3>Technologies</h3>
        <ul>
          <li>React 19 for UI rendering.</li>
          <li>React Router 7 for navigation and route protection.</li>
          <li>Vite for local development and production builds.</li>
        </ul>
      </section>
    </section>
  );
}

export default AboutPage;
