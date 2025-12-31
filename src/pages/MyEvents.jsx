import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Filter, TrendingUp, Users } from "lucide-react";
import { getMyEvents, updateEvent, deleteEvent } from "../api/apiEvent";
import { getOrganizerStats } from "../api/apiStats";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import CreateEventModal from "../components/CreateEventModal";

// Helper for pagination
const ITEMS_PER_PAGE = 9;

const MyEvents = ({ embedded = false }) => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const navigate = useNavigate();

    // Get user from local storage
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user || user.role !== "ORGANIZER") {
            if (!embedded) navigate("/");
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

            // Fetch Analytics (Fixed to use getOrganizerStats from apiStats)
            try {
                const { data: statsData } = await getOrganizerStats(user.email);
                setStats(statsData);
            } catch (err) {
                console.error("Failed to fetch statistics in MyEvents:", err);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setEditEvent(null);
        fetchData(); // Refresh events after modal closes
    };

    // Publish Draft Handler
    const handlePublish = async (eventId, event) => {
        try {
            await updateEvent(eventId, { ...event, status: "PENDING" });
            fetchData();
        } catch (error) {
            console.error("Failed to publish event", error);
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent(eventId);
                fetchData();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    const handleEdit = (event) => {
        if (event.status === 'APPROVED') {
            alert("You cannot edit an event that has already been approved.");
            return;
        }
        setEditEvent(event);
        setShowCreateModal(true);
    };

    // Updated Filter events - including all states
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (statusFilter === "ALL") return true;

        // Match specific status
        return event.status === statusFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            if (!embedded) window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className={embedded ? "" : "min-h-screen bg-gray-50 text-gray-900"}>
            {!embedded && <Navbar />}

            <div className={embedded ? "" : "pt-32 px-5 md:px-20 max-w-7xl mx-auto pb-20"}>
                {/* Header Section */}
                {!embedded && (
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
                )}

                {/* STATS SECTION (Only show if not embedded, or keep if specifically wanted) */}
                {!embedded && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Net Earnings</p>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    {((stats.totalRevenue || 0) * 0.9).toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    Gross: {(stats.totalRevenue || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })} (-10% tax)
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Total Reservations</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.totalReservations || 0}</h3>
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

                    {/* Status Filter Tabs - Updated */}
                    <div className="flex bg-gray-50 p-1 rounded-xl overflow-x-auto max-w-full">
                        {['ALL', 'APPROVED', 'PENDING', 'REJECTED', 'DRAFT'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-white shadow-sm text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {embedded && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            New Event
                        </button>
                    )}
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
                        <p className="text-gray-500 mt-2">Try adjusting your filters or create a new event.</p>
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
                                        <div className={`absolute top-3 right-3 px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold shadow-sm ${event.status === 'DRAFT' ? 'bg-amber-100/90 text-amber-700' :
                                            event.status === 'APPROVED' ? 'bg-green-100/90 text-green-700' :
                                                event.status === 'REJECTED' ? 'bg-red-100/90 text-red-700' :
                                                    'bg-blue-100/90 text-blue-700'
                                            }`}>
                                            {event.status || "PENDING"}
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

                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                            {event.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handlePublish(event.id, event)}
                                                    className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                                                >
                                                    Publish
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleEdit(event)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${event.status === 'APPROVED'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination Component logic */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <span className="text-gray-600 font-medium">Page {currentPage} of {totalPages}</span>
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

            {showCreateModal && <CreateEventModal userEmail={user.email} onClose={handleModalClose} eventToEdit={editEvent} />}
        </div>
    );
};

export default MyEvents;
