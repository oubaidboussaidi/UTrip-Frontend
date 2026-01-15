// src/api/apiAuth.js
import axios from "axios";

const apiAuth = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
});

export default apiAuth;
