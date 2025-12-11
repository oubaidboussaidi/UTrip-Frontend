import api from "./api";

const apiTicket = {
    getMyTickets: () => api.get("/tickets/my-tickets"),
};

export default apiTicket;
