import { api } from "../../api/client";
import { arrayMove } from "@dnd-kit/sortable";

export const createTodoSlice = (set, get) => ({
    todos: [],

    addTodo: async (text) => {
      try {
        const currentTodos = get().todos;
        const minOrder = currentTodos.length ? Math.min(...currentTodos.map((t) => t.orderIndex || 0)) : 0;
        
        const newTodo = {
          text,
          orderIndex: minOrder - 1,
        };

        const res = await api.post("/todos", newTodo);
        const savedTodo = res.data;

        const updatedTodos = [savedTodo, ...currentTodos]
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

        set({ todos: updatedTodos });
      } catch (error) {
        console.error("Add Todo Error:", error);
      }
    },
    
    toggleTodo: async (id) => {
      const currentTodos = get().todos;
      const todoToToggle = currentTodos.find((t) => t.id === id);
      if (!todoToToggle) return;

      const updatedStatus = !todoToToggle.completed;
      
      set({ todos: currentTodos.map((t) => (t.id === id ? { ...t, completed: updatedStatus } : t)) });

      try {
        await api.patch(`/todos/${id}`, { completed: updatedStatus });
      } catch (error) {
        console.error("Toggle Todo Error:", error);
        set({ todos: currentTodos }); // Revert
      }
    },
    
    deleteTodo: async (id) => {
      const currentTodos = get().todos;
      set({ todos: currentTodos.filter((t) => t.id !== id) });

      try {
        await api.delete(`/todos/${id}`);
      } catch (error) {
        console.error("Delete Todo Error:", error);
        set({ todos: currentTodos }); // Revert
      }
    },
    
    clearCompleted: async () => {
      const currentTodos = get().todos;
      const activeTodos = currentTodos.filter((t) => !t.completed);
      const completedTodos = currentTodos.filter((t) => t.completed);
      
      if (completedTodos.length === 0) return;

      set({ todos: activeTodos });

      try {
        await api.delete("/todos/completed/bulk");
      } catch (error) {
        console.error("Clear Completed Error:", error);
        set({ todos: currentTodos }); // Revert
      }
    },
    
    editTodo: async (id, text) => {
      const currentTodos = get().todos;
      set({ todos: currentTodos.map((t) => (t.id === id ? { ...t, text } : t)) });

      try {
        await api.patch(`/todos/${id}`, { text });
      } catch (error) {
        console.error("Edit Todo Error:", error);
        set({ todos: currentTodos }); // Revert
      }
    },
    
    reorderTodos: async (activeId, overId) => {
      let todos = [...get().todos];
      const oldIndex = todos.findIndex((item) => item.id === activeId);
      const newIndex = todos.findIndex((item) => item.id === overId);
      
      todos = arrayMove(todos, oldIndex, newIndex);
      todos = todos.map((t, index) => ({ ...t, orderIndex: index }));
      
      set({ todos });

      try {
        await Promise.all(
          todos.map((t) => api.patch(`/todos/${t.id}`, { orderIndex: t.orderIndex }))
        );
      } catch (error) {
         console.error("Reorder Todos Error:", error);
      }
    }
});
