import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TodoItem from './TodoItem';

export default function TodoList({ todos, toggleTodo, deleteTodo }) {
    if (todos.length === 0) {
        return (
            <div className="px-5 py-6 text-center text-gray-500 bg-todo-light-surface dark:bg-todo-dark-surface rounded-t-lg transition-colors">
                No todos left!
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
