export type UserRole = "USER" | "ADMIN" | "MANAGER" | "VIEWER";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  name: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
