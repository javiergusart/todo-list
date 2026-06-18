import { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router";
import TodoForm from "../features/Todos/TodoForm.jsx";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import { useAuth } from "../hooks/useAuth.js";
import {
  initialTodoState,
  todoReducer,
  TODO_ACTIONS,
} from "../reducers/todoReducer.js";
import FilterInput from "../shared/FilterInput.jsx";
import SortBy from "../shared/SortBy.jsx";
import StatusFilter from "../shared/StatusFilter.jsx";
import todoStyles from "../styles/todos.module.css";
import styles from "../styles/ui.module.css";
import useDebounce from "../utils/useDebounce.js";
import { prepareTodoTitle } from "../utils/todoValidation.js";

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
    filterError,
  } = state;
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const statusFilter = searchParams.get("status") || "all";

  useEffect(() => {
    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

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

        if (response.status === 404) {
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: { todos: [] },
          });
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to fetch todos.");
        }

        const data = await response.json();
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks ?? [] },
        });
      } catch {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            isFilterError:
              Boolean(debouncedFilterTerm) ||
              sortBy !== "creationDate" ||
              sortDirection !== "desc",
            message:
              Boolean(debouncedFilterTerm) ||
              sortBy !== "creationDate" ||
              sortDirection !== "desc"
                ? "We could not apply those filters. Adjust them and try again."
                : "We could not load your todos. Please try again.",
          },
        });
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  function handleFilterChange(newTerm) {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newTerm },
    });
  }

  async function addTodo(todoTitle) {
    const { sanitizedTitle, error: validationError } =
      prepareTodoTitle(todoTitle);

    if (validationError) {
      return;
    }

    const temporaryTodo = {
      id: Date.now(),
      title: sanitizedTitle,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { temporaryTodo },
    });

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
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          temporaryId: temporaryTodo.id,
          savedTodo,
        },
      });
    } catch (addError) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          message: addError.message,
          temporaryId: temporaryTodo.id,
        },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    const completedTodo = {
      ...originalTodo,
      isCompleted: !originalTodo.isCompleted,
    };

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { completedTodo },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          isCompleted: completedTodo.isCompleted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to complete todo.");
      }

      const savedTodo = data.task ?? data;
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: {
          todoId: id,
          savedTodo,
        },
      });
    } catch (completeError) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          message: completeError.message,
          originalTodo,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const { sanitizedTitle, error: validationError } = prepareTodoTitle(
      editedTodo.title,
    );

    if (validationError) {
      return;
    }

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo: { ...editedTodo, title: sanitizedTitle } },
    });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: sanitizedTitle,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to update todo.");
      }

      const savedTodo = data.task ?? data;
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: {
          todoId: editedTodo.id,
          savedTodo,
        },
      });
    } catch (updateError) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          message: updateError.message,
          originalTodo,
        },
      });
    }
  }

  async function deleteTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.DELETE_TODO_START,
      payload: { todoId: id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

      if (!response.ok) {
        let message = "Unable to delete todo.";
        const contentType = response.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
          const data = await response.json();
          message = data?.message ?? message;
        }

        throw new Error(message);
      }

      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_SUCCESS,
      });
    } catch (deleteError) {
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: {
          message: deleteError.message,
          originalTodo,
        },
      });
    }
  }

  return (
    <section className={`${styles.pageSection} ${todoStyles.todoSection}`}>
      <div className={styles.heroCard}>
        <h2 className={styles.sectionTitle}>Todos</h2>
        <p className={styles.pageText}>
          Add, edit, sort, and review tasks in one place. Click any task title
          to edit it, and use the checkbox to mark it complete or active.
        </p>
      </div>
      {error ? (
        <div className={`${styles.statusMessage} ${styles.errorMessage}`}>
          <p role="alert">{error}</p>
          <div className={styles.buttonRow}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              type="button"
              onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
            >
              Clear Error
            </button>
          </div>
        </div>
      ) : null}
      {filterError ? (
        <div className={`${styles.statusMessage} ${styles.warningMessage}`}>
          <p>{filterError}</p>
          <div className={styles.buttonRow}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              type="button"
              onClick={() =>
                dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })
              }
            >
              Clear Filter Error
            </button>
            <button
              className={`${styles.button} ${styles.ghostButton}`}
              type="button"
              onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : null}
      {isTodoListLoading ? (
        <div className={`${styles.statusMessage} ${styles.infoMessage}`}>
          <p>Loading todos...</p>
        </div>
      ) : null}
      <div className={`${styles.pageSection} ${styles.controlsCard}`}>
        <div className={styles.controlsGrid}>
          <SortBy
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={(newSortBy) =>
              dispatch({
                type: TODO_ACTIONS.SET_SORT,
                payload: {
                  sortBy: newSortBy,
                  sortDirection,
                },
              })
            }
            onSortDirectionChange={(newSortDirection) =>
              dispatch({
                type: TODO_ACTIONS.SET_SORT,
                payload: {
                  sortBy,
                  sortDirection: newSortDirection,
                },
              })
            }
          />
          <StatusFilter />
          <FilterInput
            filterTerm={filterTerm}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onDeleteTodo={deleteTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </section>
  );
}

export default TodosPage;
