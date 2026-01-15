import axios from "axios";

const apiTicket = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Base URL updated to /api to handle both /tickets and /ticket-types
    headers: {
        "Content-Type": "application/json",
    },
});

apiTicket.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Ticket Types (Organizer Management) ---
export const createTicketType = (ticketType) => apiTicket.post("/ticket-types", ticketType);
export const getTicketTypesByEvent = (eventId) => apiTicket.get(`/ticket-types/event/${eventId}`);
export const updateTicketType = (id, ticketType) => apiTicket.put(`/ticket-types/${id}`, ticketType);

// --- Actual Tickets (User/Buyer) ---
export const getMyTickets = () => apiTicket.get("/tickets/my-tickets");
export const getOrganizerAnalytics = (email) => apiTicket.get(`/tickets/organizer/analytics/${email}`);

export default {
    createTicketType,
    getTicketTypesByEvent,
    updateTicketType,
    getMyTickets,
    getOrganizerAnalytics
};
