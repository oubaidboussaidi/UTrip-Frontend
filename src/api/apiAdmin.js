import apiSecure from "./apiSecure";

const apiAdmin = {
  fetchAllUsers: () => apiSecure.get("/admin/users"),
  deleteUser: (email) => apiSecure.delete(`/admin/delete/${email}`),

  // EVENTS
  fetchAllEvents: () => apiSecure.get("/events/all"),       // Admin only
  approveEvent: (eventId) => apiSecure.put(`/events/approve/${eventId}`),
  deleteEvent: (eventId) => apiSecure.delete(`/events/delete/${eventId}`),
  rejectEvent: (eventId) => 
    apiSecure.put(`/events/reject/${eventId}`), // you'll need to add this API on backend
};

export default apiAdmin;
