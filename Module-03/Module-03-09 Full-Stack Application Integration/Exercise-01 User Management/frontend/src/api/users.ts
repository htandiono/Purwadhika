import axios from "axios";
import type { UserFormData } from "../validations/user.validation";

export type User = {
  id: number;
  name: string;
  email: string;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});

export const getUsers = async () => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const createUser = async (data: UserFormData) => {
  const response = await api.post<User>("/users", data);
  return response.data;
};

export const updateUser = async (id: number, data: UserFormData) => {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};
