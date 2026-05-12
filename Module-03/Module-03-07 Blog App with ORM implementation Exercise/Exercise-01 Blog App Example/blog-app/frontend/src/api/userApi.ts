import api from "./api";
import type { ApiResponse, Post, User } from "../types";

export interface UpdateUserInput {
  name: string;
  email: string;
}

export async function getUsers() {
  const response = await api.get<ApiResponse<User[]>>("/users");
  return response.data;
}

export async function getUserById(id: number) {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, input);
  return response.data;
}

export async function getUserPosts(id: number) {
  const response = await api.get<ApiResponse<Post[]>>(`/users/${id}/posts`);
  return response.data;
}
