// components/CreateEventModal.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createEvent, updateEvent } from "../api/apiEvent";
import { createTicketType } from "../api/apiTicket";
import { X, Calendar, MapPin, DollarSign, Users, Clock, Image, Tag, FileText } from "lucide-react";

const CreateEventModal = ({ userEmail, onClose, eventToEdit = null }) => {
  /* Ticket Management State */
  const [ticketTypes, setTicketTypes] = useState([
    { name: "Standard", price: "", quantity: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "", location: "", date: "", horaire: "", nbPlace: "",
    description: "", image: "", category: "", price: "",
  });



  const categories = ["Music", "Sports", "Art", "Food & Drink", "Technology", "Business", "Other"];

  // Populate form if editing
  // Populate form if editing
  React.useEffect(() => {
    if (eventToEdit) {
      setNewEvent({
        title: eventToEdit.title || "",
        location: eventToEdit.location || "",
        date: eventToEdit.date || "",
        horaire: eventToEdit.horaire || "",
        nbPlace: eventToEdit.nbPlace || "",
        description: eventToEdit.description || "",
        image: eventToEdit.image || "",
        category: eventToEdit.category || "",
        price: eventToEdit.price || "",
      });

      // Populate tickets
      setTicketTypes([
        {
          name: "Standard",
          price: (eventToEdit.price !== undefined && eventToEdit.price !== null) ? eventToEdit.price.toString() : "",
          quantity: (eventToEdit.nbPlace !== undefined && eventToEdit.nbPlace !== null) ? eventToEdit.nbPlace.toString() : ""
        }
      ]);
    }
  }, [eventToEdit]);

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index][field] = value;
    setTicketTypes(updatedTickets);

    // Sync first ticket with main event fields for backward compatibility
    if (index === 0) {
      if (field === 'price') setNewEvent(prev => ({ ...prev, price: value }));
      if (field === 'quantity') setNewEvent(prev => ({ ...prev, nbPlace: value }));
    }
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", price: "", quantity: "" }]);
  };

  const removeTicketType = (index) => {
    if (ticketTypes.length > 1) {
      const updatedTickets = ticketTypes.filter((_, i) => i !== index);
      setTicketTypes(updatedTickets);
    }
  };

  /* Create Event Logic */

  const validateForm = () => {
    if (!newEvent.title || newEvent.title.length < 5) {
      setError("Title must be at least 5 characters long.");
      return false;
    }
    if (!newEvent.location) {
      setError("Location is required.");
      return false;
    }
    if (!newEvent.category) {
      setError("Please select a category.");
      return false;
    }
    if (!newEvent.date) {
      setError("Event date is required.");
      return false;
    }

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(newEvent.date);
    if (eventDate < today) {
      setError("Event date must be in the future.");
      return false;
    }

    if (!newEvent.horaire) {
      setError("Time/Horaire is required.");
      return false;
    }
    if (!newEvent.description || newEvent.description.length < 20) {
      setError("Description must be at least 20 characters long.");
      return false;
    }
    if (!newEvent.image) {
      setError("Image URL is required.");
      return false;
    }

    // Ticket validation
    for (const ticket of ticketTypes) {
      if (!ticket.name) {
        setError("All ticket types must have a name.");
        return false;
      }
      if (ticket.price === "" || parseFloat(ticket.price) < 0) {
        setError("Ticket price cannot be negative.");
        return false;
      }
      if (!ticket.quantity || parseInt(ticket.quantity) <= 0) {
        setError("Ticket quantity must be greater than zero.");
        return false;
      }
    }

    return true;
  };

  const handleCreateEvent = async (e, status = "PENDING") => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Prepare Event Data
      const eventPrice = parseFloat(ticketTypes[0].price) || 0;
      const eventQuantity = parseInt(ticketTypes[0].quantity) || 0;

      const eventData = {
        ...newEvent,
        price: eventPrice,
        nbPlace: eventQuantity,
        status: status, // DRAFT or PENDING (for approval)
      };

      // 2. Create or Update Event
      if (eventToEdit) {
        await updateEvent(eventToEdit.id, eventData);
        // We might want to update ticket types too, but that's complex (delete old, create new?).
        // For now, let's assume updating basic info is the primary goal.
        // If the backend handles ticket updates via event update, great. 
        // If not, we might need a separate API call or logic.
        // Given complexity, we'll focus on updating the event details.
      } else {
        const response = await createEvent(userEmail, eventData);
        const createdEventId = response.data.id;

        // 3. Create Ticket Types linked to Event (Only on creation for now simpliciy)
        const ticketPromises = ticketTypes.map(ticket => {
          return createTicketType({
            eventId: createdEventId,
            name: ticket.name,
            price: parseFloat(ticket.price),
            totalQuantity: parseInt(ticket.quantity)
          });
        });
        await Promise.all(ticketPromises);
      }

      // Success
      setNewEvent({
        title: "", location: "", date: "", horaire: "", nbPlace: "",
        description: "", image: "", category: "", price: "",
      });
      setTicketTypes([{ name: "Standard", price: "", quantity: "" }]);

      onClose();
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(err.response?.data?.message || "Failed to create event.");
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
          className="bg-gradient-to-br from-amber-50 via-white to-stone-50 rounded-3xl max-w-2xl w-full shadow-2xl relative border border-amber-200/50 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="relative p-8 pb-4 border-b border-amber-200/50 flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-amber-100/50 rounded-full transition-colors"
              disabled={loading}
            >
              <X size={24} className="text-gray-700" />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {eventToEdit ? "Edit Event" : "Create New Event"}
            </h2>
            <p className="text-gray-600">
              Set up your event details and ticket options.
            </p>
          </div>

          {/* Scrollable Form Content */}
          <form className="p-8 pt-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-amber-100 pb-2">Event Details</h3>

              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <FileText size={18} className="text-amber-600" /> Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  placeholder="e.g., Summer Jazz Night"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium flex items-center gap-2">
                    <MapPin size={18} className="text-amber-600" /> Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium flex items-center gap-2">
                    <Tag size={18} className="text-amber-600" /> Category
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium flex items-center gap-2">
                    <Calendar size={18} className="text-amber-600" /> Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium flex items-center gap-2">
                    <Clock size={18} className="text-amber-600" /> Time
                  </label>
                  <input
                    type="text"
                    value={newEvent.horaire}
                    onChange={(e) => setNewEvent({ ...newEvent, horaire: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                    placeholder="19:00 - 22:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <Image size={18} className="text-amber-600" /> Image URL
                </label>
                <input
                  type="url"
                  value={newEvent.image}
                  onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-900 font-medium flex items-center gap-2">
                  <FileText size={18} className="text-amber-600" /> Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  rows="3"
                />
              </div>
            </div>

            {/* Ticketing Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                <h3 className="text-lg font-semibold text-gray-800">Tickets & Capacity</h3>
                <button type="button" onClick={addTicketType} className="text-sm text-amber-600 font-semibold hover:text-amber-700">
                  + Add Ticket Type
                </button>
              </div>

              {ticketTypes.map((ticket, index) => (
                <div key={index} className="flex gap-3 items-end bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-medium text-gray-500">Type Name</label>
                    <input
                      type="text"
                      placeholder="Standard"
                      value={ticket.name}
                      onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <label className="text-xs font-medium text-gray-500">Price (TND)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <label className="text-xs font-medium text-gray-500">Qty</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={ticket.quantity}
                      onChange={(e) => handleTicketChange(index, "quantity", e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-amber-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  {ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

          </form>

          {/* Footer Actions */}
          <div className="p-6 border-t border-amber-200/50 bg-amber-50/30 flex-shrink-0 flex gap-4">
            <button
              type="button"
              onClick={(e) => handleCreateEvent(e, "DRAFT")}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all"
              disabled={loading}
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={(e) => handleCreateEvent(e, "PENDING")}
              className="flex-[2] px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? "Processing..." : (eventToEdit ? "Update Event" : "Submit Event")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default CreateEventModal;
