import { useAuthStore, userAction } from "./zustand-login-state";

userAction.login({
    name: "John Doe",
    email: "john.doe@email.com",
});
console.log(useAuthStore.getState().user);

userAction.logout();
console.log(useAuthStore.getState().user);

userAction.editUser({
    name: "Jane Doe",
    email: "jane.doe@gmail.com",
});
console.log(useAuthStore.getState().user);