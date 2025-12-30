import React, { useEffect, useState } from "react";
import { Search, MapPin, Calendar, Heart, Filter, ChevronRight, SlidersHorizontal, ChevronLeft } from "lucide-react";
import Navbar from "../components/NavBar";
import apiPublic from "../api/apiPublic";
import apiUser from "../api/apiUser";
import { searchEvents } from "../api/apiEvent";
import EventDetailsModal from "../components/EventDetailsModal";
import ItineraryMap from "../components/ItineraryMap";
import { getCoordinates } from "../api/apiGeocoding";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Check, Map as MapIcon, X } from "lucide-react";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFavs, setUserFavs] = useState(new Set());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState({ location: "", date: "", category: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);

    const [showFavorites, setShowFavorites] = useState(false);

    // Itinerary State
    const [itineraryMode, setItineraryMode] = useState(false);
    const [itineraryItems, setItineraryItems] = useState([]);
    const [showItineraryMap, setShowItineraryMap] = useState(false);
    const [loadingCoords, setLoadingCoords] = useState(new Set());
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 4;

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const isLoggedIn = !!storedUser.email;

    useEffect(() => {
        fetchEvents();
        fetchCategories();
        if (isLoggedIn) fetchUserFavorites();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 250);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoggedIn]);

    const fetchCategories = async () => {
        try {
            const { data } = await apiPublic.get("/events/categories");
            setCategories(data || []);
        } catch (e) {
            console.error("Error fetching categories", e);
        }
    };

    const fetchEvents = async (params = {}) => {
        setLoading(true);
        try {
            if (params.location || params.date || params.category) {
                const { data } = await searchEvents(params);
                setEvents(Array.isArray(data) ? data : []);
            } else {
                const { data } = await apiPublic.get("/events/approved");
                setEvents(Array.isArray(data) ? data : []);
            }
            setCurrentPage(1); // Reset to first page on new search
        } catch (e) {
            console.error("Error fetching events", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserFavorites = async () => {
        try {
            const { data } = await apiUser.get("/favorites");
            setUserFavs(new Set(data));
        } catch (e) {
            console.error("Error fetching user favorites", e);
        }
    };

    const toggleFavorite = async (id) => {
        if (!isLoggedIn) {
            alert("Please log in to manage favorites");
            return;
        }

        const isFav = userFavs.has(id);
        try {
            if (isFav) {
                await apiUser.delete(`/favorites/${id}`);
                setUserFavs((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            } else {
                await apiUser.post(`/favorites/${id}`);
                setUserFavs((prev) => new Set(prev).add(id));
            }
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents(search);
    };

    // Itinerary Logic
    const toggleItineraryItem = async (e, event) => {
        e.stopPropagation();

        const isSelected = itineraryItems.find(item => item.id === event.id);

        if (isSelected) {
            setItineraryItems(prev => prev.filter(item => item.id !== event.id));
            toast.success("Removed from itinerary");
            return;
        }

        // Add to itinerary - Fetch Coords
        setLoadingCoords(prev => new Set(prev).add(event.id));
        try {
            // Check if event already has coords (unlikely given current backend, but good practice)
            let lat = event.lat;
            let lng = event.lng;

            if (!lat || !lng) {
                const coords = await getCoordinates(event.location);
                if (coords) {
                    lat = coords.lat;
                    lng = coords.lng;
                } else {
                    // Fallback or error
                    toast.error(`Could not find location for "${event.location}"`);
                    // Optional: Use default coords or fail? 
                    // Let's add it anyway with a warning or dummy coords for demo if "Tunisia" fails
                    // throw new Error("Location not found");
                    // For DEMO purposes, if fails, we might warn used
                }
            }

            if (lat && lng) {
                setItineraryItems(prev => [...prev, { ...event, lat, lng }]);
                toast.success("Added to itinerary");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to add event to itinerary");
        } finally {
            setLoadingCoords(prev => {
                const newSet = new Set(prev);
                newSet.delete(event.id);
                return newSet;
            });
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFavs = showFavorites ? userFavs.has(event.id) : true;
        return matchesSearch && matchesFavs;
    });

    // Pagination Logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
            <Navbar />

            {/* Hero Header */}
            <div className="pt-40 pb-20 px-5 md:px-20 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                        <div className="max-w-2xl">
                            <h1 className="text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                                Explore Exceptional <span className="text-blue-600">Events</span>
                            </h1>
                            <p className="text-xl text-gray-500 font-medium">
                                Discover unique experiences, from local workshops to international festivals.
                                Find your next adventure here.
                            </p>
                        </div>

                        <div className={`
                            hidden lg:block transition-all duration-500 z-[100]
                            ${isScrolled
                                ? "fixed top-32 right-8 bg-black/90 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-2xl border border-white/10 scale-90 translate-x-2"
                                : "bg-blue-50 px-6 py-4 rounded-3xl border border-blue-100"}
                        `}>
                            <p className={`font-bold tracking-widest uppercase mb-1 transition-all ${isScrolled ? "text-blue-400 text-[10px]" : "text-blue-600 text-sm"}`}>
                                Live Now
                            </p>
                            <p className={`font-black transition-all ${isScrolled ? "text-white text-lg" : "text-blue-900 text-2xl"}`}>
                                {events.length} {isScrolled ? "Events" : "Events Available"}
                            </p>
                        </div>
                    </div>

                    {/* Itinerary Toggle Banner */}
                    <div className="mb-8 flex justify-end">
                        <button
                            onClick={() => setItineraryMode(!itineraryMode)}
                            className={`
                                flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all shadow-lg
                                ${itineraryMode
                                    ? "bg-blue-600 text-white shadow-blue-500/30 ring-4 ring-blue-100"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}
                            `}
                        >
                            <MapIcon size={20} />
                            {itineraryMode ? "Exit Planner Mode" : "Plan a Trip"}
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col lg:flex-row gap-2">
                        <div className="flex-1 flex items-center px-6 gap-4 border-r border-gray-100">
                            <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by title, artist, or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-4 text-gray-900 font-medium outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex-1 flex items-center px-6 gap-4 border-r border-gray-100">
                            <MapPin className="text-gray-400 w-5 h-5 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Location..."
                                value={search.location}
                                onChange={(e) => setSearch({ ...search, location: e.target.value })}
                                className="w-full py-4 text-gray-900 font-medium outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex-shrink-0 flex items-center px-6 gap-4">
                            <Calendar className="text-gray-400 w-5 h-5 flex-shrink-0" />
                            <input
                                type="date"
                                value={search.date}
                                onChange={(e) => setSearch({ ...search, date: e.target.value })}
                                className="py-4 text-gray-900 font-medium outline-none appearance-none"
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center gap-2"
                        >
                            Find Events
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-5 md:px-20 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold uppercase tracking-wider text-sm">
                                <SlidersHorizontal size={16} /> Filters
                            </div>
                            <div className="h-px bg-gray-100 w-full"></div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900">Categories</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setSearch({ ...search, category: "" });
                                        fetchEvents({ ...search, category: "" });
                                    }}
                                    className={`w-full text-left px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${!search.category ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            const newParams = { ...search, category: cat };
                                            setSearch(newParams);
                                            fetchEvents(newParams);
                                        }}
                                        className={`w-full text-left px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${search.category === cat ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isLoggedIn && (
                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all duration-300 ${showFavorites
                                        ? 'bg-red-50 text-red-600 border border-red-100 shadow-lg shadow-red-900/5'
                                        : 'bg-white text-gray-700 border border-gray-100 hover:border-red-100 hover:text-red-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Heart size={18} fill={showFavorites ? "#ef4444" : "none"} />
                                        <span className="font-bold text-sm">My Favorites</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${showFavorites ? 'bg-red-500' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${showFavorites ? 'left-5' : 'left-1'}`}></div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="bg-white rounded-[2rem] h-[450px] animate-pulse border border-gray-100"></div>
                                ))}
                            </div>
                        ) : currentEvents.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {currentEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2"
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    {/* Itinerary Selection Button */}
                                                    {itineraryMode && (
                                                        <button
                                                            onClick={(e) => toggleItineraryItem(e, event)}
                                                            className={`
                                                                w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all z-20
                                                                ${itineraryItems.find(i => i.id === event.id)
                                                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/40"
                                                                    : "bg-white/20 border-white/30 text-white hover:bg-white/40"}
                                                            `}
                                                        >
                                                            {loadingCoords.has(event.id) ? (
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            ) : itineraryItems.find(i => i.id === event.id) ? (
                                                                <Check size={18} strokeWidth={3} />
                                                            ) : (
                                                                <Plus size={20} />
                                                            )}
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 transition-all"
                                                    >
                                                        <Heart
                                                            size={20}
                                                            fill={userFavs.has(event.id) ? "#ef4444" : "none"}
                                                            stroke={userFavs.has(event.id) ? "#ef4444" : "white"}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-4 left-4">
                                                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                                                        {event.category || "General"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-8">
                                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                                                    <Calendar size={14} className="text-blue-500" /> {event.date}
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-gray-500 mb-6 font-medium">
                                                    <MapPin size={16} className="text-red-500" /> {event.location}
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                                    <div>
                                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Starting from</p>
                                                        <p className="text-2xl font-black text-gray-900">{event.price} <span className="text-sm font-bold text-gray-400">TND</span></p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedEvent(event)}
                                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 text-white group-hover:bg-blue-600 transition-all group-hover:scale-110"
                                                    >
                                                        <ChevronRight />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-16">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-3 rounded-2xl border border-gray-100 bg-white text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => paginate(i + 1)}
                                                    className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1
                                                        ? 'bg-black text-white shadow-lg'
                                                        : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-50'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-3 rounded-2xl border border-gray-100 bg-white text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                                <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                                <h3 className="text-3xl font-black text-gray-900 mb-4">No events found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">
                                    We couldn't find any events matching your current search or filters. Try adjusting them!
                                </p>
                                <button
                                    onClick={() => {
                                        setSearch({ location: "", date: "", category: "" });
                                        fetchEvents();
                                    }}
                                    className="mt-8 text-blue-600 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {
                selectedEvent && (
                    <EventDetailsModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )
            }

            {/* Itinerary Map Modal */}
            {
                showItineraryMap && (
                    <ItineraryMap
                        events={itineraryItems}
                        onClose={() => setShowItineraryMap(false)}
                    />
                )
            }

            {/* Itinerary Floating Widget */}
            {
                itineraryMode && itineraryItems.length > 0 && !showItineraryMap && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="bg-gray-900 text-white pl-6 pr-2 py-2 rounded-full shadow-2xl shadow-blue-900/40 flex items-center gap-6 border border-gray-700">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Itinerary</span>
                                <span className="font-bold text-lg leading-none">{itineraryItems.length} Stops</span>
                            </div>
                            <div className="flex bg-gray-800 rounded-full p-1">
                                <button
                                    onClick={() => setItineraryItems([])}
                                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                                    title="Clear"
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    onClick={() => setShowItineraryMap(true)}
                                    className="px-6 h-10 bg-blue-600 hover:bg-blue-500 rounded-full font-bold flex items-center gap-2 transition-all"
                                >
                                    View Route <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <Toaster position="bottom-right" />
        </div >
    );
};

export default EventsPage;
