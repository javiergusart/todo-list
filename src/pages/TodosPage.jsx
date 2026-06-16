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
import useDebounce from "../utils/useDebounce.js";

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

        if (!response.ok) {
          throw new Error("Unable to fetch todos.");
        }

        const data = await response.json();
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks ?? [] },
        });
      } catch (fetchError) {
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
                ? `Error filtering/sorting todos: ${fetchError.message}`
                : `Error fetching todos: ${fetchError.message}`,
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
    const temporaryTodo = {
      id: Date.now(),
      title: todoTitle,
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

    const completedTodo = { ...originalTodo, isCompleted: true };

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
          isCompleted: true,
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
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo },
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
          title: editedTodo.title,
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

  return (
    <section>
      <h2>Todos</h2>
      {error ? (
        <div>
          <p role="alert">{error}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      ) : null}
      {filterError ? (
        <div>
          <p>{filterError}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </div>
      ) : null}
      {isTodoListLoading ? <p>Loading todos...</p> : null}
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
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </section>
  );
}

export default TodosPage;
