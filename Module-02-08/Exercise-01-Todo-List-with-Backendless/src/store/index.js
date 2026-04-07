import { createStore } from "zustand/vanilla";
import { createAuthSlice } from "./slices/authSlice";
import { createTodoSlice } from "./slices/todoSlice";
import { createUiSlice } from "./slices/uiSlice";

export const appStore = createStore((...a) => ({
  ...createAuthSlice(...a),
  ...createTodoSlice(...a),
  ...createUiSlice(...a)
}));

appStore.getState().fetchState();

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
