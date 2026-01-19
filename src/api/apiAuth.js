// src/api/apiAuth.js
import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "";
  if (url && !url.endsWith("/api")) {
    url = url.replace(/\/+$/, "");
    url += "/api";
  }
  return url;
};

const apiAuth = axios.create({
  baseURL: `${getBaseUrl()}/auth`,
});

export default apiAuth;
