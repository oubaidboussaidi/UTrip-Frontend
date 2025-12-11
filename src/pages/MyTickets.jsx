import React, { useEffect, useState } from "react";
import { Ticket, Calendar, MapPin, Clock, X } from "lucide-react";
import QRCode from "react-qr-code";
import apiTicket from "../api/apiTicket";
import Navbar from "../components/NavBar";
import { createPortal } from "react-dom";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const { data } = await apiTicket.getMyTickets();
            setTickets(data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 px-5 md:px-20 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-black text-white rounded-2xl">
                        <Ticket className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">My Tickets</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900">No tickets found</h3>
                        <p className="text-gray-500 mt-2">You haven't booked any events yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                            >
                                {/* Decorative circle */}
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                            {ticket.status}
                                        </span>
                                        <span className="text-sm text-gray-400">#{ticket.id.slice(-6)}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                                        {ticket.eventTitle}
                                    </h3>

                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium">{ticket.eventDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <MapPin className="w-4 h-4 text-red-500" />
                                            <span className="text-sm font-medium">{ticket.eventLocation}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Ticket className="w-4 h-4 text-purple-500" />
                                            <span className="text-sm font-medium">{ticket.quantity} Ticket(s)</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-400">Total Paid</p>
                                            <p className="text-lg font-bold text-gray-900">{ticket.totalPrice} TND</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-black transition-colors"
                                        >
                                            View QR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Code Modal */}
            {selectedTicket && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ticket QR Code</h3>
                            <p className="text-gray-500 mb-8">Scan this code at the entrance</p>

                            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block mb-6">
                                <QRCode
                                    value={JSON.stringify({
                                        id: selectedTicket.id,
                                        event: selectedTicket.eventTitle,
                                        user: selectedTicket.userEmail,
                                        quantity: selectedTicket.quantity
                                    })}
                                    size={200}
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium text-gray-900">{selectedTicket.eventTitle}</p>
                                <p className="text-sm text-gray-500">
                                    {selectedTicket.quantity} Ticket(s) • {selectedTicket.totalPrice} TND
                                </p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MyTickets;
