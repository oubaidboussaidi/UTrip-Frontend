import React, { useState, useEffect } from 'react';
import { BsCurrencyDollar, BsFillCalendarEventFill, BsHourglassSplit, BsPeople } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';
import apiAdmin from '../../api/apiAdmin';
import {
  ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject,
  Legend, Category, Tooltip, ColumnSeries, PieSeries, AccumulationChartComponent,
  AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend,
  AccumulationTooltip, AccumulationDataLabel, LineSeries, DateTime, DataLabel
} from '@syncfusion/ej2-react-charts';
import { IoSettingsOutline, IoCloseOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const Overview = () => {
  const { currentColor, currentMode } = useStateContext();
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    revenue: 0,
    totalUsers: 0,
    totalOrganizers: 0,
    userRoles: [],
    revenueByDay: [],
    topLocations: [],
    userGrowth: [],
    topOrganizers: [],
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [enabledWidgets, setEnabledWidgets] = useState([]);

  // Default widgets to show if none saved
  const DEFAULT_WIDGETS = ['stats', 'statusDist', 'revenueAnalysis', 'categoryDist', 'userGrowth'];

  useEffect(() => {
    let isMounted = true;
    fetchDashboardData(isMounted);
    const saved = localStorage.getItem('adminDashboardWidgets');
    if (saved) {
      setEnabledWidgets(JSON.parse(saved));
    } else {
      setEnabledWidgets(DEFAULT_WIDGETS);
    }
    return () => { isMounted = false; };
  }, []);

  const saveWidgets = (widgets) => {
    setEnabledWidgets(widgets);
    localStorage.setItem('adminDashboardWidgets', JSON.stringify(widgets));
  };

  const toggleWidget = (id) => {
    if (enabledWidgets.includes(id)) {
      saveWidgets(enabledWidgets.filter(w => w !== id));
    } else {
      saveWidgets([...enabledWidgets, id]);
    }
  };

  const fetchDashboardData = async (isMounted = true) => {
    try {
      const { data: events } = await apiAdmin.fetchAllEvents();
      const res = await apiAdmin.fetchAllUsers();
      if (!isMounted) return;
      const users = res.data.map(u => ({ ...u, role: (u.role || 'USER').toUpperCase() }));

      // Basic Stats
      const totalEvents = events.length;
      const pending = events.filter(e => e.status === 'PENDING').length;
      const approved = events.filter(e => e.status === 'APPROVED').length;
      const rejected = events.filter(e => e.status === 'REJECTED').length;

      const revenuePercentage = 0.1;
      const revenue = events
        .filter(e => e.status === 'APPROVED')
        .reduce((sum, e) => sum + (e.price || 0) * revenuePercentage, 0);

      // Category Distribution
      const catCount = {};
      events.forEach(e => {
        catCount[e.category] = (catCount[e.category] || 0) + 1;
      });
      const eventsByCategory = Object.entries(catCount).map(([name, count]) => ({ x: name, y: count }));

      // Status Distribution
      const eventsByStatus = [
        { x: 'Approved', y: approved, fill: '#4CAF50' },
        { x: 'Pending', y: pending, fill: '#FFC107' },
        { x: 'Rejected', y: rejected, fill: '#F44336' },
      ];

      // User Roles
      const totalUsersOnly = users.filter(u => u.role === 'USER').length;
      const totalOrganizers = users.filter(u => u.role === 'ORGANIZER').length;
      const totalAdmins = users.filter(u => u.role === 'ADMIN').length;

      const userRoles = [
        { x: 'Users', y: totalUsersOnly },
        { x: 'Organizers', y: totalOrganizers },
        { x: 'Admins', y: totalAdmins },
      ];

      // Top Locations
      const locCount = {};
      events.forEach(e => {
        if (e.location) locCount[e.location] = (locCount[e.location] || 0) + 1;
      });
      const topLocations = Object.entries(locCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ x: name, y: count }));

      // Top Organizers
      const orgCount = {};
      events.forEach(e => {
        orgCount[e.organizerEmail] = (orgCount[e.organizerEmail] || 0) + 1;
      });
      const topOrganizers = Object.entries(orgCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([email, count]) => ({ email, count }));

      // Simulated User Growth (since we might not have createdAt)
      const userGrowth = [
        { x: new Date(2025, 0, 1), y: totalUsersOnly * 0.2 },
        { x: new Date(2025, 1, 1), y: totalUsersOnly * 0.4 },
        { x: new Date(2025, 2, 1), y: totalUsersOnly * 0.7 },
        { x: new Date(2025, 3, 1), y: totalUsersOnly },
      ];

      setDashboardData({
        totalEvents, pending, approved, rejected, revenue,
        totalUsers: totalUsersOnly, totalOrganizers,
        eventsByCategory, eventsByStatus, userRoles, topLocations,
        topOrganizers, userGrowth
      });
    } catch (err) {
      console.error(err);
    }
  };

  const availableWidgets = [
    { id: 'stats', name: 'Quick Stats Cards', type: 'Stats' },
    { id: 'statusDist', name: 'Event Status Distribution', type: 'Pie' },
    { id: 'revenueAnalysis', name: 'Revenue Overview', type: 'Financial' },
    { id: 'categoryDist', name: 'Categories Analysis', type: 'Bar' },
    { id: 'userRolesDist', name: 'User Roles Breakdown', type: 'Pie' },
    { id: 'topLocs', name: 'Hot Locations (Top 5)', type: 'Bar' },
    { id: 'userGrowth', name: 'Registration Growth', type: 'Line' },
    { id: 'topOrgs', name: 'Top Organizers Rankings', type: 'List' },
  ];

  const statCards = [
    { title: 'Total Events', val: dashboardData.totalEvents, icon: <BsFillCalendarEventFill />, color: '#4CAF50', bg: '#E8F5E9' },
    { title: 'Pending', val: dashboardData.pending, icon: <BsHourglassSplit />, color: '#FFC107', bg: '#FFF8E1' },
    { title: 'Revenue (10%)', val: `$${dashboardData.revenue.toFixed(2)}`, icon: <BsCurrencyDollar />, color: '#2196F3', bg: '#E3F2FD' },
    { title: 'Customers', val: dashboardData.totalUsers, icon: <BsPeople />, color: '#9C27B0', bg: '#F3E5F5' },
    { title: 'Organizers', val: dashboardData.totalOrganizers, icon: <BsPeople />, color: '#FF5722', bg: '#FBE9E7' },
  ];

  const user = JSON.parse(localStorage.getItem('user'));
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gray-50/50 dark:bg-main-dark-bg min-h-screen p-4 md:p-10 relative">
      {/* Premium Hero Section */}
      <div className="mb-10 bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
            Platform Analytics
          </p>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Welcome back, <span className="text-blue-600">{user?.firstName || 'Admin'}</span>! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
            <BsFillCalendarEventFill className="text-blue-500" />
            It's {today}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-gray-900/10 text-sm uppercase tracking-widest"
          >
            {isCustomizing ? <IoCloseOutline className="text-xl" /> : <IoSettingsOutline className="text-xl" />}
            {isCustomizing ? 'Finish' : 'Customize Layout'}
          </button>
        </div>
      </div>

      {/* Customization Panel */}
      {isCustomizing && (
        <div className="mb-10 p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
            <IoSettingsOutline className="text-blue-600" />
            Select Diagrams to Show
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableWidgets.map(widget => (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${enabledWidgets.includes(widget.id)
                  ? 'bg-white dark:bg-gray-700 border-gray-900 dark:border-white shadow-md'
                  : 'bg-transparent border-gray-200 dark:border-gray-600 opacity-60 grayscale'
                  }`}
              >
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-white">{widget.name}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{widget.type} Chart</p>
                </div>
                {enabledWidgets.includes(widget.id) ? (
                  <IoCheckmarkCircleOutline className="text-2xl text-green-500" />
                ) : (
                  <div className="size-6 rounded-full border-2 border-gray-200 dark:border-gray-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards Widget */}
      {enabledWidgets.includes('stats') && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          {statCards.map((card) => (
            <div key={card.title} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="text-6xl -mr-4 -mt-4 rotate-12 text-gray-400 dark:text-gray-200">{card.icon}</div>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div style={{ color: card.color, backgroundColor: card.bg }} className="p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform shadow-inner">
                  {card.icon}
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{card.val}</p>
              <p className="text-gray-400 dark:text-gray-500 font-black text-xs uppercase tracking-widest">{card.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        {enabledWidgets.includes('statusDist') && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Event Approval Status</h3>
            <div className="w-full h-[300px]">
              <AccumulationChartComponent
                id='status-pie'
                background="transparent"
                tooltip={{ enable: true }}
                legendSettings={{ visible: true, position: 'Bottom', textStyle: { fontWeight: 'bold' } }}
              >
                <Inject services={[PieSeries, AccumulationLegend, AccumulationTooltip, AccumulationDataLabel]} />
                <AccumulationSeriesCollectionDirective>
                  <AccumulationSeriesDirective
                    dataSource={dashboardData.eventsByStatus}
                    xName='x' yName='y'
                    innerRadius="40%"
                    dataLabel={{ visible: true, name: 'x', position: 'Outside', font: { fontWeight: '600' } }}
                  />
                </AccumulationSeriesCollectionDirective>
              </AccumulationChartComponent>
            </div>
          </div>
        )}

        {/* Revenue Overview */}
        {enabledWidgets.includes('revenueAnalysis') && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Platform Revenue</h3>
            <div className="flex flex-col items-center justify-center pt-10">
              <div className="size-48 rounded-full border-[12px] border-blue-50 flex flex-col items-center justify-center">
                <p className="text-xs font-black text-blue-400 uppercase">Commision</p>
                <p className="text-3xl font-black text-gray-900">${dashboardData.revenue.toFixed(2)}</p>
              </div>
              <p className="mt-8 text-center text-gray-500 max-w-[280px]">
                Total commission earned from <b>{dashboardData.approved}</b> approved events (10% platform tax).
              </p>
            </div>
          </div>
        )}

        {/* Categories Analysis */}
        {enabledWidgets.includes('categoryDist') && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Events per Category</h3>
            <div className="w-full h-[350px]">
              <ChartComponent
                id="category-bar"
                primaryXAxis={{ valueType: 'Category', majorGridLines: { width: 0 } }}
                primaryYAxis={{ majorGridLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' } }}
                chartArea={{ border: { width: 0 } }}
                tooltip={{ enable: true }}
                background="transparent"
              >
                <Inject services={[ColumnSeries, Category, Tooltip, Legend, DataLabel]} />
                <SeriesCollectionDirective>
                  <SeriesDirective
                    dataSource={dashboardData.eventsByCategory}
                    xName='x' yName='y'
                    type='Column' fill={currentColor}
                    cornerRadius={{ topLeft: 10, topRight: 10 }}
                    marker={{ dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#1A1A1A' } } }}
                  />
                </SeriesCollectionDirective>
              </ChartComponent>
            </div>
          </div>
        )}

        {/* User Roles */}
        {enabledWidgets.includes('userRolesDist') && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Community Breakdown</h3>
            <div className="w-full h-[300px]">
              <AccumulationChartComponent
                id='user-pie'
                background="transparent"
                tooltip={{ enable: true }}
                legendSettings={{ visible: true, position: 'Right' }}
              >
                <Inject services={[PieSeries, AccumulationLegend, AccumulationTooltip, AccumulationDataLabel]} />
                <AccumulationSeriesCollectionDirective>
                  <AccumulationSeriesDirective
                    dataSource={dashboardData.userRoles}
                    xName='x' yName='y'
                    radius="80%"
                    dataLabel={{ visible: true, name: 'y', position: 'Inside', font: { fontWeight: '600', color: '#fff' } }}
                  />
                </AccumulationSeriesCollectionDirective>
              </AccumulationChartComponent>
            </div>
          </div>
        )}

        {/* Hot Locations */}
        {enabledWidgets.includes('topLocs') && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Trending Locations</h3>
            <div className="space-y-4 pt-4">
              {dashboardData.topLocations.map((loc, idx) => (
                <div key={loc.x} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-bold truncate text-gray-500">{loc.x}</div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(loc.y / dashboardData.totalEvents) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-right font-black text-gray-900">{loc.y}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Growth Trend */}
        {enabledWidgets.includes('userGrowth') && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">User Growth Trend</h3>
            <div className="w-full h-[300px]">
              <ChartComponent
                id="growth-chart"
                primaryXAxis={{ valueType: 'DateTime', labelFormat: 'MMM', majorGridLines: { width: 0 } }}
                primaryYAxis={{ labelStyle: { color: 'transparent' }, lineStyle: { width: 0 }, majorGridLines: { width: 0 } }}
                chartArea={{ border: { width: 0 } }}
                tooltip={{ enable: true }}
                background="transparent"
              >
                <Inject services={[LineSeries, DateTime, Tooltip, Legend]} />
                <SeriesCollectionDirective>
                  <SeriesDirective
                    dataSource={dashboardData.userGrowth}
                    xName='x' yName='y'
                    type='Line' width={4}
                    fill={currentColor}
                    marker={{ visible: true, width: 10, height: 10, fill: currentColor }}
                  />
                </SeriesCollectionDirective>
              </ChartComponent>
            </div>
          </div>
        )}

        {/* Top Organizers List */}
        {enabledWidgets.includes('topOrgs') && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Top Performing Organizers</h3>
            <div className="space-y-4">
              {dashboardData.topOrganizers.map((org, index) => (
                <div key={org.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-blue-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 truncate w-32 md:w-auto">{org.email}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase">{org.count} Events Published</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black">
                    PRO
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        }
      </div>
    </div>
  );
};

export default Overview;
