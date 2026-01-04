// src/dashboard/DashboardApp.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { ContextProvider, useStateContext } from "./contexts/ContextProvider";
import "@syncfusion/ej2/material.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const DashboardLayout = () => {
  const { activeMenu } = useStateContext();

  return (
    <div className="flex relative dark:bg-main-dark-bg bg-white min-h-screen">
      {/* Sidebar container with fixed positioning logic */}
      <div
        className={`fixed sidebar transition-all duration-300 z-50 bg-gray-100 dark:bg-gray-800 h-screen ${activeMenu ? 'w-72' : 'w-0 overflow-hidden'
          }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${activeMenu ? 'md:ml-72' : 'ml-0'
          }`}
      >
        {/* Header/Navbar Area - Fixed at the top */}
        <div
          className={`fixed top-0 z-40 transition-all duration-300 ${activeMenu ? 'md:left-72 left-0' : 'left-0'
            } right-0`}
        >
          <Navbar />
        </div>

        {/* Page Content - Offset by Navbar height */}
        <div className="flex-1 bg-white dark:bg-main-dark-bg overflow-x-hidden pt-16">
          <div className="p-0 md:p-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardApp = () => {
  return (
    <ContextProvider>
      <DashboardLayout />
    </ContextProvider>
  );
};

export default DashboardApp;
