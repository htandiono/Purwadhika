import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function TodoItem({ todo, toggleTodo, deleteTodo }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group flex items-center gap-4 px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-todo-light-surface dark:bg-todo-dark-surface cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50 z-10 shadow-lg"
            )}
        >
            <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox flex-shrink-0"
                aria-label={todo.text}
            />
            <span
                onClick={(e) => {
                    // Stop propagation so it doesn't interfere
                    e.stopPropagation();
                    toggleTodo(todo.id);
                }}
                className={cn(
                    "flex-grow cursor-pointer text-todo-light-text dark:text-todo-dark-text font-medium transition-colors hover:text-todo-primary",
                    todo.completed && "line-through text-gray-400 dark:text-gray-500"
                )}
            >
                {todo.text}
            </span>

            {/* Delete button */}
            <button
                onClick={(e) => {
                    // Prevent dnd-kit drag event or any bubbling from interfering
                    e.stopPropagation();
                    deleteTodo(todo.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:opacity-100 flex-shrink-0"
                aria-label="Delete todo"
            >
                <X size={20} />
            </button>
        </div>
    );
}
