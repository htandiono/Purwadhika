import React, { useState } from 'react';

export default function TodoInput({ addTodo }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            addTodo(text.trim());
            setText('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-todo-light-surface dark:bg-todo-dark-surface rounded-md shadow-[0_35px_50px_-15px_rgba(194,195,214,0.5)] dark:shadow-[0_35px_50px_-15px_rgba(0,0,0,0.5)] mb-6 flex items-center px-5 py-4 transition-colors relative z-20"
        >
            <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 mr-4 flex-shrink-0" />
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Create a new todo..."
                className="w-full bg-transparent border-none outline-none text-todo-light-text dark:text-todo-dark-text placeholder-gray-400 dark:placeholder-gray-500 font-medium"
            />
        </form>
    );
}
