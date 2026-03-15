import { arrayMove } from '@dnd-kit/sortable';

export const initialState = {
  todos: [
    { id: '1', text: 'Complete online JavaScript course', completed: true, createdAt: Date.now() - 600000 },
    { id: '2', text: 'Jog around the park 3x', completed: false, createdAt: Date.now() - 500000 },
    { id: '3', text: '10 minutes meditation', completed: false, createdAt: Date.now() - 400000 },
    { id: '4', text: 'Read for 1 hour', completed: false, createdAt: Date.now() - 300000 },
    { id: '5', text: 'Pick up groceries', completed: false, createdAt: Date.now() - 200000 },
    { id: '6', text: 'Complete Todo App on Frontend Mentor', completed: false, createdAt: Date.now() - 100000 },
  ],
  filter: 'All', // 'All', 'Active', 'Completed'
  searchQuery: '',
  sortOrder: 'newest', // 'newest', 'oldest'
};

export const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: Date.now(),
      };
      return {
        ...state,
        todos: [newTodo, ...state.todos],
      };
    }
    case 'TOGGLE_TODO': {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    }
    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    }
    case 'CLEAR_COMPLETED': {
      return {
        ...state,
        todos: state.todos.map((todo) => ({ ...todo, completed: false })),
      };
    }
    case 'SET_FILTER': {
      return {
        ...state,
        filter: action.payload,
      };
    }
    case 'REORDER_TODOS': {
      const { activeId, overId } = action.payload;
      const oldIndex = state.todos.findIndex((item) => item.id === activeId);
      const newIndex = state.todos.findIndex((item) => item.id === overId);
      return {
        ...state,
        todos: arrayMove(state.todos, oldIndex, newIndex),
      };
    }
    case 'EDIT_TODO': {
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
        ),
      };
    }
    case 'SET_SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }
    case 'SET_SORT_ORDER': {
      return {
        ...state,
        sortOrder: action.payload,
      };
    }
    default:
      return state;
  }
};
