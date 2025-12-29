import React, { useState, useEffect, useRef } from "react";
import { FaPlane } from "react-icons/fa";
import { User, Calendar, LayoutDashboard, LogOut, ChevronDown, Ticket } from "lucide-react";
import { navLinks } from "../constants";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const handleUserChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleUserChange);
    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userChanged"));

    // Redirect to home and force a page reload
    window.location.href = "/";
  };

  const isOrganizer = user?.role === "ORGANIZER";
  const isAdmin = user?.role === "ADMIN";

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return (firstName[0] || "") + (lastName[0] || "");
  };

  return (
    <>
      <style>{`
        .user-menu {
          position: relative;
        }

        .dashboard-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: #f3f4f6;
          border-radius: 9999px;
          color: #111827;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          text-decoration: none;
        }

        .dashboard-nav-link:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .dashboard-nav-link.admin {
          background: #fef2f2;
          color: #991b1b;
        }

        .dashboard-nav-link.admin:hover {
          background: #991b1b;
          color: #fff;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 1rem 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 9999px;
          font-weight: 700;
          color: #1a1a1a;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .user-btn:hover {
          background: #fff;
          border-color: #3b82f6;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
        }

        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: -0.02em;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 220px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          animation: slideDown 0.2s ease-out;
          z-index: 1000;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: white;
          border: none;
          text-align: left;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f3f4f6;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: #f9fafb;
        }

        .dropdown-item.organizer {
          color: #f59e0b;
        }

        .dropdown-item.organizer:hover {
          background: #fffbeb;
        }

        .dropdown-item.admin {
          color: #3b82f6;
        }

        .dropdown-item.admin:hover {
          background: #eff6ff;
        }

        .dropdown-item.logout {
          color: #ef4444;
        }

        .dropdown-item.logout:hover {
          background: #fef2f2;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0.25rem 0;
        }

        .chevron-icon {
          transition: transform 0.3s ease;
        }

        .user-btn:hover .chevron-icon {
          transform: translateY(2px);
        }
      `}</style>

      <header
        className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}
        style={{
          height: "100px",
          padding: "10px 30px",
          alignItems: "center",
        }}
      >
        <div className="inner">
          <a href="/" className="logo" style={{ fontSize: "3rem", fontWeight: "bold" }}>
            UTrip
          </a>

          <nav className="desktop">
            <ul>
              {navLinks.map(({ link, name }) => (
                <li key={name} className="group">
                  <a
                    href={link.startsWith("#") ? `/${link}` : link}
                    onClick={(e) => {
                      if (link.startsWith("#") && window.location.pathname !== "/") {
                        e.preventDefault();
                        window.location.href = `/${link}`;
                      }
                    }}
                  >
                    <span>{name}</span>
                    <span className="underline" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {(isAdmin || isOrganizer) && (
              <a
                href={isAdmin ? "/dashboard" : "/organizer-dashboard"}
                className={`dashboard-nav-link ${isAdmin ? 'admin' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </a>
            )}

            {!user ? (
              <a
                href="#login"
                className="contact-btn group"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(true);
                }}
              >
                <div className="inner">
                  <span>Login / Signup</span>
                </div>
              </a>
            ) : (
              <div className="user-menu" ref={dropdownRef}>
                <button className="user-btn" onClick={() => setShowDropdown((prev) => !prev)}>
                  <div className="user-avatar">{getUserInitials()}</div>
                  <span>{user.firstName || "User"}</span>
                  <ChevronDown className="chevron-icon" size={16} />
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setShowProfile(true);
                        setShowDropdown(false);
                      }}
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        window.location.href = "/my-tickets";
                        setShowDropdown(false);
                      }}
                    >
                      <Ticket size={18} />
                      <span>My Tickets</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={18} />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default NavBar;