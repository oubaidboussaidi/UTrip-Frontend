// src/api/apiEvent.js
import axios from "axios";

const apiEvent = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/events`, // adjust to your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to Authorization header if present
apiEvent.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Public: get approved events
export const getApprovedEvents = () => apiEvent.get("/approved");

// ✅ Organizer: create event
export const createEvent = (organizerEmail, eventData) =>
  apiEvent.post(`/create?organizerEmail=${organizerEmail}`, eventData);

// ✅ Organizer: get organizer's own events
export const getMyEvents = (organizerEmail) => apiEvent.get(`/organizer/${organizerEmail}`);

// ✅ Admin: approve event
export const approveEvent = (eventId) => apiEvent.put(`/approve/${eventId}`);

// ✅ Admin: reject event
export const rejectEvent = (eventId) => apiEvent.put(`/reject/${eventId}`);

// ✅ Admin/Organizer: delete event
export const deleteEvent = (eventId) => apiEvent.delete(`/${eventId}`);

// ✅ Organizer: update event
export const updateEvent = (eventId, eventData) => apiEvent.put(`/${eventId}`, eventData);

// ✅ Admin: get all events
export const getAllEvents = () => apiEvent.get("/all");

// ✅ Public: get popular events
export const getPopularEvents = () => apiEvent.get("/popular");

// ✅ Public: get upcoming events
export const getUpcomingEvents = () => apiEvent.get("/upcoming");

// ✅ Public: basic events
export const getBasicEvents = () => apiEvent.get("");

// ✅ Public: Search events
export const searchEvents = (params) => apiEvent.get("/search", { params });

export default apiEvent;
