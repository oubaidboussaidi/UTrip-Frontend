import React, { useState, useEffect } from 'react';
import {
    ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject,
    LineSeries, DateTime, Legend, Tooltip
} from '@syncfusion/ej2-react-charts';

import { BsCurrencyDollar, BsCalendarCheck, BsHeartFill } from 'react-icons/bs';
import { getOrganizerStats } from '../../api/apiStats';
import Navbar from '../../components/NavBar';
import { TrendingUp, Users } from 'lucide-react';

const OrganizerStats = ({ organizerEmail, embedded = false }) => {
    // Determine theme or force light for now as per user site style
    const currentMode = 'Light';

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const emailToUse = organizerEmail || user?.email;

    useEffect(() => {
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
        <div className={embedded ? "p-10 text-center" : "min-h-screen bg-gray-50"}>
            {!embedded && <Navbar />}
            <div className={embedded ? "" : "pt-32 text-center"}>Loading statistics...</div>
        </div>
    );

    if (!stats) return (
        <div className={embedded ? "p-10 text-center" : "min-h-screen bg-gray-50"}>
            {!embedded && <Navbar />}
            <div className={embedded ? "" : "pt-32 text-center"}>No statistics available.</div>
        </div>
    );

    // Prepare Chart Data
    const revenueChartData = stats?.revenueOverTime
        ? Object.entries(stats.revenueOverTime).map(([date, amount]) => ({ x: new Date(date), y: amount }))
        : [];

    return (
        <div className={embedded ? "" : "min-h-screen bg-gray-50 text-gray-900"}>
            {!embedded && <Navbar />}

            <div className={embedded ? "" : "pt-32 px-5 md:px-20 max-w-7xl mx-auto pb-20"}>
                {/* Header Section */}
                {!embedded && (
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Performance</h1>
                        <p className="text-gray-500">Track your revenue and reservations</p>
                    </div>
                )}

                {!embedded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Total Revenue */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                            <div className="flex items-center gap-4">
                                <button type="button" style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }} className="text-2xl rounded-full p-4">
                                    <BsCurrencyDollar />
                                </button>
                                <div>
                                    <p className="text-lg font-semibold">{(stats.totalRevenue || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                                    <p className="text-sm text-gray-400 mt-1">Total Revenue</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Reservations */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                            <div className="flex items-center gap-4">
                                <button type="button" style={{ color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)' }} className="text-2xl rounded-full p-4">
                                    <BsCalendarCheck />
                                </button>
                                <div>
                                    <p className="text-lg font-semibold">{stats.totalReservations || 0}</p>
                                    <p className="text-sm text-gray-400 mt-1">Confirmed Reservations</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Favorites */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                            <div className="flex items-center gap-4">
                                <button type="button" style={{ color: '#fff', backgroundColor: '#ef4444' }} className="text-2xl rounded-full p-4">
                                    <BsHeartFill />
                                </button>
                                <div>
                                    <p className="text-lg font-semibold">{stats.totalFavorites || 0}</p>
                                    <p className="text-sm text-gray-400 mt-1">Total Favorites</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Revenue Chart */}
                <div className="mb-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-xl font-semibold mb-4 text-gray-700">Revenue Trend</p>
                    <ChartComponent
                        id="revenue-chart"
                        height="350px"
                        primaryXAxis={{ valueType: 'DateTime', labelFormat: 'd MMM', skeleton: 'yMd', edgeLabelPlacement: 'Shift' }}
                        primaryYAxis={{ labelFormat: '{value}€', title: 'Revenue' }}
                        tooltip={{ enable: true }}
                        background='#fff'
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
                    <p className="text-xl font-semibold mb-4 text-gray-700">Recent Reservations</p>
                    {stats.recentReservations && stats.recentReservations.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="border-b border-gray-200">
                                    <tr>
                                        <th className="p-3 font-semibold">User</th>
                                        <th className="p-3 font-semibold">Event / Ticket</th>
                                        <th className="p-3 font-semibold">Quantity</th>
                                        <th className="p-3 font-semibold">Total</th>
                                        <th className="p-3 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentReservations.slice(0, 10).map((res) => (
                                        <tr key={res.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                            <td className="p-3">
                                                <p className="font-semibold text-gray-900">{res.userName}</p>
                                                <p className="text-xs text-gray-400">{res.userEmail}</p>
                                            </td>
                                            <td className="p-3">
                                                {res.ticketTypeName || "Ticket"}
                                            </td>
                                            <td className="p-3">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold">
                                                    {res.quantity}
                                                </span>
                                            </td>
                                            <td className="p-3 font-bold text-gray-900">
                                                {(res.totalPrice).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                            </td>
                                            <td className="p-3 text-gray-500">
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
