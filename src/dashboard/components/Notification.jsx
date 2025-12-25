import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import apiAdmin from '../../api/apiAdmin';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const { currentColor, handleClick } = useStateContext();
  const [pendingEvents, setPendingEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const { data } = await apiAdmin.fetchAllEvents();
        const pending = data.filter((event) => event.status === 'PENDING');
        setPendingEvents(pending);
      } catch (err) {
        console.error('Error fetching events', err);
      }
    };

    fetchPendingEvents();
  }, []);

  const handleSeeAll = () => {
    handleClick('notification'); // Close popup
    navigate('/dashboard/events'); // Navigate properly
  };

  return (
    <div className="nav-item fixed right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96 z-50 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Notifications</p>
          {pendingEvents.length > 0 && (
            <button
              type="button"
              className="text-white text-xs rounded p-1 px-2 bg-orange-theme"
            >
              {pendingEvents.length} New
            </button>
          )}
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={() => handleClick('notification')} // Close popup
        />
      </div>

      <div className="mt-5 max-h-96 overflow-y-auto">
        {pendingEvents.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No pending events</p>
        ) : (
          pendingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center leading-8 gap-5 border-b border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-yellow-800">
                {event.title.charAt(0)}
              </div>
              <div>
                <p className="font-semibold dark:text-gray-200">{event.title}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {event.location} | {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="See all events"
          borderRadius="10px"
          width="full"
          onClick={handleSeeAll}
        />
      </div>
    </div>
  );
};

export default Notification;
