# Full-Stack ToDo List Application

A full-stack todo list application that supports persistent task management using a React frontend, a Bun-based REST API backend, and a PostgreSQL database, deployed on Vercel and Railway.

## Tech Stack

- **Frontend:** React (Vercel)

- **Backend:** Bun-based REST API

- **Database:** PostgreSQL (Railway)

## Live Demo

- **Frontend:** https://hosted-todo-list-app.vercel.app

- **Backend API:** https://hosted-todo-list-app-production.up.railway.app/todos

## Features

- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Data persists across sessions
- Responsive UI with real-time updates

---

# Setup (Local Environment)

## 1. Clone Repository
```
git clone https://github.com/AvZee/Hosted-Todo-List-App.git
cd Hosted-Todo-List-App
```

## 2. Install Dependencies

Frontend:
```
cd client
npm install
```

Backend:
```
cd ../server
bun install
```

## 3. Set Environment Variables

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:3000
```

Note: The `.env` file is not included for security reasons.
      Use `.env.example` as a template.

## 4. Run the App

Backend:
```
bun run dev
```

Frontend:
```
npm run dev
```

---

## API Overview
The backend exposes a RESTful API with the following endpoints:
- ```GET /todos``` -- Retrieve all todo items
- ```POST /todos``` -- Create a new todo item
- ```PATCH /todos/id``` -- Update a todo item
- ```DELETE /todos/id``` -- Delete a todo item
