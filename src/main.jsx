// src/index.jsx or src/main.jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app.jsx";
import DashboardApp from "./dashboard/DashboardApp.jsx";

import Overview from "./dashboard/pages/Overview"
import EventsAdmin from "./dashboard/pages/EventsAdmin";
import Employees from "./dashboard/pages/Employees";
import Users from "./dashboard/pages/Users";
import Calendar from "./dashboard/pages/Calendar";
import Kanban from "./dashboard/pages/Kanban";
import Line from "./dashboard/pages/Charts/Line";
import Area from "./dashboard/pages/Charts/Area";
import Bar from "./dashboard/pages/Charts/Bar";
import Pie from "./dashboard/pages/Charts/Pie";
import AdminRoute from "./routes/AdminRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import MyTickets from "./pages/MyTickets";
import MyEvents from "./pages/MyEvents";
import "./index.css";


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public/Home route */}
        <Route path="/" element={<App />} />

        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancel />} />

        {/* User Routes */}
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/my-events" element={<MyEvents />} />

        {/* Dashboard Layout with nested routes */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardApp />
            </AdminRoute>
          }
        >
          <Route index element={<Overview />} />  {/* renders at /dashboard */}
          <Route path="events" element={<EventsAdmin />} />
          <Route path="employees" element={<Employees />} />
          <Route path="users" element={<Users />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="line" element={<Line />} />
          <Route path="area" element={<Area />} />
          <Route path="bar" element={<Bar />} />
          <Route path="pie" element={<Pie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
