import { useRef, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import styles from "../../styles/ui.module.css";
import todoStyles from "../../styles/todos.module.css";
import {
  isValidTodoTitle,
  MAX_TODO_TITLE_LENGTH,
  prepareTodoTitle,
} from "../../utils/todoValidation.js";

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const [formError, setFormError] = useState("");

  function handleAddTodo(event) {
    event.preventDefault();

    const { sanitizedTitle, error } = prepareTodoTitle(workingTodoTitle);

    if (error) {
      setFormError(error);
      return;
    }

    onAddTodo(sanitizedTitle);
    setWorkingTodoTitle("");
    setFormError("");
    inputRef.current.focus();
  }

  return (
    <form className={todoStyles.todoForm} onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
          if (formError) {
            setFormError("");
          }
        }}
        maxLength={MAX_TODO_TITLE_LENGTH}
        placeholder="Add a task like 'Review lesson notes'"
        required
        helperText={`${workingTodoTitle.trim().length}/${MAX_TODO_TITLE_LENGTH} characters`}
      />
      {formError ? (
        <div className={`${styles.statusMessage} ${styles.errorMessage}`}>
          <p role="alert">{formError}</p>
        </div>
      ) : null}
      <div className={styles.buttonRow}>
        <button
          className={`${styles.button} ${styles.primaryButton}`}
          type="submit"
          disabled={!isValidTodoTitle(workingTodoTitle)}
        >
          Add Todo
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
