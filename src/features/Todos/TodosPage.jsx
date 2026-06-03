import { useCallback, useEffect, useState } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";
import SortBy from "../../shared/SortBy.jsx";
import FilterInput from "../../shared/FilterInput.jsx";
import useDebounce from "../../utils/useDebounce.js";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterTerm, setFilterTerm] = useState("");
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      setError("");
      setIsTodoListLoading(true);

      try {
        const options = {
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        };

        const paramsObject = {
          sortBy,
          sortDirection,
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Unable to fetch todos.");
        }

        const data = await response.json();
        setTodoList(data.tasks ?? []);
        setFilterError("");
      } catch (fetchError) {
        if (
          debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection !== "desc"
        ) {
          setFilterError(
            `Error filtering/sorting todos: ${fetchError.message}`,
          );
        } else {
          setError(`Error fetching todos: ${fetchError.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

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
      invalidateCache();
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
      invalidateCache();
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
      invalidateCache();
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
      {filterError ? (
        <div>
          <p>{filterError}</p>
          <button type="button" onClick={() => setFilterError("")}>
            Clear Filter Error
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTerm("");
              setSortBy("creationDate");
              setSortDirection("desc");
              setFilterError("");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : null}
      {isTodoListLoading ? <p>Loading todos...</p> : null}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </section>
  );
}

export default TodosPage;
