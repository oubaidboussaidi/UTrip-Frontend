import api from "./api";

const apiPayment = {
  createCheckoutSession: (data) => api.post("/payment/create-checkout-session", data),
  confirmPayment: (sessionId) => api.get(`/payment/confirm?session_id=${sessionId}`),
};

export default apiPayment;
