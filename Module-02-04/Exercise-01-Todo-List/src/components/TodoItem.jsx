import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function TodoItem({ todo, toggleTodo }) {
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
            className={cn(
                "group flex items-center gap-4 px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-todo-light-surface dark:bg-todo-dark-surface cursor-default",
                isDragging && "opacity-50 z-10 shadow-lg"
            )}
        >
            <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox flex-shrink-0"
            />
            <label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                    "flex-grow cursor-pointer text-todo-light-text dark:text-todo-dark-text font-medium transition-colors",
                    todo.completed && "line-through text-gray-400 dark:text-gray-500"
                )}
            >
                {todo.text}
            </label>

            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:opacity-100 flex-shrink-0"
                aria-label="Drag to reorder"
            >
                <GripVertical size={20} />
            </div>
        </div>
    );
}
