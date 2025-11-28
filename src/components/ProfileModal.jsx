import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Mail, Lock, Save, KeyRound } from "lucide-react";
import apiSecure from "../api/apiSecure";

const ProfileModal = ({ onClose }) => {
  const [mode, setMode] = useState("profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, []);

  const getUserInitials = () => {
    const first = firstName || user?.firstName || "";
    const last = lastName || user?.lastName || "";
    return (first[0] || "") + (last[0] || "");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiSecure.put(
        "user/update",
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("userChanged"));

      setMessage("✅ Profile updated successfully!");
      setTimeout(() => onClose(), 1500);
    } catch {
      setMessage("❌ Could not update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

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
    } catch {
      setMessage("❌ Old password is incorrect");
    }
  };

  return createPortal(
    <>
      <style>{`
        .profile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          z-index: 9998;
        }

        .profile-modal-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .profile-modal-content {
          background: white;
          border-radius: 22px;
          max-width: 480px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          box-shadow: 0 16px 30px rgba(0,0,0,0.12);
          animation: slideUp 0.3s ease-out;
        }

        /* ---------------- HEADER SMALLER + NEW COLORS ---------------- */
        .profile-header {
          background: linear-gradient(135deg, #f5e6c8 0%, #e6d2b5 100%);
          padding: 1.4rem;
          border-radius: 22px 22px 0 0;
          text-align: center;
          position: relative;
        }

        .profile-avatar-large {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          font-size: 2rem;
          font-weight: 700;
          color: #b58c54;
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .profile-name {
          color: #4c3b2a;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .profile-email {
          color: #6b5c4a;
          font-size: 0.9rem;
        }

        .close-button-profile {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .close-button-profile:hover {
          background: rgba(255,255,255,0.5);
          transform: rotate(90deg);
        }

        .profile-form {
          padding: 1.4rem;
        }

        /* ---------------- INPUTS ---------------- */
        .input-group {
          margin-bottom: 1.1rem;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #444;
          margin-bottom: 0.4rem;
          font-size: 0.875rem;
        }

        .input-field {
          width: 100%;
          padding: 0.65rem 1rem;
          border: 1px solid #e1dfdb;
          border-radius: 12px;
          background: #faf7f1;
          color: #333;
        }

        .input-field:focus {
          outline: none;
          border-color: #d6b98b;
          background: white;
          box-shadow: 0 0 0 3px rgba(214,185,139,0.25);
        }

        /* ---------------- BUTTONS ---------------- */
        .cta-button-profile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 12px;
          font-weight: 600;
          color: #444;
          transition: 0.2s;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        .cta-button-profile.primary {
          background: #d7b98c;
          border: none;
          color: white;
        }

        .cta-button-profile.primary:hover {
          background: #c5a678;
        }

        /* ---------------- SWITCH ---------------- */
        .mode-switch {
          display: flex;
          gap: 0.4rem;
          padding: 0.4rem;
          background: #f4f0e8;
          border-radius: 12px;
          margin-bottom: 1.2rem;
        }

        .mode-button {
          flex: 1;
          padding: 0.55rem;
          border: none;
          border-radius: 10px;
          background: transparent;
          font-weight: 600;
          color: #7a6b5a;
        }

        .mode-button.active {
          background: white;
          color: #b48c55;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        }

        /* Animations */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="profile-backdrop" onClick={onClose}></div>

      <div className="profile-modal-container" onClick={onClose}>
        <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
          
          {/* HEADER */}
          <div className="profile-header">
            <button onClick={onClose} className="close-button-profile">
              <X className="w-5 h-5 text-black" />
            </button>

            <div className="profile-avatar-large">{getUserInitials()}</div>
            <div className="profile-name">{firstName} {lastName}</div>
            <div className="profile-email">{user?.email}</div>
          </div>

          <div className="profile-form">
            {/* SWITCH */}
            <div className="mode-switch">
              <button
                className={`mode-button ${mode === "profile" ? "active" : ""}`}
                onClick={() => setMode("profile")}
              >
                Profile
              </button>

              <button
                className={`mode-button ${mode === "password" ? "active" : ""}`}
                onClick={() => setMode("password")}
              >
                Password
              </button>
            </div>

            {/* MESSAGES */}
            {message && (
              <div className="message-box">
                {message}
              </div>
            )}

            {/* PROFILE FORM */}
            {mode === "profile" && (
              <form onSubmit={handleSave}>
                <div className="input-group">
                  <label className="input-label"><Mail size={16}/> Email</label>
                  <input className="input-field" value={user.email} disabled />
                </div>

                <div className="input-group">
                  <label className="input-label"><User size={16}/> First Name</label>
                  <input
                    className="input-field"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label"><User size={16}/> Last Name</label>
                  <input
                    className="input-field"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <button className="cta-button-profile primary" type="submit">
                  <Save size={18}/>
                  Save Changes
                </button>
              </form>
            )}

            {/* PASSWORD FORM */}
            {mode === "password" && (
              <form onSubmit={handleChangePassword}>
                <div className="input-group">
                  <label className="input-label"><Lock size={16}/> Old Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label"><KeyRound size={16}/> New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label"><KeyRound size={16}/> Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="input-field"
                  />
                </div>

                <button className="cta-button-profile primary" type="submit">
                  <Lock size={18}/>
                  Update Password
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
