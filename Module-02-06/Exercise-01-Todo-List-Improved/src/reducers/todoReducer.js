import { arrayMove } from '@dnd-kit/sortable';

// The initial state of our application that will be loaded when the app first starts.
// We added 'createdAt' metadata to calculate sorting later based on when tasks were made.
export const initialState = {
  todos: [
    { id: '1', text: 'Complete online JavaScript course', completed: true, createdAt: Date.now() - 600000 },
    { id: '2', text: 'Jog around the park 3x', completed: false, createdAt: Date.now() - 500000 },
    { id: '3', text: '10 minutes meditation', completed: false, createdAt: Date.now() - 400000 },
    { id: '4', text: 'Read for 1 hour', completed: false, createdAt: Date.now() - 300000 },
    { id: '5', text: 'Pick up groceries', completed: false, createdAt: Date.now() - 200000 },
    { id: '6', text: 'Complete Todo App on Frontend Mentor', completed: false, createdAt: Date.now() - 100000 },
  ],
  filter: 'All', // Stores the active bottom filter tab ('All', 'Active', 'Completed')
  searchQuery: '', // Stores the text currently typed into the search bar
  sortOrder: 'newest', // Stores the current sorting direction from the dropdown
};

// The Reducer function that handles all state modifications in our app.
// It receives the current `state` and an `action` object, and returns a totally new state object.
export const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: Date.now(), // Tracking creation time for sorting features
      };
      return {
        ...state,
        todos: [newTodo, ...state.todos],
      };
    }
    case 'TOGGLE_TODO': {
      return {
        ...state,
        // Toggle completed status by flipping the boolean of the matched id
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
      // Re-orders the drag-and-drop array gracefully using the dnd-kit helper function
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
        // Find the matched to-do by ID and overwrite its text with the new string
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
