import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

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
    flex justify-between p-2  relative
    bg-gray-100 dark:bg-gray-800
    shadow-md border-b border-gray-300 dark:border-gray-700
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
          <TooltipComponent content="Profile Options" position="BottomCenter">
            <div
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <p className="flex flex-col leading-tight">
                <span className="text-gray-300 text-md font-semibold">
                  Hi {user?.role === "ADMIN" ? "Admin" : "User"},
                </span>
                <span className="text-white text-lg font-bold">
                  {user?.firstName || "User"}
                </span>
              </p>

              <MdKeyboardArrowDown className="text-gray-500 text-14" />
            </div>
          </TooltipComponent>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-50 dropdown-menu w-40">

              <button
                className="w-full text-left p-2 hover:bg-gray-100 text-black"
                onClick={() => {
                  setShowProfileModal(true);
                  setShowDropdown(false);
                }}
              >
                Profile
              </button>

              {user?.role === "ADMIN" && (
                <button
                  className="w-full text-left p-2 hover:bg-gray-100 text-black"
                  onClick={() => {
                    window.location.href = "/dashboard";
                    setShowDropdown(false);
                  }}
                  style={{ fontWeight: "bold", color: "darkblue" }}
                >
                  Dashboard
                </button>
              )}

              <button
                className="w-full text-left p-2 hover:bg-gray-100 text-red-600 font-semibold"
                onClick={handleLogout}
              >
                Disconnect
              </button>

            </div>
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
