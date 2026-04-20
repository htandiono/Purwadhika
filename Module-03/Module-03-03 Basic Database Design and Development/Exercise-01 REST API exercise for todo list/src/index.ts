import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';

dotenv.config();

const PORT: number = 8000;
const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
    res.status(200).send("Hello From API");
});

pool.connect((err: Error | undefined, client: any, release: () => void): void => {
    if (err) {
        console.error("Error acquiring client", err.stack);
        return;
    }
    console.log("Success Connection");
    release();
});

// Initialize table if it doesn't exist
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS todos (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                text VARCHAR(255) NOT NULL,
                completed BOOLEAN,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("Database initialized successfully!");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

initDb();

// 1. Give me all todos
app.get('/todos', async (req: Request, res: Response) => {
    try {
        // We alias columns to camelCase so they map directly back to what the frontend expects
        const result = await pool.query(`
            SELECT 
                id AS "objectId", 
                text, 
                completed, 
                user_id AS "ownerId", 
                created_at AS "created"
            FROM todos 
            ORDER BY created_at ASC
        `);
        const todos = result.rows;
        res.status(200).send(todos);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// 2. Add a new todo
app.post('/todos', async (req, res) => {
    try {
        const { text, ownerId } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        // user_id is now required (NON-NULLABLE) per your schema
        const { rows } = await pool.query(
            `INSERT INTO todos (text, completed, user_id) 
              VALUES ($1, $2, $3) 
              RETURNING id AS "objectId", text, completed, user_id AS "ownerId", created_at AS "created"`,
            [text, false, ownerId]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Update a todo (toggle status or edit text)
app.patch('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;

        const { rows: currentRows } = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (currentRows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        const currentTodo = currentRows[0];
        const newText = text !== undefined ? text : currentTodo.text;
        const newCompleted = completed !== undefined ? completed : currentTodo.completed;

        const { rows } = await pool.query(
            `UPDATE todos SET text = $1, completed = $2
              WHERE id = $3 
              RETURNING id AS "objectId", text, completed, user_id AS "ownerId", created_at AS "created"`,
            [newText, newCompleted, id]
        );

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 5. Clear completed todos
app.delete('/todos', async (req, res) => {
    try {
        // We look for a query param or a body to clear completed.
        // A specific endpoint like /todos/completed is better but let's handle /todos?status=completed
        const { rows } = await pool.query('DELETE FROM todos WHERE completed = true RETURNING *');
        res.status(200).json({ message: "Completed todos cleared", count: rows.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, (): void => {
    console.log(`App running on port ${PORT}`);
});

/*
=========================================================
POSTMAN API ENDPOINTS & SAMPLE CALLS
=========================================================

1. Get All Todos
   - Endpoint: GET http://localhost:8000/todos
   - Description: Fetches all todos from the database ordered by creation date.

2. Add New Todo
   - Endpoint: POST http://localhost:8000/todos
   - Headers: { "Content-Type": "application/json" }
   - Body (raw JSON):
     {
       "text": "My new task",
       "ownerId": "INSERT_A_USER_UUID_HERE" 
     }

3. Update a Todo (Toggle complete or Edit Text)
   - Endpoint: PATCH http://localhost:8000/todos/<REPLACE_WITH_TODO_UUID>
   - Headers: { "Content-Type": "application/json" }
   - Body (raw JSON):
     {
       "completed": true,
       "text": "My updated task manually"
     }

4. Delete a Todo
   - Endpoint: DELETE http://localhost:8000/todos/<REPLACE_WITH_TODO_UUID>
   - Description: Permanently removes a task.

5. Clear Completed Todos
   - Endpoint: DELETE http://localhost:8000/todos
   - Description: Automatically deletes all tasks that have completed status set to true.

=========================================================
*/
