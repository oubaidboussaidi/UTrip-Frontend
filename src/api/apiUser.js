// src/api/apiUser.js
import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "";
  if (url && !url.endsWith("/api")) {
    url = url.replace(/\/+$/, "");
    url += "/api";
  }
  return url;
};

const apiUser = axios.create({
  baseURL: `${getBaseUrl()}/user`,
});

apiUser.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiUser;
