import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  // Filter links logic
  const filteredLinks = links.map(category => {
    // Filter items within category
    const validLinks = category.links.filter(link => {
      if (role === 'ADMIN') {
        // Admin sees everything EXCEPT Organizer specific 'Stats' (which maps to organizer-stats)
        // Actually, 'Stats' in dummy maps to 'dashboard/organizer-stats'.
        // Admin should not see this.
        return link.name !== 'Stats';
      }
      if (role === 'ORGANIZER') {
        // Organizer sees only: 'Stats', 'Dashboard' (Overview?)
        // Let's filter strictly.
        // Allowed names from dummy.jsx: 'Stats' (we added it), 'overview' (generic dashboard)
        // If we want to add 'My Events' we can inject it here or assume it's external.
        const allowed = ['Stats', 'overview'];
        return allowed.includes(link.name);
      }
      return true; // Default or other roles see everything (or filter similarly)
    });
    return { ...category, links: validLinks };
  }).filter(cat => cat.links.length > 0);

  return (
    <div
      className="
        h-full w-72 md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10
        bg-gray-100 dark:bg-gray-800
        shadow-2xl border-r border-gray-200 dark:border-gray-700
      "
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center px-6 py-8">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="group items-center gap-3 flex text-2xl font-black tracking-tighter text-gray-900 dark:text-white"
            >
              <div className="bg-blue-600 p-2 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-blue-600/30">
                <FaPlane size={24} className="text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Utrip</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                className="text-2xl rounded-full p-2 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 mt-1 block md:hidden transition-colors"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          <div className="mt-4 px-4">
            {filteredLinks.map((item) => (
              <div key={item.title} className="mb-8">
                <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 pl-4 opacity-70">
                  {item.title}
                </p>
                <div className="space-y-1">
                  {item.links.map((link) => (
                    <NavLink
                      to={`/${link.link}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? currentColor : '',
                        boxShadow: isActive ? `0 10px 15px -3px ${currentColor}40` : '',
                      })}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group
                        ${isActive
                          ? 'text-white translate-x-1'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 hover:translate-x-1'}`
                      }
                    >
                      <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                      <span className="capitalize tracking-tight">{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
