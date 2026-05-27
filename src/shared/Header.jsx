function Header({ email, token, onSetEmail, onSetToken }) {
  function handleLogOut() {
    onSetEmail("");
    onSetToken("");
  }

  return (
    <header>
      <h1>Todo List</h1>
      {token ? (
        <div>
          <p>Signed in as {email || "current user"}</p>
          <button type="button" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      ) : null}
    </header>
  );
}

export default Header;