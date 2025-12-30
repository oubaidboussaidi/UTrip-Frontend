import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import apiPublic from "../api/apiPublic";
import { searchEvents } from "../api/apiEvent";
import EventDetailsModal from "./EventDetailsModal";

const AllEventsModal = ({ onClose, userFavs, toggleFavorite }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const eventsPerPage = 5;

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async (searchParams = {}) => {
    try {
      // If we have search inputs, use search endpoint
      if (searchParams.location || searchParams.date || searchParams.category) {
        const { data } = await searchEvents(searchParams);
        setAllEvents(Array.isArray(data) ? data : []);
      } else {
        const { data } = await apiPublic.get("/events/approved");
        setAllEvents(Array.isArray(data) ? data : []);
      }
      setCurrentPage(1);
    } catch (e) {
      console.error("Error fetching all events", e);
    }
  };

  const [search, setSearch] = useState({ location: "", date: "", category: "" });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllEvents(search);
  };

  const filteredEvents = showFavOnly
    ? allEvents.filter((event) => userFavs.has(event.id))
    : allEvents;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return createPortal(
    <>
      <style>{`
        .modal-backdrop-all {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-container-all {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 24px;
          width: 98%;
          max-width: 900px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2rem;
          z-index: 1000;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideUp 0.3s ease-out;
        }

        .filter-button {
          position: relative;
          padding: 0.5rem 1.25rem;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          background: white;
          color: #374151;
        }

        .filter-button.active {
          background: #374151;
          color: white;
          border-color: #374151;
        }

        .filter-button:not(.active):hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .event-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
          padding: 1.25rem;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .event-card:hover {
          background: #f3f4f6;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .cta-button-small {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          overflow: hidden;
          cursor: pointer;
        }

        .cta-button-small:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .cta-button-small .bg-circle {
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

        .cta-button-small:hover .bg-circle {
          width: 200px;
          height: 200px;
        }

        .cta-button-small .text {
          position: relative;
          z-index: 1;
        }

        .pagination-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          border-color: #d1d5db;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .close-button-all {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          transition: all 0.3s ease;
          overflow: hidden;
          cursor: pointer;
        }

        .close-button-all:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: rotate(90deg);
        }

        .close-button-all .bg-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: #fee2e2;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        .close-button-all:hover .bg-circle {
          width: 100px;
          height: 100px;
        }

        .modal-container-all::-webkit-scrollbar {
          width: 6px;
        }

        .modal-container-all::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-container-all::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }

        .modal-container-all::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }

        .modal-container-all {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>

      {/* Backdrop */}
      <div className="modal-backdrop-all" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal-container-all" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">All Events</h2>
          <button onClick={onClose} className="close-button-all">
            <div className="bg-circle"></div>
            <X className="w-5 h-5 text-gray-700 relative z-10" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Location"
            value={search.location}
            onChange={(e) => setSearch({ ...search, location: e.target.value })}
            className="px-4 py-2 border rounded-xl flex-1 min-w-[150px]"
          />
          <input
            type="date"
            value={search.date}
            onChange={(e) => setSearch({ ...search, date: e.target.value })}
            className="px-4 py-2 border rounded-xl flex-1 min-w-[150px]"
          />
          <select
            value={search.category}
            onChange={(e) => setSearch({ ...search, category: e.target.value })}
            className="px-4 py-2 border rounded-xl flex-1 min-w-[150px]"
          >
            <option value="">All Categories</option>
            <option value="Cultural">Cultural</option>
            <option value="Adventure">Adventure</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Food & Drink">Food & Drink</option>
            <option value="Technology">Technology</option>
            <option value="Art">Art</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
            Search
          </button>
        </form>

        {/* Filter Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setShowFavOnly(false)}
            className={`filter-button ${!showFavOnly ? 'active' : ''}`}
          >
            All Events
          </button>
          <button
            onClick={() => setShowFavOnly(true)}
            className={`filter-button ${showFavOnly ? 'active' : ''}`}
          >
            <Heart className="w-4 h-4 inline-block mr-1" fill={showFavOnly ? "currentColor" : "none"} />
            Favorites
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => {
              const isFav = userFavs.has(event.id);

              return (
                <div key={event.id} className="event-card">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(event.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={isFav ? "#ef4444" : "none"}
                        stroke={isFav ? "#ef4444" : "#9ca3af"}
                        strokeWidth={2}
                      />
                    </button>

                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="cta-button-small"
                    >
                      <div className="bg-circle"></div>
                      <span className="text">Details</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {showFavOnly ? "No favorite events yet." : "No events available."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="pagination-button"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="px-4 py-2 font-semibold text-gray-700">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="pagination-button"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Nested Event Details */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>,
    document.body
  );
};

export default AllEventsModal;