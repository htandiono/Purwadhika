import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const PORT: number = 8000;
const app: Application = express();

app.use(cors());
app.use(express.json());

interface AuthRequest extends Request {
    user?: { id: string };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err: any, user: any) => {
        if (err) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        req.user = user;
        next();
    });
};

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
                completed BOOLEAN DEFAULT false,
                order_index INTEGER DEFAULT 0,
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

// --- Auth Endpoints ---

app.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, hashedPassword]
        );
        res.status(201).json(rows[0]);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, login, password } = req.body; 
        const userEmail = email || login; // handle both standard 'email' or backendless 'login'
        const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [userEmail]);
        const user = rows[0];
        
        if (!user) {
            res.status(400).json({ error: "User not found" });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ error: "Invalid password" });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/auth/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { rows } = await pool.query(`SELECT id, email, name FROM users WHERE id = $1`, [req.user?.id]);
        if (rows.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(rows[0]);
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- Todos Endpoints ---

// 1. Give me all todos for current user
app.get('/todos', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                text, 
                completed, 
                user_id AS "ownerId", 
                created_at AS "created",
                order_index AS "orderIndex"
            FROM todos 
            WHERE user_id = $1
            ORDER BY order_index ASC, created_at ASC
        `, [req.user?.id]);
        res.status(200).send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// 2. Add a new todo
app.post('/todos', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { text, orderIndex } = req.body;
        if (!text) {
            res.status(400).json({ error: "Text is required" });
            return;
        }

        const ownerId = req.user?.id;
        const { rows } = await pool.query(
            `INSERT INTO todos (text, completed, user_id, order_index) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, text, completed, user_id AS "ownerId", created_at AS "created", order_index AS "orderIndex"`,
            [text, false, ownerId, orderIndex || 0]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Update a todo (toggle status, edit text, or reorder)
app.patch('/todos/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { text, completed, orderIndex } = req.body;

        const { rows: currentRows } = await pool.query('SELECT * FROM todos WHERE id = $1 AND user_id = $2', [id, req.user?.id]);
        if (currentRows.length === 0) {
            res.status(404).json({ error: "Todo not found" });
            return;
        }

        const currentTodo = currentRows[0];
        const newText = text !== undefined ? text : currentTodo.text;
        const newCompleted = completed !== undefined ? completed : currentTodo.completed;
        const newOrderIndex = orderIndex !== undefined ? orderIndex : currentTodo.order_index;

        const { rows } = await pool.query(
            `UPDATE todos SET text = $1, completed = $2, order_index = $3
             WHERE id = $4 AND user_id = $5
             RETURNING id, text, completed, user_id AS "ownerId", created_at AS "created", order_index AS "orderIndex"`,
            [newText, newCompleted, newOrderIndex, id, req.user?.id]
        );

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Delete a todo
app.delete('/todos/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2', [id, req.user?.id]);
        if (rowCount === 0) {
            res.status(404).json({ error: "Todo not found" });
            return;
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 5. Clear completed todos
app.delete('/todos/completed/bulk', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { rows } = await pool.query('DELETE FROM todos WHERE completed = true AND user_id = $1 RETURNING *', [req.user?.id]);
        res.status(200).json({ message: "Completed todos cleared", count: rows.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, (): void => {
    console.log(`App running on port ${PORT}`);
});
