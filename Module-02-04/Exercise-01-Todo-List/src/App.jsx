import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import Header from './components/Header';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';

import bgLightDesktop from './assets/bg-light.png';
import bgDarkDesktop from './assets/bg-dark.png';

const initialTodos = [
  { id: '1', text: 'Complete online JavaScript course', completed: true },
  { id: '2', text: 'Jog around the park 3x', completed: false },
  { id: '3', text: '10 minutes meditation', completed: false },
  { id: '4', text: 'Read for 1 hour', completed: false },
  { id: '5', text: 'Pick up groceries', completed: false },
  { id: '6', text: 'Complete Todo App on Frontend Mentor', completed: false },
];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const clearCompleted = () => {
    // Clear completed will clear all the completed state of all items and made them active again
    setTodos(todos.map(todo => ({ ...todo, completed: false })));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true; // All
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;

  // DND Kit logic
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum drag distance for reorder
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Background Image Container
  const bgStyles = isDarkMode
    ? {
      backgroundImage: `url(${bgDarkDesktop})`,
      backgroundSize: '100% auto',
      backgroundPosition: 'center',
      opacity: 0.75,
    }
    : {
      backgroundImage: `url(${bgLightDesktop})`,
      backgroundSize: '100% auto',
      backgroundPosition: 'center',
      opacity: 0.75,
    };

  return (
    <div className="min-h-screen pt-16 px-6 pb-20 relative bg-todo-light-bg dark:bg-todo-dark-bg transition-colors duration-300">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 w-full h-[300px] overflow-hidden">
        <div
          className="w-full h-full bg-no-repeat transition-all duration-300"
          style={bgStyles}
        />
        {/* 80% Opacity Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#AC2DEB] to-[#5596FF] dark:from-[#A42395] dark:to-[#3710BD] mix-blend-multiply opacity-80 pointer-events-none transition-colors duration-300"></div>
      </div>
      <div className="max-w-xl mx-auto z-10 relative">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <TodoInput addTodo={addTodo} />

        {/* Main List Container */}
        <div className="shadow-[0_35px_50px_0px_rgba(194,195,214,0.5)] dark:shadow-[0_35px_50px_0px_rgba(0,0,0,0.5)] rounded-md overflow-hidden bg-todo-light-surface dark:bg-todo-dark-surface transition-colors duration-300">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TodoList todos={filteredTodos} toggleTodo={toggleTodo} />
          </DndContext>

          <TodoFilters
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
            itemsLeft={activeCount}
          />
        </div>

        {/* Mobile layout separated filters */}
        <div className="sm:hidden flex justify-center mt-6 px-5 py-4 text-sm text-gray-500 dark:text-gray-400 bg-todo-light-surface dark:bg-todo-dark-surface rounded-md shadow-[0_35px_50px_-15px_rgba(194,195,214,0.5)] dark:shadow-[0_35px_50px_-15px_rgba(0,0,0,0.5)] transition-colors relative z-20">
          <div className="flex gap-4 items-center justify-center">
            {['All', 'Active', 'Completed'].map(btn => (
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

        <p className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          Drag and drop to reorder list
        </p>
      </div>
    </div>
  );
}

export default App;
