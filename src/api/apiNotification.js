import axios from "axios";

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || "";
    if (url && !url.endsWith("/api")) {
        url = url.replace(/\/+$/, "");
        url += "/api";
    }
    return url;
};

const apiNotification = axios.create({
    baseURL: `${getBaseUrl()}/notifications`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiNotification.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getNotifications = (email) => apiNotification.get(`/${email}`);
export const markAsRead = (id) => apiNotification.put(`/${id}/read`);

export default apiNotification;
