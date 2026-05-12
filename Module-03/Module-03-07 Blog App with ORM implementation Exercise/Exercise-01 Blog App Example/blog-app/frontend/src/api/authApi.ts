import api from "./api";
import type { ApiResponse, AuthData, User } from "../types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput) {
  const response = await api.post<ApiResponse<User>>("/auth/register", input);
  return response.data;
}

export async function login(input: LoginInput) {
  const response = await api.post<ApiResponse<AuthData>>("/auth/login", input);
  return response.data;
}
