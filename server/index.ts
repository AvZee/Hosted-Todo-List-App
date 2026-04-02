import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()")
    .then((result) => console.log("DB connected: ", result.rows[0]))
    .catch((err) => console.error("DB connection failed: ", err));

type Handler = (req: Request, url: URL) => Promise<Response> | Response;

function middleware(handler: Handler): Handler {
    return async (req, url) => {
        const start = Date.now();

        // Logging Middleware
        console.log(`[${req.method}] ${url.pathname}`);

        try {
            const res = await handler(req, url);

            // Timing and Status
            console.log(`-> ${res.status} (${Date.now() - start}ms)`);

            return addCorsHeaders(res);
        } catch (err) {
            console.error("Server error: ", err);
            return addCorsHeaders(json({ error: "Internal Server Error" }, 500));
        }
    }
}

function addCorsHeaders(res: Response, origin?: string): Response {
    console.log("addCorsHeaders called with origin:", origin);
    
    const allowedOrigins = [
        "http://localhost:5173",
        "https://hosted-todo-list-app.vercel.app",
    ];

    if (origin && allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Origin", origin);
    }

    if (origin && allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Origin", origin);
        console.log("CORS origin set to:", origin);
    } else {
        console.log("Origin not allowed:", origin);
    }

    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return res;
}

function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 
            "Content-Type": "application/json",
        },
    });
}

function notFound() {
    return json({ error: "Not Found" }, 404);
}

const handler: Handler = async (req, url) => {
    const { pathname } = url;

    // GET /todos
    if (req.method === "GET" && pathname === "/todos") {
        const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
        return json(result.rows);
    }

    // POST /todos
    if (req.method === "POST" && pathname === "/todos") {
        const body = await req.json();
        const result = await pool.query(
            "INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *",
            [body.text, false]
        );

        return json(result.rows[0], 201);
    }

    // PATCH /todos/id
    if (req.method === "PATCH" && pathname.startsWith("/todos/")) {
        const id = Number(pathname.split("/")[2]);
        const body = await req.json();

        const result = await pool.query(
            "UPDATE todos SET text = COALESCE($1, text), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *",
            [body.text ?? null, body.completed ?? null, id]
        );

        if (result.rowCount === 0) return notFound();

        return json(result.rows[0]);
    }

    // DELETE /todos/id
    if (req.method === "DELETE" && pathname.startsWith("/todos/")) {
        const id = Number(pathname.split("/")[2]);

        const result = await pool.query(
            "DELETE FROM todos WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) return notFound();

        return json({ message: "Deleted" });
    }

    return notFound();
};

const port = Number(process.env.PORT || 3000);

Bun.serve({
    port,
    hostname: "0.0.0.0",
    async fetch(req): Promise<Response> {
        const url = new URL(req.url);
        const origin = req.headers.get("origin") || undefined;
        
        if (req.method === "OPTIONS") {
            return addCorsHeaders(new Response(null, { status: 204 }), origin);
        }        

        const res = await middleware(handler)(req, url);

        return addCorsHeaders(res, origin);
    },
});

console.log(`Server running on port ${port}`);