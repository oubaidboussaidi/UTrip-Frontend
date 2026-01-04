import axios from "axios";

const apiNotification = axios.create({
    baseURL: "http://localhost:8080/api/notifications",
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
