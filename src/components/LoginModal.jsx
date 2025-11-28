import React, { useState } from "react";
import apiAuth from "../api/apiAuth";

const LoginModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const body = isLogin
        ? { email, password }
        : { email, password, firstName, lastName };

      const { data } = await apiAuth.post(endpoint, body);

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userChanged"));
        alert("✅ Login successful!");
      } else {
        alert("⚠️ Signup successful! Please verify your email.");
      }

      onClose();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "An error occurred.");
      } else {
        alert("⚠️ Network error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>

      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ color: "black", maxWidth: 400, width: "90%", padding: "1rem" }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
        >
          {!isLogin && (
            <>
              <input
                type="text"
                required
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#f5f5dc",
                }}
              />

              <input
                type="text"
                required
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#f5f5dc",
                }}
              />
            </>
          )}

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.6rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f5f5dc",
            }}
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.6rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f5f5dc",
            }}
          />

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
              textAlign: "center",
              marginTop: "0.4rem",
            }}
          >
            {isLogin ? "Create an account" : "Already have account?"}
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem",
              backgroundColor: "#e0dfd5",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              color: "black",
              marginTop: "0.4rem",
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginModal;
