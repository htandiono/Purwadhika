import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";

export const appStore = createStore(
  persist(
    (set, get) => ({
      users: [],
      currentUserEmail: null,
      filter: "All",
      searchQuery: "",
      sortOrder: "newest",

      // AUTH ACTIONS
      login: (email, password) => {
        const users = get().users;
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          set({ currentUserEmail: email });
          return true;
        }
        return false;
      },
      register: (name, email, password) => {
        const users = get().users;
        const exists = users.find((u) => u.email === email);
        if (exists) return false;

        const newUser = {
          name,
          email,
          password,
          todos: [],
        };
        set({
          users: [...users, newUser],
          currentUserEmail: email, // Auto-login after register
        });
        return true;
      },
      logout: () => {
        set({ currentUserEmail: null, filter: "All", searchQuery: "", sortOrder: "newest" });
      },
      editUser: (name, password) => {
        const currentUserEmail = get().currentUserEmail;
        if (!currentUserEmail) return;

        const users = get().users.map((u) =>
          u.email === currentUserEmail ? { ...u, name, password } : u
        );
        set({ users });
      },

      // TODO ACTIONS
      _updateCurrentUserTodos: (updateFn) => {
        const currentUserEmail = get().currentUserEmail;
        if (!currentUserEmail) return;

        set((state) => ({
          users: state.users.map((user) => {
            if (user.email === currentUserEmail) {
              return { ...user, todos: updateFn(user.todos) };
            }
            return user;
          }),
        }));
      },
      addTodo: (text) => {
        const newTodo = {
          id: Date.now().toString(),
          text,
          completed: false,
          createdAt: Date.now(),
        };
        get()._updateCurrentUserTodos((todos) => [newTodo, ...todos]);
      },
      toggleTodo: (id) => {
        get()._updateCurrentUserTodos((todos) =>
          todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
        );
      },
      deleteTodo: (id) => {
        get()._updateCurrentUserTodos((todos) => todos.filter((todo) => todo.id !== id));
      },
      clearCompleted: () => {
        get()._updateCurrentUserTodos((todos) =>
          todos.map((todo) => ({ ...todo, completed: false }))
        );
      },
      editTodo: (id, text) => {
        get()._updateCurrentUserTodos((todos) =>
          todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
        );
      },
      reorderTodos: (activeId, overId) => {
        get()._updateCurrentUserTodos((todos) => {
          const oldIndex = todos.findIndex((item) => item.id === activeId);
          const newIndex = todos.findIndex((item) => item.id === overId);
          return arrayMove(todos, oldIndex, newIndex);
        });
      },

      // UI ACTIONS
      setFilter: (filter) => set({ filter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
    }),
    {
      name: "todo-app-storage", // key in localStorage
    }
  )
);

// Using getState() to get references immediately
export const userAction = {
  login: (email, password) => appStore.getState().login(email, password),
  register: (name, email, password) => appStore.getState().register(name, email, password),
  logout: () => appStore.getState().logout(),
  editUser: (name, password) => appStore.getState().editUser(name, password),
};

export const todoAction = {
  addTodo: (text) => appStore.getState().addTodo(text),
  toggleTodo: (id) => appStore.getState().toggleTodo(id),
  deleteTodo: (id) => appStore.getState().deleteTodo(id),
  clearCompleted: () => appStore.getState().clearCompleted(),
  editTodo: (id, text) => appStore.getState().editTodo(id, text),
  reorderTodos: (activeId, overId) => appStore.getState().reorderTodos(activeId, overId),
  setFilter: (filter) => appStore.getState().setFilter(filter),
  setSearchQuery: (query) => appStore.getState().setSearchQuery(query),
  setSortOrder: (order) => appStore.getState().setSortOrder(order),
};
