import React, { useState, useEffect } from 'react';
import {
    ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject,
    LineSeries, DateTime, Legend, Tooltip
} from '@syncfusion/ej2-react-charts';

import { BsCurrencyDollar, BsCalendarCheck, BsHeartFill } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';
import { Header } from '../components';

const OrganizerStats = ({ organizerEmail, embedded = false, statsData = null }) => {
    const { currentMode } = useStateContext();

    const [stats, setStats] = useState(statsData);
    const [loading, setLoading] = useState(!statsData);

    const user = JSON.parse(localStorage.getItem("user"));
    const emailToUse = organizerEmail || user?.email;

    useEffect(() => {
        if (statsData) {
            setStats(statsData);
            setLoading(false);
            return;
        }
        if (!emailToUse) return;
        const fetchData = async () => {
            try {
                const { data } = await getOrganizerStats(emailToUse);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch statistics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [emailToUse]);

    if (loading) return (
        <div className={embedded ? "flex justify-center items-center h-64" : "min-h-screen bg-gray-50/50 dark:bg-main-dark-bg text-gray-900 dark:text-white"}>
            {!embedded && <Navbar />}
            <div className={embedded ? "" : "pt-32 text-center"}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-400 font-medium">Loading analytics...</p>
            </div>
        </div>
    );

    if (!stats) return (
        <div className={embedded ? "p-10 text-center" : "min-h-screen bg-gray-50/50 dark:bg-main-dark-bg text-gray-900 dark:text-white"}>
            {!embedded && <Navbar />}
            <div className={embedded ? "" : "pt-32 text-center"}>
                <p className="text-gray-400 text-lg">No statistics available yet.</p>
                <p className="text-sm text-gray-400 mt-2">Start creating events to see your performance!</p>
            </div>
        </div>
    );

    // Prepare Chart Data
    const revenueChartData = stats?.revenueOverTime
        ? Object.entries(stats.revenueOverTime).map(([date, amount]) => ({ x: new Date(date), y: amount }))
        : [];

    return (
        <div className={embedded ? "" : "min-h-screen bg-gray-50/50 dark:bg-main-dark-bg text-gray-900 dark:text-white p-4 md:p-10 pb-20 mt-16"}>
            {!embedded && <Navbar />}

            <div className={embedded ? "" : "max-w-7xl mx-auto"}>
                {/* Standardized Header */}
                {!embedded && (
                    <Header category="Organizer" title="My Performance" />
                )}

                {!embedded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Total Revenue */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                            <div className="flex items-center gap-4">
                                <button type="button" style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }} className="text-2xl rounded-full p-4">
                                    <BsCurrencyDollar />
                                </button>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">{(stats.totalRevenue || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                                    <p className="text-sm text-gray-400 mt-1">Total Revenue</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Reservations */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                            <div className="flex items-center gap-4">
                                <button type="button" style={{ color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)' }} className="text-2xl rounded-full p-4">
                                    <BsCalendarCheck />
                                </button>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">{stats.totalReservations || 0}</p>
                                    <p className="text-sm text-gray-400 mt-1">Confirmed Reservations</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Favorites */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                            <div className="flex items-center gap-4">
                                <button type="button" style={{ color: '#fff', backgroundColor: '#ef4444' }} className="text-2xl rounded-full p-4">
                                    <BsHeartFill />
                                </button>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">{stats.totalFavorites || 0}</p>
                                    <p className="text-sm text-gray-400 mt-1">Total Favorites</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Revenue Chart */}
                <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Revenue Trend</p>
                    <ChartComponent
                        id="revenue-chart"
                        height="350px"
                        primaryXAxis={{ valueType: 'DateTime', labelFormat: 'd MMM', skeleton: 'yMd', edgeLabelPlacement: 'Shift', labelStyle: { color: currentMode === 'Dark' ? '#fff' : '#333' } }}
                        primaryYAxis={{ labelFormat: '{value}€', title: 'Revenue', labelStyle: { color: currentMode === 'Dark' ? '#fff' : '#333' } }}
                        tooltip={{ enable: true }}
                        background={currentMode === 'Dark' ? '#33373E' : '#fff'}
                    >
                        <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
                        <SeriesCollectionDirective>
                            <SeriesDirective
                                dataSource={revenueChartData}
                                xName="x"
                                yName="y"
                                name="Revenue"
                                type="Line"
                                width={3}
                                marker={{ visible: true, width: 7, height: 7 }}
                                fill="#03C9D7"
                            />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>

                {/* Reservations Table */}
                <div className="mt-10 mb-10">
                    <p className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Reservations</p>
                    {stats.recentReservations && stats.recentReservations.length > 0 ? (
                        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                                <thead className="border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">User</th>
                                        <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Event / Ticket</th>
                                        <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Quantity</th>
                                        <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Total</th>
                                        <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentReservations.slice(0, 10).map((res) => (
                                        <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                                            <td className="p-3">
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{res.userName}</p>
                                                <p className="text-xs text-gray-400">{res.userEmail}</p>
                                            </td>
                                            <td className="p-3">
                                                {res.ticketTypeName || "Ticket"}
                                            </td>
                                            <td className="p-3">
                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-bold">
                                                    {res.quantity}
                                                </span>
                                            </td>
                                            <td className="p-3 font-bold text-gray-900 dark:text-white">
                                                {(res.totalPrice).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                            </td>
                                            <td className="p-3 text-gray-500 dark:text-gray-400">
                                                {res.reservationDate ? new Date(res.reservationDate).toLocaleDateString() : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-400">No recent reservations found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizerStats;
