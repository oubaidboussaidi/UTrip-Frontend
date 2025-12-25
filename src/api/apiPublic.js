import axios from "axios";

const apiPublic = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default apiPublic;
