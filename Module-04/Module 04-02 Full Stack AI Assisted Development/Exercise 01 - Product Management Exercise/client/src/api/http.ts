const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "pmd_token";

export type ApiEnvelope<T, M = Record<string, unknown>> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: M;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
};

export class ApiClientError extends Error {
  status: number;
  errors?: ApiEnvelope<unknown>["errors"];

  constructor(message: string, status: number, errors?: ApiEnvelope<unknown>["errors"]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T, M = Record<string, unknown>>(
  path: string,
  options: ApiRequestOptions = {}
) {
  const headers = new Headers(options.headers);
  const token = getStoredToken();

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiEnvelope<T, M>) : undefined;

  if (!response.ok || payload?.success === false) {
    throw new ApiClientError(
      payload?.message || "Request failed",
      response.status,
      payload?.errors
    );
  }

  return payload as ApiEnvelope<T, M>;
}
