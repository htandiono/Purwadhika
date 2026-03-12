import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Inbox } from 'lucide-react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, toggleTodo, deleteTodo }) {
    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center text-gray-500 bg-todo-light-surface dark:bg-todo-dark-surface rounded-t-lg transition-colors min-h-[160px]">
                <Inbox size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-todo-light-text dark:text-todo-dark-text">No todos left!</p>
                <p className="text-sm opacity-75 mt-1">You're all caught up.</p>
            </div>
        );
    }

    return (
        <div className="bg-todo-light-surface dark:bg-todo-dark-surface rounded-t-md overflow-hidden transition-colors">
            <SortableContext
                items={todos.map(t => t.id)}
                strategy={verticalListSortingStrategy}
            >
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                ))}
            </SortableContext>
        </div>
    );
}
