import { useEffect, useState } from 'react'

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
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Todo App</h1>

      <form onSubmit={addTodo} style={{ marginBottom: "1rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a todo"
          style={{ padding: "0.5rem", marginRight: "0.5rem", width: "70%" }}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "0.5rem" }}>
            <button onClick={() => toggleTodo(todo)} style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>
              {todo.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>

            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.6 : 1,
                marginRight: "0.5rem",
              }}
            >
              {todo.text}
            </span>

            <button onClick={() => editTodo(todo)} style={{ marginLeft: "0.1rem" }}>Edit</button>

            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;

/* Template code
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/