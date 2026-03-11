export const initialState = {
  todos: [
    { id: '1', text: 'Complete online JavaScript course', completed: true },
    { id: '2', text: 'Jog around the park 3x', completed: false },
    { id: '3', text: '10 minutes meditation', completed: false },
    { id: '4', text: 'Read for 1 hour', completed: false },
    { id: '5', text: 'Pick up groceries', completed: false },
    { id: '6', text: 'Complete Todo App on Frontend Mentor', completed: false },
  ],
  filter: 'All', // 'All', 'Active', 'Completed'
};

export const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
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
      return {
        ...state,
        todos: action.payload,
      };
    }
    default:
      return state;
  }
};
