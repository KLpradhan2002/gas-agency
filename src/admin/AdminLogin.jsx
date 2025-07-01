import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../auth/Auth.css";

// Example admin credentials (replace with secure backend check in production)
const ADMIN_EMAIL = "admin@gogas.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="email" type="email" placeholder="Admin Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
