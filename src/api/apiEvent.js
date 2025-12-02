// src/api/apiEvent.js
import axios from "axios";

const apiEvent = axios.create({
  baseURL: "http://localhost:8080/api/events", // adjust to your backend
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
  apiEvent.post(`/create/${organizerEmail}`, eventData);

// ✅ Organizer: get organizer's own events
export const getMyEvents = (organizerEmail) => apiEvent.get(`/mine/${organizerEmail}`);

// ✅ Admin: approve event
export const approveEvent = (eventId) => apiEvent.put(`/approve/${eventId}`);

// ✅ Admin: reject event
export const rejectEvent = (eventId) => apiEvent.put(`/reject/${eventId}`);

// ✅ Admin: delete event
export const deleteEvent = (eventId) => apiEvent.delete(`/delete/${eventId}`);

// ✅ Admin: get all events
export const getAllEvents = () => apiEvent.get("/all");

// ✅ Public: get popular events
export const getPopularEvents = () => apiEvent.get("/popular");

// ✅ Public: get upcoming events
export const getUpcomingEvents = () => apiEvent.get("/upcoming");

// ✅ Public: basic events
export const getBasicEvents = () => apiEvent.get("");

export default apiEvent;
