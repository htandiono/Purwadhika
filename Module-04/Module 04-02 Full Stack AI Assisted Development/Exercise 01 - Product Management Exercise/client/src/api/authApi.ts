import { apiRequest } from "./http";
import { AuthPayload, AuthResponse, RegisterPayload, User } from "../types/auth";

export const authApi = {
  register(payload: RegisterPayload) {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload
    });
  },
  login(payload: AuthPayload) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload
    });
  },
  me() {
    return apiRequest<User>("/auth/me");
  }
};
