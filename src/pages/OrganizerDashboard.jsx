import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Calendar,
    ChevronRight,
    TrendingUp,
    Users,
    Heart,
    Package
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import MyEvents from "./MyEvents";
import OrganizerStats from "../dashboard/pages/OrganizerStats";
import { getOrganizerStats } from "../api/apiStats";

const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview"); // 'overview' or 'events'
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user || user.role !== "ORGANIZER") {
            navigate("/");
            return;
        }

        // Check if there's a tab in the URL or state
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab === "events") {
            setActiveTab("events");
        }

        fetchStats();
    }, [location.search]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await getOrganizerStats(user.email);
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "overview", name: "Performance Overview", icon: LayoutDashboard },
        { id: "events", name: "My Events", icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
            <Navbar />

            <div className="pt-32 px-5 md:px-20 max-w-7xl mx-auto pb-20">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight mb-3">
                            Organizer <span className="text-blue-600">Dashboard</span>
                        </h1>
                        <p className="text-gray-500 text-lg font-medium">
                            Welcome back, {user?.firstName}. Here's what's happening with your events.
                        </p>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    navigate(`/organizer-dashboard?tab=${tab.id}`, { replace: true });
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-black text-white shadow-lg shadow-black/20"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Stats Summary (Always visible or only in overview?) */}
                {activeTab === "overview" && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatCard
                            title="Total Revenue"
                            value={(stats.totalRevenue || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            icon={TrendingUp}
                            color="blue"
                            trend="+12%"
                        />
                        <StatCard
                            title="Reservations"
                            value={stats.totalReservations || 0}
                            icon={Users}
                            color="purple"
                            trend="+5%"
                        />
                        <StatCard
                            title="Total Favorites"
                            value={stats.totalFavorites || 0}
                            icon={Heart}
                            color="orange"
                            trend="+24%"
                        />
                        <StatCard
                            title="Active Events"
                            value={stats.eventCount || 0}
                            icon={Package}
                            color="green"
                        />
                    </div>
                )}

                {/* Main Content Area */}
                <div className="transition-all duration-500">
                    {activeTab === "overview" ? (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <OrganizerStats organizerEmail={user?.email} embedded={true} statsData={stats} />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <MyEvents embedded={true} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        green: "bg-green-50 text-green-600 border-green-100",
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]} border group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-600 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-900">{value}</h3>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
