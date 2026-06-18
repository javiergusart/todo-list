import { useState } from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import styles from "../../../styles/ui.module.css";
import todoStyles from "../../../styles/todos.module.css";
import {
  isValidTodoTitle,
  MAX_TODO_TITLE_LENGTH,
  prepareTodoTitle,
} from "../../../utils/todoValidation.js";

function TodoListItem({ todo, onCompleteTodo, onDeleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const [editError, setEditError] = useState("");

  function handleCancel() {
    setWorkingTitle(todo.title);
    setEditError("");
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
    if (editError) {
      setEditError("");
    }
  }

  function handleUpdate(event) {
    if (!isEditing) {
      return;
    }

    event.preventDefault();

    const { sanitizedTitle, error } = prepareTodoTitle(workingTitle);

    if (error) {
      setEditError(error);
      return;
    }

    onUpdateTodo({ ...todo, title: sanitizedTitle });
    setEditError("");
    setIsEditing(false);
  }

  function handleDelete() {
    onDeleteTodo(todo.id);
  }

  return (
    <li className={todoStyles.todoItem}>
      <form className={todoStyles.editForm} onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todoTitle${todo.id}`}
              labelText="Todo"
              value={workingTitle}
              onChange={handleEdit}
              maxLength={MAX_TODO_TITLE_LENGTH}
              required
              helperText={`${workingTitle.trim().length}/${MAX_TODO_TITLE_LENGTH} characters`}
            />
            {editError ? (
              <div className={`${styles.statusMessage} ${styles.errorMessage}`}>
                <p role="alert">{editError}</p>
              </div>
            ) : null}
            <div className={styles.buttonRow}>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                type="submit"
                disabled={!isValidTodoTitle(workingTitle)}
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={todoStyles.todoSummary}>
              <input
                className={todoStyles.checkbox}
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                aria-label={`Mark ${todo.title} as ${
                  todo.isCompleted ? "active" : "completed"
                }`}
              />
              <button
                className={`${todoStyles.titleButton} ${
                  todo.isCompleted ? todoStyles.completedTitle : ""
                }`}
                type="button"
                onClick={() => setIsEditing(true)}
              >
                {todo.title}
              </button>
            </div>
            <div className={todoStyles.itemActions}>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className={`${styles.button} ${styles.dangerButton}`}
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
