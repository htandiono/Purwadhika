import { createStore } from "zustand/vanilla";

interface User {
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export const useAuthStore = createStore<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (userData: User) => set({ user: userData, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    editUser: (userData: User) => set({ user: userData }),
}));

export const userAction = {
    login: (userData: User) => useAuthStore.setState({ user: userData, isAuthenticated: true }),
    logout: () => useAuthStore.setState({ user: null, isAuthenticated: false }),
    editUser: (userData: User) => useAuthStore.setState({ user: userData }),
}