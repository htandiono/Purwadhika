import axios from "axios";

export const api = axios.create({
  baseURL: `http://localhost:8000`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Autoinject user-token into all requests if we are logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user-token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
