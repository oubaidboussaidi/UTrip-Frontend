import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Calendar, Tag, DollarSign, X, Minus, Plus, CreditCard, Clock, Info, Users } from "lucide-react";
import apiPayment from "../api/apiPayment";
import { getTicketTypesByEvent } from "../api/apiTicket";
import toast from "react-hot-toast";

const EventDetailsModal = ({ event, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);

  React.useEffect(() => {
    if (event?.id) {
      getTicketTypesByEvent(event.id).then(({ data }) => {
        // Filter out types with 0 quantity if desired, or show as sold out
        setTicketTypes(data);
        if (data.length > 0) setSelectedTicketType(data[0]);
      }).catch(console.error);
    }
  }, [event]);

  if (!event) return null;

  const handleIncrease = () => {
    // Check limit based on selected ticket type
    const limit = selectedTicketType ? selectedTicketType.remainingQuantity : event.nbPlace;
    if (quantity < limit) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      toast.error("Please log in to book tickets");
      return;
    }

    if (ticketTypes.length > 0 && !selectedTicketType) {
      toast.error("Please select a ticket type");
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiPayment.createCheckoutSession({
        eventId: event.id,
        email: user.email,
        quantity: quantity,
        ticketTypeId: selectedTicketType?.id, // Send ticketTypeId
        origin: window.location.origin
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to initiate booking");
    } finally {
      setLoading(false);
    }
  };

  const currentPrice = selectedTicketType ? selectedTicketType.price : event.price;
  const currentStock = selectedTicketType ? selectedTicketType.remainingQuantity : event.nbPlace;

  return createPortal(
    <>
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 9998;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 32px;
          width: 100%;
          max-width: 1200px;
          height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: scaleUp 0.3s ease-out;
          display: flex;
          flex-direction: column;
        }

        .modal-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .left-column {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          position: relative;
        }

        .right-column {
          width: 400px;
          background: #f8fafc;
          border-left: 1px solid #e2e8f0;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero-image-container {
          height: 400px;
          width: 100%;
          position: relative;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
        }

        .close-btn-floating {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: white;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
          z-index: 50;
        }

        .close-btn-floating:hover {
          transform: scale(1.1);
        }

        .content-wrapper {
          padding: 3rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
        }

        .booking-card {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .modal-body {
            flex-direction: column;
            overflow-y: auto;
          }
          .left-column {
            overflow: visible;
          }
          .right-column {
            width: 100%;
            border-left: none;
            border-top: 1px solid #e2e8f0;
          }
        }
      `}</style>

      <div className="modal-backdrop" onClick={onClose}></div>

      <div className="modal-container">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <div className="modal-body">
            {/* Left Column: Content */}
            <div className="left-column">
              <button onClick={onClose} className="close-btn-floating">
                <X className="w-6 h-6 text-gray-900" />
              </button>

              <div className="hero-image-container">
                <img src={event.image} alt={event.title} className="hero-image" />
                <div className="hero-overlay" />
                <div className="absolute bottom-0 left-0 p-12 w-full">
                  <div className="flex gap-3 mb-4">
                    <span className="tag-pill bg-white/20 text-white backdrop-blur-md border border-white/20">
                      <Tag className="w-4 h-4" />
                      {event.category}
                    </span>
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-2 shadow-sm">{event.title}</h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="content-wrapper">
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About this Event</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {event.description || "No description available for this event."}
                  </p>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-lg font-semibold text-gray-900">{event.date}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="text-lg font-semibold text-gray-900">{event.horaire || "TBA"}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {currentStock > 0 ? "Available" : "Sold Out"}
                      </p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Capacity</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {event.nbPlace} Places
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking */}
            <div className="right-column">
              <div className="booking-card">

                {/* Ticket Types Selector */}
                {ticketTypes.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Ticket Type</label>
                    <select
                      value={selectedTicketType?.id || ""}
                      onChange={(e) => {
                        const type = ticketTypes.find(t => t.id === e.target.value);
                        setSelectedTicketType(type);
                        setQuantity(1);
                      }}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 mb-3"
                    >
                      {ticketTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} - {type.price} TND ({type.remainingQuantity} left)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Price per ticket</p>
                    <h3 className="text-4xl font-bold text-gray-900 mt-1">
                      {currentPrice} <span className="text-lg text-gray-500 font-normal">TND</span>
                    </h3>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Best Value
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Quantity</label>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                      <button
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" style={{ color: "#000" }} />
                      </button>
                      <span className="text-xl font-bold text-gray-900">{quantity}</span>
                      <button
                        onClick={handleIncrease}
                        disabled={quantity >= currentStock}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" style={{ color: "#000" }} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      {currentStock} tickets remaining
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>{currentPrice} TND x {quantity}</span>
                      <span>{(currentPrice * quantity).toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Fee</span>
                      <span>0.00 TND</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>{(currentPrice * quantity).toFixed(2)} TND</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={loading || currentStock === 0}
                    className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Book Ticket
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-400">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EventDetailsModal;