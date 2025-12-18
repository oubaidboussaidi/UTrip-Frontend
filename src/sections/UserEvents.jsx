import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { MapPin, Calendar } from "lucide-react";

import apiPublic from "../api/apiPublic";
import apiUser from "../api/apiUser";
import CreateEventModal from "../components/CreateEventModal";
import EventDetailsModal from "../components/EventDetailsModal";
import AllEventsModal from "../components/AllEventsModal";

const UserEvents = ({ showLoginPrompt = () => alert("Please log in to manage favorites") }) => {
  const [events, setEvents] = useState([]);
  const [userFavs, setUserFavs] = useState(new Set());
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userEmail = storedUser.email || "";
  const userRole = storedUser.role || "USER";
  const isLoggedIn = !!storedUser.email;
  const canCreate = userRole === "ORGANIZER";

  useEffect(() => {
    fetchEvents();
    if (isLoggedIn) fetchUserFavorites();
  }, [isLoggedIn]);

  const fetchEvents = async () => {
    try {
      const { data } = await apiPublic.get("/events/approved");
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching events", e);
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
      showLoginPrompt();
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
      alert("Failed to update favorite");
    }
  };

  return (
    <section id="events" className="bg-gradient-to-b from-gray-50 to-gray-100 pt-30 pb-10 relative z-10">
      <style>{`
        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          font-weight: 500;
          color: #374151;
          transition: all 0.3s ease;
          overflow: hidden;
          cursor: pointer;
        }

        .cta-button:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .cta-button .bg-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: #f9fafb;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        .cta-button:hover .bg-circle {
          width: 300px;
          height: 300px;
        }

        .cta-button .text {
          position: relative;
          z-index: 1;
          margin: 0;
        }

        .thumbnail-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .thumbnail-strip::-webkit-scrollbar {
          display: none;
        }

        .event-thumb {
          transition: all 0.3s ease;
        }

        .event-thumb:hover {
          transform: scale(1.05);
        }

        .event-thumb.active {
          transform: scale(1.1);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center px-5 md:px-20 mb-5">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">Upcoming Events</h1>
          <p className="text-gray-600 mt-1 max-w-xl">
            Discover new experiences and book your next adventure.
          </p>
        </div>

        <div className="flex gap-2">
          {canCreate && (
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="cta-button"
            >
              <div className="bg-circle" />
              <p className="text">Create Event</p>
            </button>
          )}

          <button
            onClick={() => setShowAllEventsModal(true)}
            className="cta-button"
          >
            <div className="bg-circle" />
            <p className="text">See All Events</p>
          </button>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <CreateEventModal
          userEmail={userEmail}
          onClose={() => setShowCreateEventModal(false)}
        />
      )}

      {/* Carousel */}
      <div className="mt-6 px-5 md:px-20">
        {events.length > 0 ? (
          <div className="relative">
            {/* Custom Navigation Arrows */}
            <button
              onClick={() => setCurrentIndex((currentIndex - 1 + events.length) % events.length)}
              className="absolute left-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center bg-gradient-to-r from-black/40 to-transparent hover:from-black/60 transition-all duration-300"
              style={{ backdropFilter: "blur(4px)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % events.length)}
              className="absolute right-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center bg-gradient-to-l from-black/40 to-transparent hover:from-black/60 transition-all duration-300"
              style={{ backdropFilter: "blur(4px)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Carousel
              animation="fade"
              interval={4000}
              duration={500}
              navButtonsAlwaysVisible={false}
              indicators={false}
              index={currentIndex}
              onChange={(index) => setCurrentIndex(index)}
            >
              {events.map((event) => {
                const id = event.id;
                if (!id) return null;

                const isFav = userFavs.has(id);

                return (
                  <Paper
                    key={id}
                    elevation={0}
                    className="rounded-3xl overflow-hidden relative h-[500px] bg-transparent"
                  >
                    {/* Background */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-center px-20 py-8">
                      <div className="max-w-xl space-y-5 mb-24">
                        <h2 className="text-5xl font-bold text-white leading-tight">
                          {event.title}
                        </h2>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-white/90">
                            <MapPin className="w-5 h-5" />
                            <span className="text-lg font-medium">{event.location}</span>
                          </div>

                          <div className="flex items-center gap-3 text-white/90">
                            <Calendar className="w-5 h-5" />
                            <span className="text-lg font-medium">{event.date}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="cta-button"
                          >
                            <div className="bg-circle" />
                            <p className="text">View Details</p>
                          </button>

                          <button
                            onClick={() => toggleFavorite(id)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill={isFav ? "#ef4444" : "none"}
                              stroke={isFav ? "#ef4444" : "white"}
                              strokeWidth="2"
                              className="w-6 h-6"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Paper>
                );
              })}
            </Carousel>

            {/* Thumbnails - Positioned above carousel bottom */}
            <div className="absolute bottom-6 left-0 right-0 z-10 px-12">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="thumbnail-strip max-w-full">
                  {events.map((event, idx) => (
                    <div
                      key={event.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`event-thumb flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        idx === currentIndex 
                          ? 'active border-white' 
                          : 'border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-500">Loading events...</p>
        )}
      </div>

      {/* All events modal */}
      {showAllEventsModal && (
        <AllEventsModal
          onClose={() => setShowAllEventsModal(false)}
          userFavs={userFavs}
          toggleFavorite={toggleFavorite}
        />
      )}

      {/* Details modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
};

export default UserEvents;