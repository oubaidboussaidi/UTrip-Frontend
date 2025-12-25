import api from "./api";

const apiTicket = {
    getMyTickets: () => api.get("/tickets/my-tickets"),
    getOrganizerAnalytics: (email) => api.get(`/tickets/organizer/analytics/${email}`),
};

export default apiTicket;
