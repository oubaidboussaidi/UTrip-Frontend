import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Mail, Lock, Save, KeyRound, Bell, Settings, ShieldCheck } from "lucide-react";
import apiSecure from "../api/apiSecure";

const ProfileModal = ({ onClose }) => {
  const [mode, setMode] = useState("profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await apiSecure.get("user/me");
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setReceiveNotifications(data.receiveNotifications !== false);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        if (user) {
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setReceiveNotifications(user.receiveNotifications !== false);
        }
      }
    };
    fetchUserData();
  }, []);

  const getUserInitials = () => {
    const first = firstName || user?.firstName || "";
    const last = lastName || user?.lastName || "";
    return (first[0] || "") + (last[0] || "");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setMessage("❌ Names must be at least 2 characters");
      return;
    }
    try {
      const { data } = await apiSecure.put(
        "user/update",
        { firstName, lastName, receiveNotifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("userChanged"));

      setMessage("✅ Profile updated successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data || "❌ Could not update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage("❌ New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("❌ New passwords do not match");
      return;
    }

    try {
      await apiSecure.put(
        "user/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Password changed successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data || "❌ Old password is incorrect");
    }
  };

  return createPortal(
    <>
      <style>{`
        .profile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(12px);
          z-index: 9998;
          animation: fadeIn 0.3s ease-out;
        }

        .profile-modal-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .profile-modal-content {
          background: white;
          border-radius: 32px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
        }

        .profile-header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
        }

        .profile-avatar-wrapper {
          position: relative;
          width: 90px;
          height: 90px;
          margin: 0 auto 1.25rem;
        }

        .profile-avatar-large {
          width: 100%;
          height: 100%;
          border-radius: 30px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.25rem;
          font-weight: 800;
          color: white;
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
          border: 4px solid rgba(255, 255, 255, 0.1);
          transform: rotate(-3deg);
        }

        .profile-badge {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: #10b981;
          color: white;
          padding: 4px;
          border-radius: 10px;
          border: 3px solid #0f172a;
        }

        .profile-name {
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }

        .profile-email {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .close-button-profile {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          color: white;
        }

        .close-button-profile:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }

        .content-body {
           overflow-y: auto;
           padding: 2rem;
        }

        .mode-tabs {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.5rem;
          border-radius: 18px;
          margin-bottom: 2rem;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          color: #64748b;
          transition: all 0.3s;
          cursor: pointer;
        }

        .tab-btn.active {
          background: white;
          color: #2563eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .field-group {
          margin-bottom: 1.5rem;
        }

        .field-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
        }

        .styled-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 3rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          transition: all 0.3s;
        }

        .styled-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .styled-input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          color: #94a3b8;
        }

        .toggle-card {
          background: #f8fafc;
          border-radius: 18px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 2px solid #f1f5f9;
          margin-bottom: 1.5rem;
        }

        .toggle-info h4 {
          font-weight: 700;
          font-size: 0.95rem;
          color: #1e293b;
        }

        .toggle-info p {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .save-btn {
          width: 100%;
          padding: 1.15rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .save-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4);
        }

        .status-msg {
          padding: 1rem;
          border-radius: 16px;
          margin-bottom: 1.5rem;
          font-weight: 700;
          text-align: center;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(40px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
      `}</style>

      <div className="profile-backdrop" onClick={onClose}></div>

      <div className="profile-modal-container" onClick={onClose}>
        <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>

          <div className="profile-header">
            <button onClick={onClose} className="close-button-profile">
              <X size={20} />
            </button>
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">{getUserInitials()}</div>
              <div className="profile-badge">
                <ShieldCheck size={16} />
              </div>
            </div>
            <h2 className="profile-name">{firstName} {lastName}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div className="content-body">
            <div className="mode-tabs">
              <button
                className={`tab-btn ${mode === "profile" ? "active" : ""}`}
                onClick={() => setMode("profile")}
              >
                <Settings size={18} />
                Profile Info
              </button>
              <button
                className={`tab-btn ${mode === "password" ? "active" : ""}`}
                onClick={() => setMode("password")}
              >
                <ShieldCheck size={18} />
                Security
              </button>
            </div>

            {message && (
              <div className={`status-msg ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message}
              </div>
            )}

            {mode === "profile" ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="toggle-card">
                  <div className="toggle-info">
                    <h4>Smart Notifications</h4>
                    <p>Receive live travel alerts & updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={receiveNotifications}
                      onChange={(e) => setReceiveNotifications(e.target.checked)}
                    />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="field-group col-span-2">
                    <label className="field-label">Primary Email</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input className="styled-input" value={user.email} disabled />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">First Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input
                        className="styled-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Last Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input
                        className="styled-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="save-btn">
                  <Save size={20} />
                  Update Profile
                </button>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="field-group">
                  <label className="field-label">Current Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      type="password"
                      className="styled-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">New Password</label>
                  <div className="input-wrapper">
                    <KeyRound className="input-icon" size={18} />
                    <input
                      type="password"
                      className="styled-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Repeat New Password</label>
                  <div className="input-wrapper">
                    <ShieldCheck className="input-icon" size={18} />
                    <input
                      type="password"
                      className="styled-input"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="save-btn">
                  <Lock size={20} />
                  Change Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ProfileModal;
