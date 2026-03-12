import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
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
import { useTheme } from './context/ThemeContext';
import { todoReducer, initialState } from './reducers/todoReducer';

const init = (initialState) => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    return { ...initialState, todos: JSON.parse(savedTodos) };
  }
  return initialState;
};

function App() {
  const { isDarkMode } = useTheme();
  const [state, dispatch] = useReducer(todoReducer, initialState, init);
  const { todos, filter } = state;

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  }, []);

  const toggleTodo = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);

  const deleteTodo = useCallback((id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  const setFilter = useCallback((newFilter) => {
    dispatch({ type: 'SET_FILTER', payload: newFilter });
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'Active') return !todo.completed;
      if (filter === 'Completed') return todo.completed;
      return true; // All
    });
  }, [todos, filter]);

  const activeCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

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

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      dispatch({ type: 'REORDER_TODOS', payload: { activeId: active.id, overId: over.id } }); 
    }
  }, [dispatch]);

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
        <Header />

        <TodoInput addTodo={addTodo} />

        {/* Main List Container */}
        <div className="shadow-[0_35px_50px_0px_rgba(194,195,214,0.5)] dark:shadow-[0_35px_50px_0px_rgba(0,0,0,0.5)] rounded-md overflow-hidden bg-todo-light-surface dark:bg-todo-dark-surface transition-colors duration-300">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
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
