import { createStore } from "zustand/vanilla";

interface RegularUser {
    type: "user"
    name: string;
    email: string;
}

interface GuestUser {
    type: "guest"
}

type User = RegularUser | GuestUser;

interface MyState {
    user: User | null
}

export const appStore = createStore<MyState>((set) => ({
    user: null,
}));

appStore.setState({ user: { type: "user", name: "John Doe", email: "[EMAIL_ADDRESS]" } });

const currentUser = appStore.getState().user;

if (currentUser) {
    currentUser;
    if (currentUser.type === "user") {
        console.log(currentUser.name);
    }

    if (currentUser.type === "guest") {
        console.log(currentUser.type);
    }

    console.warn("User not found");
}

console.log(appStore.getState().user);