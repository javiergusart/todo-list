import "./App.css";
import { useState } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previousTodoList) => [newTodo, ...previousTodoList]);
  }

  function completeTodo(id) {
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo,
      ),
    );
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
