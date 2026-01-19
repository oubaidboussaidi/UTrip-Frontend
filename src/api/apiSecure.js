// src/api/apiSecure.js
import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "";
  if (url && !url.endsWith("/api")) {
    url = url.replace(/\/+$/, "");
    url += "/api";
  }
  return url;
};

const apiSecure = axios.create({
  baseURL: getBaseUrl(),
});

// Attach token if it exists
apiSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiSecure;
