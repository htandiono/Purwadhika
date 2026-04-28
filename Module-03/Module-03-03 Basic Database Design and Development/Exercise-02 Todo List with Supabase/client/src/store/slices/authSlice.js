import { api } from "../../api/client";

export const createAuthSlice = (set, get) => ({
  isAuthReady: false,
  currentUserEmail: null,
  currentUserName: null,

  // Fetch state manually (Called on app load)
  fetchState: async () => {
    const token = localStorage.getItem("user-token");

    if (!token) {
      set({ isAuthReady: true });
      return;
    }

    try {
      const userRes = await api.get('/auth/me');
      const res = await api.get("/todos");

      set({
        currentUserEmail: userRes.data.email,
        currentUserName: userRes.data.name,
        todos: res.data,
        isAuthReady: true
      });
    } catch (error) {
      console.error("Session restore failed or invalid token", error);
      localStorage.removeItem("user-token");
      set({ isAuthReady: true, currentUserEmail: null, currentUserName: null, todos: [] });
    }
  },

  login: async (email, password) => {
    try {
      const userRes = await api.post("/login", { email, password });
      const { token, user } = userRes.data;

      localStorage.setItem("user-token", token);

      const todosRes = await api.get("/todos");

      set({
        currentUserEmail: user.email,
        currentUserName: user.name,
        todos: todosRes.data
      });
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      await api.post("/register", { name, email, password });
      return await get().login(email, password);
    } catch (error) {
      console.error("Register Error:", error);
      return false;
    }
  },

  logout: async () => {
    localStorage.removeItem("user-token");
    set({ currentUserEmail: null, currentUserName: null, todos: [], filter: "All", searchQuery: "", sortOrder: "newest" });
  },

  editUser: async (name, password) => {
    console.warn("editUser not implemented in backend yet");
  }
});
