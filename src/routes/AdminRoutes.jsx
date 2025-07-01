import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import ManageUsers from "../admin/ManageUsers";
import ViewBookings from "../admin/ViewBookings";
import AdminLogin from "../admin/AdminLogin";
import AdminNotification from "../admin/AdminNotification";

export default function AdminRoutes(){
    return(
        <Routes>
            <Route path="" element={<AdminDashboard/>}/>
            <Route path="login" element={<AdminLogin/>}/>
            <Route path="manage-users" element={<ManageUsers/>}/>
            <Route path="view-bookings" element={<ViewBookings/>}/>
            <Route path="notification" element={<AdminNotification/>}/>
        </Routes>
    )
}