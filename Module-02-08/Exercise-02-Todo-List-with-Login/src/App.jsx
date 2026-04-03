import React, { useMemo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import Header from './components/Header';
import TodoInput from './components/TodoInput';
import TodoControls from './components/TodoControls';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';
import AuthModal from './components/AuthModal';

import bgLightDesktop from './assets/bg-light.png';
import bgDarkDesktop from './assets/bg-dark.png';
import { useTheme } from './context/ThemeContext';
import { useStore } from 'zustand';
import { appStore, todoAction } from './store';

function App() {
  const { isDarkMode } = useTheme();

  // Consume store data
  const currentUserEmail = useStore(appStore, state => state.currentUserEmail);
  const users = useStore(appStore, state => state.users);
  const filter = useStore(appStore, state => state.filter);
  const searchQuery = useStore(appStore, state => state.searchQuery);
  const sortOrder = useStore(appStore, state => state.sortOrder);

  // Derive current user and their todos
  const currentUser = users.find(u => u.email === currentUserEmail);
  const todos = useMemo(() => currentUser ? currentUser.todos : [], [currentUser]);

  // Using useCallback to map the actions to match the old action props when using reducers.
  const addTodo = useCallback((text) => todoAction.addTodo(text), []);
  const toggleTodo = useCallback((id) => todoAction.toggleTodo(id), []);
  const deleteTodo = useCallback((id) => todoAction.deleteTodo(id), []);
  const editTodo = useCallback((id, text) => todoAction.editTodo(id, text), []);
  const clearCompleted = useCallback(() => todoAction.clearCompleted(), []);
  const setFilter = useCallback((f) => todoAction.setFilter(f), []);
  const setSearchQuery = useCallback((q) => todoAction.setSearchQuery(q), []);
  const setSortOrder = useCallback((o) => todoAction.setSortOrder(o), []);

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === 'Active' && todo.completed) return false;
        if (filter === 'Completed' && !todo.completed) return false;

        const textToSearch = todo.text || '';
        if (searchQuery && !textToSearch.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;

        if (sortOrder === 'newest') {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
  }, [todos, filter, searchQuery, sortOrder]);

  const activeCount = useMemo(() => {
    return todos.filter((t) => !t.completed).length;
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      todoAction.reorderTodos(active.id, over.id);
    }
  }, []);

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

      {!currentUserEmail && <AuthModal />}

      {/* Background Image Container */}
      <div className="absolute top-0 left-0 w-full h-[300px] overflow-hidden">
        <div
          className="w-full h-full bg-no-repeat transition-all duration-300"
          style={bgStyles}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#AC2DEB] to-[#5596FF] dark:from-[#A42395] dark:to-[#3710BD] mix-blend-multiply opacity-80 pointer-events-none transition-colors duration-300"></div>
      </div>

      <div className="max-w-xl mx-auto z-10 relative">
        <Header />

        <TodoInput addTodo={addTodo} />

        <TodoControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Main List Container */}
        <div className="shadow-[0_35px_50px_0px_rgba(194,195,214,0.5)] dark:shadow-[0_35px_50px_0px_rgba(0,0,0,0.5)] rounded-md overflow-hidden bg-todo-light-surface dark:bg-todo-dark-surface transition-colors duration-300">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
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
