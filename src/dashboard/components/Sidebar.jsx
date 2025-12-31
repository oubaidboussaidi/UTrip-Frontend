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
        shadow-md border-r border-gray-300 dark:border-gray-700
      "
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <FaPlane size={24} style={{ marginRight: '8px' }} />
              <span>Utrip</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          <div className="mt-10">
            {filteredLinks.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.link}`} // use link property
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
