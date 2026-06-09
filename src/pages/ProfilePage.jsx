import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

const initialStats = {
  total: 0,
  completed: 0,
  active: 0,
};

function ProfilePage() {
  const { email, token } = useAuth();
  const [todoStats, setTodoStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        const todos = data.tasks ?? data;
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (fetchError) {
        setError(`Error loading statistics: ${fetchError.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionRate = todoStats.total
    ? Math.round((todoStats.completed / todoStats.total) * 100)
    : 0;

  return (
    <section>
      <h2>Profile</h2>
      <p>Name: {email || "Current user"}</p>
      <p>Status: Authenticated</p>

      <section>
        <h3>Todo Statistics</h3>
        {isLoading ? <p>Loading statistics...</p> : null}
        {error ? <p role="alert">{error}</p> : null}
        {!isLoading && !error ? (
          <div>
            <p>Total todos: {todoStats.total}</p>
            <p>Completed todos: {todoStats.completed}</p>
            <p>Active todos: {todoStats.active}</p>
            <p>Completion rate: {completionRate}%</p>
          </div>
        ) : null}
      </section>
    </section>
  );
}

export default ProfilePage;
