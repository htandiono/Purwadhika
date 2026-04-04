import React, { useState } from 'react';

import { X } from 'lucide-react';

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
            className="bg-todo-light-surface dark:bg-todo-dark-surface rounded-md shadow-[0_35px_50px_-15px_rgba(194,195,214,0.5)] dark:shadow-[0_35px_50px_-15px_rgba(0,0,0,0.5)] mb-6 flex items-center px-5 py-4 transition-all relative z-20 focus-within:ring-2 focus-within:ring-todo-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-todo-dark-bg focus-within:ring-offset-todo-light-bg"
        >
            <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 mr-4 flex-shrink-0" />
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Create a new todo..."
                className="w-full bg-transparent border-none outline-none text-todo-light-text dark:text-todo-dark-text placeholder-gray-400 dark:placeholder-gray-500 font-medium"
            />
            {text && (
                <button
                    type="button"
                    onClick={() => setText('')}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-todo-primary rounded-full transition-colors flex-shrink-0"
                    aria-label="Clear input"
                >
                    <X size={18} />
                </button>
            )}
        </form>
    );
}
