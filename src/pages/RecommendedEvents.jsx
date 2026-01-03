import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { Sparkles, Calendar, MapPin, Tag, ChevronRight } from "lucide-react";
import EventDetailsModal from "../components/EventDetailsModal";
const RecommendedEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        // Get user from local storage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Simulate fetching recommendations
        fetchRecommendations(storedUser ? JSON.parse(storedUser).id : 'guest');
    }, []);

    const fetchRecommendations = async (userId) => {
        try {
            // Use the actual userId if available, otherwise 'guest'
            // Note: Backend handles 'guest' or unknown IDs gracefully (cold start)
            console.log("Fetching recommendations for:", userId);
            const response = await fetch(`http://127.0.0.1:8000/recommend/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch recommendations");
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            console.error(err);
            setError("Could not load recommendations. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <NavBar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-10 pointer-events-none" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-6 animate-fade-in-up">
                        <Sparkles size={16} />
                        <span>AI Powered</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900 leading-tight">
                        Events Picked <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Just For You
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Our AI analyzes your preferences to suggest the best experiences happening around you.
                    </p>
                </div>
            </section>

            {/* Events Grid */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 h-96 animate-pulse">
                                    <div className="bg-gray-200 h-48 rounded-2xl mb-4" />
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-red-100">
                            <p className="text-red-500 font-medium">{error}</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl">
                            <p className="text-gray-500 text-lg">No recommendations found yet. Explore more events to help us learn!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"}
                                            alt={event.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                                            <Tag size={12} className="text-indigo-600" />
                                            {event.category}
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                                            <Calendar size={14} className="text-indigo-500" /> {event.date || "Date TBA"}
                                        </div>

                                        <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium">
                                            {event.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-gray-500 mb-6 font-medium">
                                            <MapPin size={16} className="text-red-500" /> {event.location || "Online"}
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div>
                                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Starting from</p>
                                                <div className="text-2xl font-black text-gray-900">
                                                    {event.price && event.price > 0 ? event.price : "Free"}
                                                    {event.price > 0 && <span className="text-sm font-bold text-gray-400 ml-1">TND</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedEvent(event)}
                                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 text-white group-hover:bg-indigo-600 transition-all group-hover:scale-110"
                                            >
                                                <ChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
};

export default RecommendedEvents;
