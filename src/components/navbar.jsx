import { signOut } from "firebase/auth";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import "./navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Sync admin state from localStorage
    const syncAdminState = useCallback(() => {
        setIsAdmin(localStorage.getItem("isAdmin") === "true");
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        syncAdminState();
        window.addEventListener("storage", syncAdminState);
        return () => {
            unsubscribe();
            window.removeEventListener("storage", syncAdminState);
        };
    }, [syncAdminState]);

    const isOnAdminPage = location.pathname.startsWith('/admin');
    const showAuthButton = !(isAdmin && !user && isOnAdminPage);

    const handleLogout = async () => {
        if (isAdmin && !user) {
            localStorage.removeItem("isAdmin");
            setIsAdmin(false);
            navigate('/admin/login');
            setTimeout(syncAdminState, 100);
        } else {
            await signOut(auth);
            navigate('/login');
        }
    };

    const handleLogin = () => {
        // Always go to user login for Login button
        navigate('/login');
    };

    const handleAdminClick = (e) => {
        e.preventDefault();
        if (!location.pathname.startsWith('/admin')) {
            navigate('/admin/login');
        }
    };

    // Helper to check if a link is active
    const isActive = (path) => {
        if (path === "/admin/login") return location.pathname.startsWith("/admin");
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="navbar">
            <Link to="/" className="navbar-title">GoGas</Link>
            <ul className="nav-links">
                <Link to="/" className={`nav-link${isActive("/") ? " nav-link-active" : ""}`}>Home</Link>
                <Link to="/book" className={`nav-link${isActive("/book") ? " nav-link-active" : ""}`}>Book Gas</Link>
                <Link to="/track" className={`nav-link${isActive("/track") ? " nav-link-active" : ""}`}>Track Order</Link>
                <Link to="/notification" className={`nav-link${isActive("/notification") ? " nav-link-active" : ""}`}>Notification</Link>
                <Link to="/contact" className={`nav-link${isActive("/contact") ? " nav-link-active" : ""}`}>Contact</Link>
                {(!user || isOnAdminPage) && (
                    <a href="/admin/login" className={`nav-link${isActive("/admin/login") ? " nav-link-active" : ""}`} onClick={handleAdminClick}>Admin</a>
                )}
            </ul>
            <div className="nav-right">
                {showAuthButton && (user ? (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                ) : (
                    <button onClick={handleLogin} className="logout-btn">Login</button>
                ))}
            </div>
        </div>
    );
}