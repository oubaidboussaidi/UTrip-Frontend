// src/api/apiUser.js
import axios from "axios";

const apiUser = axios.create({
  baseURL: "http://localhost:8080/api/user",
});

apiUser.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiUser;
