// src/api/apiUser.js
import axios from "axios";

const apiUser = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/user`,
});

apiUser.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiUser;
