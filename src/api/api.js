import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "";
  if (url && !url.endsWith("/api")) {
    url = url.replace(/\/+$/, "");
    url += "/api";
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(), // your backend base URL
});

// Automatically attach the JWT if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
