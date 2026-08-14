import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error normaliser
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || "Something went wrong";
    if (err.response?.status === 401 && !location.pathname.startsWith("/login")) {
      localStorage.removeItem("bp_token");
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
