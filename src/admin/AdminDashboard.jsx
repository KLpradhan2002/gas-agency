import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await signOut(auth);
        navigate('/login');
    };
    return (
        <div className="admin-dashboard-container">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <div className="admin-dashboard-actions">
                <button className="admin-dashboard-btn" onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
                <button className="admin-dashboard-btn" onClick={() => navigate('/admin/view-bookings')}>View Bookings</button>
                <button className="admin-dashboard-btn" onClick={() => navigate('/admin/notification')}>Post Notification</button>
            </div>
            
            <button className="admin-dashboard-logout" onClick={handleLogOut}>Log Out</button>
        </div>
    );
}