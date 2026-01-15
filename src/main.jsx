// src/index.jsx or src/main.jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app.jsx";
import DashboardApp from "./dashboard/DashboardApp.jsx";
import { ContextProvider } from './dashboard/contexts/ContextProvider';

import Overview from "./dashboard/pages/Overview"
import EventsAdmin from "./dashboard/pages/EventsAdmin";
import Users from "./dashboard/pages/Users";
import Calendar from "./dashboard/pages/Calendar";
import ReservationsStats from "./dashboard/pages/ReservationsStats"; // New Import
import AdminRoute from "./routes/AdminRoute"; // Kept for reference or simple usage if needed
import ProtectedRoute from "./routes/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import MyTickets from "./pages/MyTickets";
import MyEvents from "./pages/MyEvents";
import OrganizerStats from "./dashboard/pages/OrganizerStats";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import EventsPage from "./pages/Events";
import AboutUs from "./pages/AboutUs";
import RecommendedEvents from "./pages/RecommendedEvents";
import "./index.css";


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public/Home route */}
        <Route path="/" element={<App />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/recommendations" element={<RecommendedEvents />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancel />} />

        {/* User Routes */}
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/organizer-stats" element={
          <ProtectedRoute allowedRoles={['ORGANIZER']}>
            <ContextProvider>
              <OrganizerStats />
            </ContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/organizer-dashboard" element={
          <ProtectedRoute allowedRoles={['ORGANIZER']}>
            <ContextProvider>
              <OrganizerDashboard />
            </ContextProvider>
          </ProtectedRoute>
        } />

        {/* Dashboard Layout with nested routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'ORGANIZER']}>
              <DashboardApp />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />  {/* render overview by default - may need access control inside Overview or redirect */}



          <Route path="events" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EventsAdmin />
            </ProtectedRoute>
          } />

          <Route path="users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Users />
            </ProtectedRoute>
          } />

          <Route path="calendar" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Calendar />
            </ProtectedRoute>
          } />

          <Route path="reservations" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ReservationsStats />
            </ProtectedRoute>
          } />

        </Route>
      </Routes >
    </BrowserRouter >
  </React.StrictMode >,
  document.getElementById("root")
);
