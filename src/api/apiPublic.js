import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "";
  if (url && !url.endsWith("/api")) {
    url = url.replace(/\/+$/, ""); // Remove trailing slash if any
    url += "/api";
  }
  return url;
};

const apiPublic = axios.create({
  baseURL: getBaseUrl(),
});

export default apiPublic;
