import { useEffect, useState } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setError("");
      setIsTodoListLoading(true);

      try {
        const response = await fetch("/api/tasks", {
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Unable to fetch todos.");
        }

        const data = await response.json();
        setTodoList(data.tasks ?? []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token]);

  async function addTodo(todoTitle) {
    setError("");

    const temporaryTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    setTodoList((previousTodoList) => [temporaryTodo, ...previousTodoList]);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: temporaryTodo.title,
          isCompleted: temporaryTodo.isCompleted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to add todo.");
      }

      const savedTodo = data.task ?? data;
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === temporaryTodo.id ? savedTodo : todo,
        ),
      );
    } catch (addError) {
      setTodoList((previousTodoList) =>
        previousTodoList.filter((todo) => todo.id !== temporaryTodo.id),
      );
      setError(addError.message);
    }
  }

  async function completeTodo(id) {
    setError("");

    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    const completedTodo = { ...originalTodo, isCompleted: true };

    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) => (todo.id === id ? completedTodo : todo)),
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          isCompleted: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to complete todo.");
      }

      const savedTodo = data.task ?? data;
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) => (todo.id === id ? savedTodo : todo)),
      );
    } catch (completeError) {
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) => (todo.id === id ? originalTodo : todo)),
      );
      setError(completeError.message);
    }
  }

  async function updateTodo(editedTodo) {
    setError("");

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    if (!originalTodo) {
      return;
    }

    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === editedTodo.id ? editedTodo : todo,
      ),
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to update todo.");
      }

      const savedTodo = data.task ?? data;
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === editedTodo.id ? savedTodo : todo,
        ),
      );
    } catch (updateError) {
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo,
        ),
      );
      setError(updateError.message);
    }
  }

  return (
    <section>
      {error ? (
        <div>
          <p role="alert">{error}</p>
          <button type="button" onClick={() => setError("")}>
            Clear Error
          </button>
        </div>
      ) : null}
      {isTodoListLoading ? <p>Loading todos...</p> : null}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </section>
  );
}

export default TodosPage;
