import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Filter, TrendingUp, Users } from "lucide-react";
import { getMyEvents } from "../api/apiEvent";
import apiTicket from "../api/apiTicket";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import CreateEventModal from "../components/CreateEventModal";

// Helper for pagination
const ITEMS_PER_PAGE = 9;

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();

    // Get user from local storage
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user || user.role !== "ORGANIZER") {
            navigate("/");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Events
            const { data: eventsData } = await getMyEvents(user.email);
            setEvents(eventsData);

            // Fetch Analytics
            const { data: statsData } = await apiTicket.getOrganizerAnalytics(user.email);
            setStats(statsData);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        fetchData(); // Refresh events after modal closes
    };

    // Filter events
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />

            <div className="pt-32 px-5 md:px-20 max-w-7xl mx-auto pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Events</h1>
                        <p className="text-gray-500">Manage and track your organized events</p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Create Event
                    </button>
                </div>

                {/* STATS SECTION */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    {stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Total Reservations</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.totalReservations}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            style={{ color: "#000" }}
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-xl border-none focus:ring-2 focus:ring-black/5 outline-none transition-all"
                        />
                    </div>
                    <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900">No events found</h3>
                        <p className="text-gray-500 mt-2">Start by creating your first event!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                                        <img
                                            src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                            {event.category || "Event"}
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        </div>

                                        {/* EVENT ANALYTICS MINI-DASHBOARD */}
                                        {stats && (
                                            <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                                                <div className="flex-1 text-center border-r border-gray-200">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Sold</p>
                                                    <p className="font-bold text-gray-900">
                                                        {stats.reservationsPerEvent?.[event.title] || 0}
                                                    </p>
                                                </div>
                                                <div className="flex-1 text-center">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Revenue</p>
                                                    <p className="font-bold text-green-600">
                                                        {(stats.revenuePerEvent?.[event.title] || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                            <button className="flex-1 py-2.5 bg-gray-50 text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>

                                <span className="text-gray-600 font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Event Modal */}
            {showCreateModal && (
                <CreateEventModal
                    userEmail={user.email}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default MyEvents;
