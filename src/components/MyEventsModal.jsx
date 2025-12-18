import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMyEvents } from "../api/apiEvent";
import CreateEventModal from "./CreateEventModal";

const UserEvents = ({
  showLoginPrompt = () => alert("Please log in to manage favorites")
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFavs, setUserFavs] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const isLoggedIn = !!storedUser.email;
  const canCreate = storedUser.role === "ORGANIZER";

  // Fetch real events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      if (!storedUser.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMyEvents(storedUser.email);
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [storedUser.email]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, events.length]);

  const toggleFavorite = (id) => {
    if (!isLoggedIn) {
      showLoginPrompt();
      return;
    }

    setUserFavs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleEventCreated = async () => {
    // Refresh events list after creating new event
    setShowCreateModal(false);
    setLoading(true);
    try {
      const response = await getMyEvents(storedUser.email);
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading amazing events...</div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No events found</div>
          {canCreate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              + Create Your First Event
            </motion.button>
          )}
        </div>
      </section>
    );
  }

  const currentEvent = events[currentIndex];
  const isFavorite = userFavs.has(currentEvent?.id);

  return (
    <section
      id="events"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              ✈️ My Events
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Manage your events and track their approval status.
            </p>
          </div>

          <div className="flex gap-3">
            {canCreate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                + Create Event
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Background Image with Overlay */}
              <div className="relative h-[600px] w-full">
                <img
                  src={currentEvent.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <div className="max-w-2xl">
                  {/* Status & Category Badge */}
                  <div className="flex gap-2 mb-4">
                    {currentEvent.status && (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`inline-block px-4 py-2 backdrop-blur-md rounded-full text-white text-sm font-medium border ${currentEvent.status === "APPROVED"
                            ? "bg-green-500/30 border-green-400/50"
                            : currentEvent.status === "PENDING"
                              ? "bg-yellow-500/30 border-yellow-400/50"
                              : "bg-red-500/30 border-red-400/50"
                          }`}
                      >
                        {currentEvent.status}
                      </motion.span>
                    )}
                    {currentEvent.category && (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/30"
                      >
                        {currentEvent.category}
                      </motion.span>
                    )}
                  </div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                  >
                    {currentEvent.title}
                  </motion.h2>

                  {/* Location & Date */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 mb-4 text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      <span className="text-lg">{currentEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      <span className="text-lg">{currentEvent.date}</span>
                    </div>
                    {currentEvent.horaire && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🕐</span>
                        <span className="text-lg">{currentEvent.horaire}</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-300 text-lg mb-6 leading-relaxed"
                  >
                    {currentEvent.description}
                  </motion.p>

                  {/* Price & Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center gap-4"
                  >
                    <span className="text-3xl font-bold text-white">
                      {currentEvent.price} TND
                    </span>

                    <div className="text-slate-300">
                      {currentEvent.nbPlace} places available
                    </div>

                    <button
                      onClick={() => setSelectedEvent(currentEvent)}
                      className="px-8 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => toggleFavorite(currentEvent.id)}
                      className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? "#ef4444" : "none"}
                        stroke="white"
                        strokeWidth="2"
                        className="w-6 h-6 transition-all duration-300"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-3 mt-8">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                    ? "w-12 h-3 bg-white"
                    : "w-3 h-3 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => goToSlide(index)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 ${index === currentIndex
                  ? "scale-105 shadow-2xl ring-2 ring-white"
                  : "hover:scale-102 shadow-lg"
                }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                <div className="mb-2">
                  {event.status && (
                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${event.status === "APPROVED"
                        ? "bg-green-500/50 text-white"
                        : event.status === "PENDING"
                          ? "bg-yellow-500/50 text-white"
                          : "bg-red-500/50 text-white"
                      }`}>
                      {event.status}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{event.title}</h3>
                <p className="text-slate-300 text-sm">{event.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-3xl max-w-2xl w-full p-8 relative"
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-bold text-white mb-4">{selectedEvent.title}</h2>
            <p className="text-slate-300 mb-6">{selectedEvent.description}</p>

            <div className="space-y-2 mb-6 text-slate-300">
              <p><span className="font-semibold">Location:</span> {selectedEvent.location}</p>
              <p><span className="font-semibold">Date:</span> {selectedEvent.date}</p>
              {selectedEvent.horaire && <p><span className="font-semibold">Time:</span> {selectedEvent.horaire}</p>}
              <p><span className="font-semibold">Price:</span> {selectedEvent.price} TND</p>
              <p><span className="font-semibold">Available Places:</span> {selectedEvent.nbPlace}</p>
              <p><span className="font-semibold">Status:</span> <span className={`font-bold ${selectedEvent.status === "APPROVED" ? "text-green-400" :
                  selectedEvent.status === "PENDING" ? "text-yellow-400" : "text-red-400"
                }`}>{selectedEvent.status}</span></p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          userEmail={storedUser.email}
          onClose={handleEventCreated}
        />
      )}
    </section>
  );
};

export default UserEvents;