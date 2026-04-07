import { api } from "../../api/backendless";

export const createAuthSlice = (set, get) => ({
  isAuthReady: false,
  currentUserEmail: null,
  currentUserName: null,

  // Fetch state manually (Called on app load)
  fetchState: async () => {
    const token = localStorage.getItem("user-token");
    const email = localStorage.getItem("user-email");
    const name = localStorage.getItem("user-name");

    if (!token || !email) {
      set({ isAuthReady: true });
      return;
    }

    try {
      await api.get(`/users/isvalidusertoken/${token}`);
      const res = await api.get("/data/Todo", {
        params: { sortBy: "orderIndex ASC" }
      });

      set({
        currentUserEmail: email,
        currentUserName: name,
        todos: res.data.map((t) => ({ ...t, id: t.objectId })),
        isAuthReady: true
      });
    } catch (error) {
      console.error("Session restore failed or invalid token", error);
      localStorage.removeItem("user-token");
      localStorage.removeItem("user-email");
      localStorage.removeItem("user-id");
      localStorage.removeItem("user-name");
      set({ isAuthReady: true, currentUserEmail: null, currentUserName: null, todos: [] });
    }
  },

  login: async (email, password) => {
    try {
      const userRes = await api.post("/users/login", { login: email, password });
      const user = userRes.data;

      localStorage.setItem("user-token", user["user-token"]);
      localStorage.setItem("user-email", user.email);
      localStorage.setItem("user-id", user.objectId);
      if (user.name) localStorage.setItem("user-name", user.name);

      const todosRes = await api.get("/data/Todo", { params: { sortBy: "orderIndex ASC" } });

      set({
        currentUserEmail: user.email,
        currentUserName: user.name,
        todos: todosRes.data.map((t) => ({ ...t, id: t.objectId }))
      });
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      await api.post("/users/register", { name, email, password });
      return await get().login(email, password);
    } catch (error) {
      console.error("Register Error:", error);
      return false;
    }
  },

  logout: async () => {
    try {
      await api.get("/users/logout");
    } catch (error) {
      console.error("Logout Error:", error);
    }
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-id");
    localStorage.removeItem("user-name");
    set({ currentUserEmail: null, currentUserName: null, todos: [], filter: "All", searchQuery: "", sortOrder: "newest" });
  },

  editUser: async (name, password) => {
    try {
      const userId = localStorage.getItem("user-id");
      if (!userId) return;
      const updates = {};
      if (name) updates.name = name;
      if (password) updates.password = password;
      const res = await api.put(`/data/Users/${userId}`, updates);
      if (res.data.name) {
        localStorage.setItem("user-name", res.data.name);
        set({ currentUserName: res.data.name });
      }
    } catch (error) {
      console.error("Update User Error:", error);
    }
  }
});
