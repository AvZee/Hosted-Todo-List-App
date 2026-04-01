import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  // Fetches todos for the list
  async function fetchTodos() {
    const res = await fetch(`${API_BASE_URL}/todos`);
    const data = await res.json();
    setTodos(data);
  }

  // Function to add a todo item to the list
  async function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!text.trim()) return;

    const res = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error("Failed to add todo");
      return;
    }

    setText("");
    fetchTodos();
  }

  // Function to delete a todo item from the list
  async function deleteTodo(id: number) {
    const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Failed to delete todo");
      return;
    }

    fetchTodos();
  }

  // Function to toggle complete/incomplete todo
  async function toggleTodo(todo:Todo) {
    const res = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    if (!res.ok) {
      console.error("Failed to update todo");
      return;
    }

    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to edit the text of an existing todo item
  async function editTodo(todo: Todo) {
    const newText = window.prompt("Edit todo: ", todo.text);

    if (!newText || !newText.trim()) return;

    const res = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newText.trim(),
      }),
    });

    if (!res.ok) {
      console.error("Failed to edit todo");
      return;
    }

    fetchTodos();
  }

  return (
    <main className="app">
      <section className="todo-card">
        <h1 className="app-title">Todo App</h1>

        <form className="todo-form" onSubmit={addTodo}>
          <input
          className="todo-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a todo"
          />
          <button className="primary-button" type="submit">Add</button>
        </form>

        {todos.length === 0 ? (
          <p className="empty-state">No todos yet. Add one above.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li className="todo-item" key={todo.id}>
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                
                <div className="todo-actions">
                  <button className="secondary-button" onClick={() => toggleTodo(todo)}>
                    {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>

                  <button className="secondary-button" onClick={() => editTodo(todo)}>
                    Edit
                  </button>

                  <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;