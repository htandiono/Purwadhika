const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'todos.json');

app.use(express.json());

// Helper function to read todos from file
const readTodos = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            fs.writeFileSync(FILE_PATH, '[]');
            return [];
        }
        throw error;
    }
};

// Helper function to write todos to file
const writeTodos = (todos) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2), 'utf8');
};

// GET /todos - Get all todos
app.get('/todos', (req, res) => {
    try {
        const todos = readTodos();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read todos file' });
    }
});

// GET /todos/:id - Get todo by ID
app.get('/todos/:id', (req, res) => {
    try {
        const todos = readTodos();
        const todo = todos.find(t => t.id === parseInt(req.params.id));

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read todos file' });
    }
});

// POST /todos - Add new todo
app.post('/todos', (req, res) => {
    try {
        const { title, completed = false } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const todos = readTodos();
        const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

        const newTodo = {
            id: newId,
            title,
            completed
        };

        todos.push(newTodo);
        writeTodos(todos);

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// PUT /todos/:id - Update todo (Full Replacement)
app.put('/todos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, completed } = req.body;

        if (title === undefined || completed === undefined) {
            return res.status(400).json({ error: 'Both title and completed are required for PUT' });
        }

        const todos = readTodos();
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
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
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// PATCH /todos/:id - Partially update todo
app.patch('/todos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, completed } = req.body;

        const todos = readTodos();
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todos[index] = {
            ...todos[index],
            ...(title !== undefined && { title }),
            ...(completed !== undefined && { completed })
        };

        writeTodos(todos);

        res.status(200).json(todos[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// DELETE /todos/:id - Delete todo
app.delete('/todos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const todos = readTodos();
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const deletedTodo = todos.splice(index, 1)[0];
        writeTodos(todos);

        res.status(200).json(deletedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to write to todos file' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
