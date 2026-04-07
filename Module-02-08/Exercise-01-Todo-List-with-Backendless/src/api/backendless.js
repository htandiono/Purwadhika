import axios from "axios";

const APP_ID = "48917F4A-6E86-4D88-B3E6-E80D143F86F7";
const REST_API_KEY = "CA742C9F-0896-4D19-8B90-BBE9CE2CF712";

export const api = axios.create({
  baseURL: `https://api.backendless.com/${APP_ID}/${REST_API_KEY}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Autoinject user-token into all requests if we are logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user-token");
  if (token) {
    config.headers["user-token"] = token;
  }
  return config;
});
