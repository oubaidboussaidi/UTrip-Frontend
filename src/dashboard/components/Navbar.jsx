import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { motion } from 'framer-motion';
import { User, LayoutDashboard, LogOut } from 'lucide-react';

import { Chat, Notification } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import ProfileModal from "../../components/ProfileModal";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize
  } = useStateContext();

  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const updateUser = () => {
      const updated = localStorage.getItem("user");
      setUser(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("storage", updateUser);
    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userChanged"));
    setUser(null);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveMenu(screenSize > 900);
  }, [screenSize]);

  return (
    <div
      className="
    flex justify-between items-center p-3 relative
    bg-gray-100 dark:bg-gray-800
    shadow-md border-b border-gray-300 dark:border-gray-700
    text-gray-900 dark:text-white
  "
    >


      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu(!activeMenu)}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />

      <div className="flex gap-3 items-center">

        <NavButton
          title="Notifications"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick('notification')}
          color={currentColor}
          icon={<RiNotification3Line />}
        />

        {/* ---------- USER NAME + DROPDOWN ---------- */}
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                {user?.role === "ADMIN" ? "Administrator" : "Organizer"}
              </span>
              <span className="text-gray-900 dark:text-white text-sm font-extrabold flex items-center gap-1">
                {user?.firstName || "User"}
                <MdKeyboardArrowDown className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </span>
            </div>
          </div>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-3 bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-2 z-[100] w-64 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Dropdown Header */}
              <div className="px-4 py-4 mb-2 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                <p className="text-gray-900 dark:text-white font-black text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold truncate">
                  {user?.email}
                </p>
                <div className="mt-2 inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-md uppercase tracking-widest">
                  {user?.role}
                </div>
              </div>

              <div className="space-y-1">
                <button
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors text-sm font-bold"
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                >
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500">
                    <User size={16} />
                  </div>
                  My Profile
                </button>

                {user?.role === "ADMIN" && (
                  <button
                    className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-sm font-bold"
                    onClick={() => {
                      window.location.href = "/dashboard";
                      setShowDropdown(false);
                    }}
                  >
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <LayoutDashboard size={16} />
                    </div>
                    Admin Panel
                  </button>
                )}

                <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2 my-1" />

                <button
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl transition-colors text-sm font-bold"
                  onClick={handleLogout}
                >
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <LogOut size={16} />
                  </div>
                  Disconnect
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {isClicked.chat && <Chat />}
      {isClicked.notification && <Notification />}

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default Navbar;
