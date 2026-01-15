import axios from "axios";

const apiStats = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/stats`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiStats.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("🔍 API Stats Request Debug:");
    console.log("- Token exists:", !!token);
    console.log("- Token (first 50 chars):", token ? token.substring(0, 50) + "..." : "NO TOKEN");

    if (token) {
        // Decode and log the token payload
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("- Email in token:", payload.sub);
            console.log("- Role in token:", payload.role);
        } catch (e) {
            console.error("- Error decoding token:", e);
        }
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("⚠️ NO TOKEN FOUND IN LOCALSTORAGE!");
    }
    console.log("- URL:", config.baseURL + config.url);
    return config;
});

apiStats.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("❌ API Stats Error:");
        console.error("- Status:", error.response?.status);
        console.error("- Status Text:", error.response?.statusText);
        console.error("- URL:", error.config?.url);
        console.error("- Method:", error.config?.method);
        console.error("- Headers sent:", error.config?.headers);
        console.error("- Response data:", error.response?.data);
        return Promise.reject(error);
    }
);

export const getOrganizerStats = (email) => apiStats.get(`/organizer/${email}`);
export const incrementView = (eventId) => apiStats.put(`/view/${eventId}`);
export const getPublicStats = () => apiStats.get("/public");

export default apiStats;
