// components/CreateEventModal.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createEvent } from "../api/apiEvent";
import { X, Calendar, MapPin, DollarSign, Users, Clock, Image, Tag, FileText } from "lucide-react";

const CreateEventModal = ({ userEmail, onClose }) => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    date: "",
    horaire: "",
    nbPlace: "",
    description: "",
    image: "",
    category: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Cultural",
    "Adventure",
    "Wildlife",
    "Music",
    "Sports",
    "Food & Drink",
    "Technology",
    "Art",
    "Business",
    "Other"
  ];

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert nbPlace and price to numbers
      const eventData = {
        ...newEvent,
        nbPlace: parseInt(newEvent.nbPlace),
        price: parseFloat(newEvent.price),
      };

      await createEvent(userEmail, eventData);

      // Show success and close
      setNewEvent({
        title: "",
        location: "",
        date: "",
        horaire: "",
        nbPlace: "",
        description: "",
        image: "",
        category: "",
        price: "",
      });

      onClose(); // This will trigger refresh in parent
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(err.response?.data?.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-amber-50 via-white to-stone-50 rounded-3xl max-w-2xl w-full shadow-2xl relative border border-amber-200/50"
        >
          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-amber-200/50">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-amber-100/50 rounded-full transition-colors"
              disabled={loading}
            >
              <X size={24} className="text-gray-700" />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Event
            </h2>
            <p className="text-gray-600">
              Fill in the details below. Your event will be sent for admin approval.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateEvent} className="p-8 space-y-5 max-h-[calc(100vh-300px)] overflow-y-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Event Title */}
            <div className="space-y-2">
              <label className="text-gray-900 font-medium flex items-center gap-2">
                <FileText size={18} className="text-amber-600" />
                Event Title
              </label>
              <input
                type="text"
                placeholder="e.g., Summer Music Festival"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <MapPin size={18} className="text-amber-600" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Paris, France"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <Calendar size={18} className="text-amber-600" />
                  Date
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <Clock size={18} className="text-amber-600" />
                  Time/Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g., 18:00 - 23:00"
                  value={newEvent.horaire}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, horaire: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Available Places */}
              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <Users size={18} className="text-amber-600" />
                  Available Places
                </label>
                <input
                  type="number"
                  placeholder="e.g., 100"
                  value={newEvent.nbPlace}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, nbPlace: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  required
                  min="1"
                  disabled={loading}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <Tag size={18} className="text-amber-600" />
                  Category
                </label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                >
                  <option value="" className="bg-white">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-white">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <DollarSign size={18} className="text-amber-600" />
                  Price (TND)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 49.99"
                  value={newEvent.price}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  required
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-gray-900 font-medium flex items-center gap-2">
                <Image size={18} className="text-amber-600" />
                Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newEvent.image}
                onChange={(e) => setNewEvent(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              {newEvent.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-amber-200/50">
                  <img
                    src={newEvent.image}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-gray-900 font-medium flex items-center gap-2">
                <FileText size={18} className="text-amber-600" />
                Description
              </label>
              <textarea
                placeholder="Describe your event in detail..."
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
                rows="4"
                required
                disabled={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all duration-300 border border-gray-200"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </form>

          {/* Info Footer */}
          <div className="px-8 py-4 bg-amber-50/50 border-t border-amber-200/50 rounded-b-3xl">
            <p className="text-gray-600 text-sm text-center">
              ℹ️ Your event will be reviewed by an admin before it appears publicly
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default CreateEventModal;
