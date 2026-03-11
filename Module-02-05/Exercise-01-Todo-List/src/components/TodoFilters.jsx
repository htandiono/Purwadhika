import React from 'react';

export default function TodoFilters({ filter, setFilter, clearCompleted, itemsLeft }) {
    const filterBtns = ['All', 'Active', 'Completed'];

    return (
        <div className="flex justify-between items-center px-5 py-4 text-sm text-gray-500 dark:text-gray-400 bg-todo-light-surface dark:bg-todo-dark-surface rounded-b-md transition-colors relative z-20">
            <span>{itemsLeft} items left</span>

            {/* Desktop inline filters (hidden on mobile) */}
            <div className="hidden sm:block">
                <div className="flex gap-4 items-center justify-center">
                    {filterBtns.map(btn => (
                        <button
                            key={btn}
                            onClick={() => setFilter(btn)}
                            className={`font-bold transition-colors ${filter === btn
                                    ? 'text-todo-primary'
                                    : 'hover:text-todo-light-text dark:hover:text-todo-dark-text'
                                }`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={clearCompleted}
                className="hover:text-todo-light-text dark:hover:text-todo-dark-text transition-colors"
            >
                Clear Completed
            </button>
        </div>
    );
}
