import React, { memo, useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// eslint-disable-next-line react-refresh/only-export-components
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const TodoItem = memo(function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) {
    // Local state to manage whether this specific item is currently being edited
    const [isEditing, setIsEditing] = useState(false);
    // Local state to track the live typing before it is officially saved to the global Reducer
    const [editText, setEditText] = useState(todo.text);
    // Allows us to directly manipulate the raw DOM element (in this case, auto-focusing the input box)
    const editInputRef = useRef(null);

    // Whenever 'isEditing' becomes true, this effect runs and forces the user's cursor into the text box
    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [isEditing]);

    // Called when the user clicks away (onBlur) or hits Enter.
    const handleEditSave = () => {
        // Only save to the global Reducer if it isn't an empty string, and it actually changed
        if (editText.trim().length > 0 && editText !== todo.text) {
            editTodo(todo.id, editText.trim());
        } else {
            setEditText(todo.text); // Reset back to original text if blank or unchanged
        }
        setIsEditing(false); // Close the edit box
    };

    // Listeners for keyboard shortcuts while inside the edit text box
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleEditSave(); // Save and close
        if (e.key === 'Escape') {
            // Cancel and close
            setEditText(todo.text);
            setIsEditing(false);
        }
    };
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id });

    const style = {
        transform: transform ? `${CSS.Translate.toString(transform)}${isDragging ? ' scale(1.03)' : ''}` : undefined,
        transition,
        zIndex: isDragging ? 50 : 10,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group flex items-center gap-4 px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-todo-light-surface dark:bg-todo-dark-surface cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-todo-primary relative touch-none",
                isDragging ? "opacity-90 shadow-2xl ring-1 ring-todo-primary ring-offset-2 dark:ring-offset-todo-dark-bg ring-offset-todo-light-bg rounded-md" : "active:scale-[1.01]"
            )}
        >
            <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-todo-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-todo-dark-surface"
                aria-label={todo.text}
            />
            {/* 
                If isEditing is true, we render an active text <input> box so the user can type.
                If false, we render a normal <span> text element that listens for a double click. 
            */}
            {isEditing ? (
                <input
                    ref={editInputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleEditSave} // Saves automatically if user clicks away from the box
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent text-todo-light-text dark:text-todo-dark-text font-medium border-b-2 border-todo-primary focus:outline-none px-0 py-0"
                />
            ) : (
                <span
                    onDoubleClick={() => setIsEditing(true)}
                    className={cn(
                        "flex-grow cursor-text text-todo-light-text dark:text-todo-dark-text font-medium transition-colors hover:text-todo-primary",
                        todo.completed && "line-through text-gray-400 dark:text-gray-500"
                    )}
                >
                    {todo.text}
                </span>
            )}

            {/* Delete button */}
            <button
                onClick={(e) => {
                    // Prevent dnd-kit drag event or any bubbling from interfering
                    e.stopPropagation();
                    deleteTodo(todo.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:opacity-100 flex-shrink-0 rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-todo-primary"
                aria-label="Delete todo"
            >
                <X size={20} />
            </button>
        </div>
    );
});

export default TodoItem;
