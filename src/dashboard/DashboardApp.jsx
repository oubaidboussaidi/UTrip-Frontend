// src/dashboard/DashboardApp.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { ContextProvider } from "./contexts/ContextProvider";
import "@syncfusion/ej2/material.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const DashboardApp = () => {
  return (
    <ContextProvider>
      <div className="dashboard-root flex relative dark:bg-main-dark-bg">
        <Sidebar />
        <div className="dark:bg-main-dark-bg bg-main-bg min-h-screen w-full">
          <Navbar />
          <div className="p-4">
            {/* Nested route components render here */}
            <Outlet />
          </div>
        </div>
      </div>
    </ContextProvider>
  );
};

export default DashboardApp;
