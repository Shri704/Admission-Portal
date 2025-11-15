import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("❌ VITE_API_URL is not defined in the environment variables!");
}

// Ensure API_BASE_URL includes /api
let baseURL = API_BASE_URL;
if (baseURL) {
  // Remove trailing slash if present
  baseURL = baseURL.replace(/\/$/, "");
  // Add /api if not already present
  if (!baseURL.includes("/api")) {
    baseURL = `${baseURL}/api`;
  }
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admission_portal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admission_portal_token");
      localStorage.removeItem("admission_portal_user");
    }
    return Promise.reject(error);
  }
);

export default api;
