import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminNotification() {
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePost = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!message.trim()) {
            setError("Notification message cannot be empty.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, "notifications"), {
                message,
                createdAt: Timestamp.now()
            });
            setSuccess("Notification posted successfully!");
            setMessage("");
        } catch (err) {
            setError("Failed to post notification.");
        }
        setLoading(false);
    };

    return (
        <div className="admin-dashboard-container">
            <h2 className="admin-dashboard-title">Post Notification</h2>
            <form className="admin-notification-form" onSubmit={handlePost}>
                <textarea
                    className="admin-notification-textarea"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Enter notification message..."
                    rows={4}
                />
                <button className="admin-dashboard-btn" type="submit" disabled={loading}>
                    {loading ? "Posting..." : "Post Notification"}
                </button>
            </form>
            {success && <div className="admin-notification-success">{success}</div>}
            {error && <div className="admin-notification-error">{error}</div>}
        </div>
    );
}
