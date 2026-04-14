import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'todos.json');

app.use(express.json());

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

// Helper function to read todos from file
const readTodos = (): Todo[] => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data) as Todo[];
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            fs.writeFileSync(FILE_PATH, '[]');
            return [];
        }
        console.error('Error reading todos:', error);
        throw error;
    }
};

// Helper function to write todos to file
const writeTodos = (todos: Todo[]): void => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), 'utf8');
};

// GET /todos - Get all todos
app.get('/todos', (req: Request, res: Response) => {
    try {
        const todos = readTodos();
        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to read todos file' });
    }
});

// GET /todos/:id - Get todo by ID
app.get('/todos/:id', (req: Request, res: Response): any => {
    try {
        const todos = readTodos();
        const todo = todos.find(t => t.id === parseInt(req.params.id as string));

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to read todos file' });
    }
});

// POST /todos - Add new todo
app.post('/todos', (req: Request, res: Response): any => {
    try {
        const { title, completed = false } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const todos = readTodos();
        const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

        const newTodo: Todo = {
            id: newId,
            title,
            completed
        };

        todos.push(newTodo);
        writeTodos(todos);

        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// PUT /todos/:id - Update todo (Full Replacement)
app.put('/todos/:id', (req: Request, res: Response): any => {
    try {
        const id = parseInt(req.params.id as string);
        const { title, completed } = req.body;

        if (title === undefined || completed === undefined) {
            return res.status(400).json({ error: 'Both title and completed are required for PUT' });
        }

        const todos = readTodos();
        const index = todos.findIndex(t => t.id === id);
        const todo = todos[index];

        if (index === -1 || !todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todos[index] = {
            id,
            title,
            completed
        };

        writeTodos(todos);

        res.status(200).json(todos[index]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// PATCH /todos/:id - Partially update todo
app.patch('/todos/:id', (req: Request, res: Response): any => {
    try {
        const id = parseInt(req.params.id as string);
        const { title, completed } = req.body;

        const todos = readTodos();
        const index = todos.findIndex(t => t.id === id);
        const todo = todos[index];

        if (index === -1 || !todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        if (title !== undefined) {
            todo.title = title;
        }
        if (completed !== undefined) {
            todo.completed = completed;
        }

        writeTodos(todos);

        res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// DELETE /todos/:id - Delete todo
app.delete('/todos/:id', (req: Request, res: Response): any => {
    try {
        const id = parseInt(req.params.id as string);

        const todos = readTodos();
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const deletedTodos = todos.splice(index, 1);
        const deletedTodo = deletedTodos[0];

        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found index mismatch' });
        }

        writeTodos(todos);

        res.status(200).json(deletedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
