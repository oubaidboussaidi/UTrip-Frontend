// src/dashboard/pages/Overview.jsx
import React, { useState, useEffect } from 'react';
import { BsCurrencyDollar, BsFillCalendarEventFill, BsHourglassSplit, BsCheckCircle, BsXCircle, BsPeople } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';
import apiAdmin from '../../api/apiAdmin';

const Overview = () => {
  const { currentColor } = useStateContext();
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    revenue: 0,
    totalUsers: 0,
    totalOrganizers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
  try {
    // FETCH EVENTS
    const { data: events } = await apiAdmin.fetchAllEvents();
    const totalEvents = events.length;
    const pending = events.filter(e => e.status === 'PENDING').length;
    const approved = events.filter(e => e.status === 'APPROVED').length;
    const rejected = events.filter(e => e.status === 'REJECTED').length;

    // Calculate revenue as 10% of each approved event's price
    const revenuePercentage = 0.1; // 10% tax/commission
    const revenue = events
      .filter(e => e.status === 'APPROVED')
      .reduce((sum, e) => sum + e.price * revenuePercentage, 0);

    // FETCH USERS
    const res = await apiAdmin.fetchAllUsers();
    const users = res.data.map(u => ({ ...u, role: u.role.toUpperCase() }));
    const totalUsers = users.filter(u => u.role === 'USER').length;
    const totalOrganizers = users.filter(u => u.role === 'ORGANIZER').length;

    setDashboardData({
      totalEvents,
      pending,
      approved,
      rejected,
      revenue,
      totalUsers,
      totalOrganizers,
    });
  } catch (err) {
    alert("⚠️ Could not fetch dashboard data");
    console.error(err);
  }
};

  const eventCards = [
    {
      title: 'Total Events',
      amount: dashboardData.totalEvents,
      icon: <BsFillCalendarEventFill />,
      iconColor: '#4CAF50',
      iconBg: '#E8F5E9',
    },
    {
      title: 'Pending Approvals',
      amount: dashboardData.pending,
      icon: <BsHourglassSplit />,
      iconColor: '#FFC107',
      iconBg: '#FFF8E1',
    },
    {
      title: 'Approved Events',
      amount: dashboardData.approved,
      icon: <BsCheckCircle />,
      iconColor: '#4CAF50',
      iconBg: '#E8F5E9',
    },
    {
      title: 'Rejected Events',
      amount: dashboardData.rejected,
      icon: <BsXCircle />,
      iconColor: '#F44336',
      iconBg: '#FFEBEE',
    },
    {
      title: 'Total Revenue',
      amount: `$${dashboardData.revenue}`,
      icon: <BsCurrencyDollar />,
      iconColor: '#2196F3',
      iconBg: '#E3F2FD',
    },
  ];

  const userCards = [
    {
      title: 'Total Users',
      amount: dashboardData.totalUsers,
      icon: <BsPeople />,
      iconColor: '#9C27B0',
      iconBg: '#F3E5F5',
    },
    {
      title: 'Total Organizers',
      amount: dashboardData.totalOrganizers,
      icon: <BsPeople />,
      iconColor: '#FF5722',
      iconBg: '#FBE9E7',
    },
  ];

  const renderCards = (cards) => (
    <div className="flex flex-wrap justify-center gap-3 m-3">
      {cards.map((item) => (
        <div
          key={item.title}
          className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 h-44 p-4 pt-9 rounded-2xl shadow"
        >
          <button
            type="button"
            style={{ color: item.iconColor, backgroundColor: item.iconBg }}
            className="text-3xl rounded-full p-4 hover:drop-shadow-xl"
          >
            {item.icon}
          </button>
          <p className="mt-4 text-xl font-bold text-gray-900">{item.amount}</p>
          <p className="text-lg text-gray-800 mt-1">{item.title}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-24">
      {/* EVENTS ROW */}
      {renderCards(eventCards)}

      {/* USERS ROW */}
      {renderCards(userCards)}
    </div>
  );
};

export default Overview;
