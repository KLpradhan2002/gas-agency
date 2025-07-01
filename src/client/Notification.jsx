import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import "./Notification.css";

export default function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            const notes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(notes);
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    return (
        <div className="notification-container">
            <h1 className="notification-title">Notifications</h1>
            {loading ? (
                <p>Loading...</p>
            ) : notifications.length === 0 ? (
                <p style={{fontSize: '1.1rem', color: '#444'}}>You have no new notifications.</p>
            ) : (
                <ul className="notification-list">
                    {notifications.map(note => (
                        <li className="notification-item" key={note.id}>
                            <span role="img" aria-label="bell">🔔</span>
                            <div>
                                <div>{note.message}</div>
                                {note.createdAt && (
                                    <div className="notification-date">
                                        {note.createdAt.toDate ? note.createdAt.toDate().toLocaleString() : ""}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
