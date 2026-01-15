import axios from "axios";

const apiReservation = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/reservations`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiReservation.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createReservation = (reservationData) => apiReservation.post("/create", reservationData);
export const getReservationsByEvent = (eventId) => apiReservation.get(`/event/${eventId}`);
export const getReservationsByUser = (userId) => apiReservation.get(`/user/${userId}`);

export default apiReservation;
