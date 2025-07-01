import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './AdminTable.css';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [showHistory, setShowHistory] = useState({}); // { userId: true/false }

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        }
        fetchUsers();
    }, []);

    const toggleHistory = (userId) => {
        setShowHistory(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    return (
        <div className="admin-table-container">
            <h2 className="admin-table-title">Registered Users</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Booking History</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <React.Fragment key={user.id}>
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button className="admin-history-btn" onClick={() => toggleHistory(user.id)}>
                                        {showHistory[user.id] ? 'Hide History' : 'Show History'}
                                    </button>
                                </td>
                            </tr>
                            {showHistory[user.id] && (
                                <tr>
                                    <td colSpan={3}>
                                        <div className="booking-history-list" style={{ marginTop: 0 }}>
                                            {(!user.bookings || user.bookings.length === 0) ? (
                                                <div style={{ color: '#888', textAlign: 'center' }}>No bookings found.</div>
                                            ) : (
                                                <table className="booking-history-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Address</th>
                                                            <th>Quantity</th>
                                                            <th>Payment</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {user.bookings.slice().reverse().map((b, i) => (
                                                            <tr key={i}>
                                                                <td>{b.date ? new Date(b.date).toLocaleString() : '-'}</td>
                                                                <td>{b.address}</td>
                                                                <td>{b.quantity}</td>
                                                                <td>{b.payment}</td>
                                                                <td>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}