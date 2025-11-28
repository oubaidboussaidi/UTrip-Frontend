// src/api/apiAuth.js
import axios from "axios";

const apiAuth = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

export default apiAuth;
