import React, { useEffect, useState } from 'react';
import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import apiAdmin from '../../api/apiAdmin';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X, ExternalLink } from 'lucide-react';

const Notification = () => {
  const { currentColor, handleClick } = useStateContext();
  const [pendingEvents, setPendingEvents] = useState([]);
  const navigate = useNavigate();

  const fetchPendingEvents = async () => {
    try {
      const { data } = await apiAdmin.fetchAllEvents();
      const pending = data.filter((event) => event.status === 'PENDING');
      setPendingEvents(pending);
    } catch (err) {
      console.error('Error fetching events', err);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleAction = async (id, title, action) => {
    try {
      if (action === 'approve') {
        await apiAdmin.approveEvent(id);
        alert(`✅ Event "${title}" approved!`);
      } else {
        await apiAdmin.rejectEvent(id);
        alert(`❌ Event "${title}" rejected.`);
      }
      fetchPendingEvents();
    } catch (err) {
      console.error(`Error ${action}ing event`, err);
      alert(`⚠️ Failed to ${action} event.`);
    }
  };

  const handleEventClick = (title) => {
    handleClick('notification'); // Close popup
    navigate(`/dashboard/events?search=${encodeURIComponent(title)}`);
  };

  const handleSeeAll = () => {
    handleClick('notification'); // Close popup
    navigate('/dashboard/events'); // Navigate properly
  };

  return (
    <div className="nav-item fixed right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-6 rounded-3xl w-96 z-[9999] shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-300 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
            <Bell size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-black text-xl text-gray-900 dark:text-white tracking-tight">Pending Events</p>
        </div>
        {pendingEvents.length > 0 && (
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
            {pendingEvents.length} New
          </span>
        )}
      </div>

      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {pendingEvents.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 font-bold">All caught up! 🎉</p>
          </div>
        ) : (
          pendingEvents.map((event) => (
            <div
              key={event.id}
              className="group relative bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleEventClick(event.title)}
                >
                  <p className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors flex items-center gap-1">
                    {event.title}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-wide">
                    {event.location} • {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleAction(event.id, event.title, 'approve')}
                    className="p-2 bg-green-100 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                    title="Approve"
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => handleAction(event.id, event.title, 'reject')}
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                    title="Reject"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={handleSeeAll}
          style={{ backgroundColor: currentColor }}
          className="w-full py-4 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest"
        >
          Manage All Events
        </button>
      </div>
    </div>
  );
};

export default Notification;
