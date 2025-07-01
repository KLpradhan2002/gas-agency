import React, {useEffect, useState} from "react";
import {db} from '../firebase';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import './AdminTable.css';

export default function ViewBookings(){
    const [bookings,setBookings]=useState([]);
    const [refresh, setRefresh] = useState(false);
    const [editIdx, setEditIdx] = useState(null);
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");

    useEffect(()=>{
        const fetchBookings = async()=>{
            const usersSnapshot = await getDocs(collection(db,'users'));
            let allBookings = [];
            usersSnapshot.forEach(docSnap => {
                const user = docSnap.data();
                const userBookings = (user.bookings || []).map((b, idx) => ({
                    ...b,
                    userEmail: user.email || docSnap.id,
                    userName: user.name || "Unknown",
                    userId: docSnap.id,
                    bookingIdx: idx
                }));
                allBookings = allBookings.concat(userBookings);
            });
            setBookings(allBookings);
        };
        fetchBookings();
    },[refresh]);

    const updateBooking = async (userId, bookingIdx, updateObj) => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDocs(collection(db, 'users'));
        let userDoc;
        userSnap.forEach(docSnap => {
            if(docSnap.id === userId) userDoc = docSnap.data();
        });
        if (!userDoc) return;
        const bookingsArr = userDoc.bookings || [];
        bookingsArr[bookingIdx] = {
            ...bookingsArr[bookingIdx],
            ...updateObj
        };
        await updateDoc(userRef, { bookings: bookingsArr });
        setRefresh(r => !r);
        setEditIdx(null);
    };

    const handleConfirm = (userId, bookingIdx) => {
        updateBooking(userId, bookingIdx, {
            status: 'confirmed',
            confirmDate: new Date().toISOString()
        });
    };

    const handleCancel = (userId, bookingIdx) => {
        updateBooking(userId, bookingIdx, {
            status: 'cancelled',
            cancelDate: new Date().toISOString()
        });
    };

    const handleEdit = (idx, booking) => {
        setEditIdx(idx);
        setEditDate(booking.deliveryDate ? booking.deliveryDate.split('T')[0] : "");
        setEditTime(booking.deliveryTime || "");
    };

    const handleSave = (userId, bookingIdx) => {
        updateBooking(userId, bookingIdx, {
            deliveryDate: editDate,
            deliveryTime: editTime
        });
    };

    return(
        <div className="admin-table-container">
            <h2 className="admin-table-title">Gas Bookings</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Address</th>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Delivery Date</th>
                        <th>Delivery Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, idx)=>(
                        <tr key={idx}>
                            <td>{booking.userName} ({booking.userEmail})</td>
                            <td>{booking.address}</td>
                            <td>{booking.date ? new Date(booking.date).toLocaleDateString() : ''}</td>
                            <td>{booking.quantity}</td>
                            <td>{booking.status}</td>
                            <td>
                                {editIdx === idx ? (
                                    <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} />
                                ) : (
                                    booking.deliveryDate || "-"
                                )}
                            </td>
                            <td>
                                {editIdx === idx ? (
                                    <input type="time" value={editTime} onChange={e=>setEditTime(e.target.value)} />
                                ) : (
                                    booking.deliveryTime || "-"
                                )}
                            </td>
                            <td>
                                {editIdx === idx ? (
                                    <>
                                        <button onClick={()=>handleSave(booking.userId, booking.bookingIdx)}>Save</button>
                                        <button onClick={()=>setEditIdx(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                                            <button onClick={() => handleConfirm(booking.userId, booking.bookingIdx)}>
                                                Confirm
                                            </button>
                                        )}
                                        {booking.status !== 'cancelled' && (
                                            <button onClick={() => handleEdit(idx, booking)} style={{marginLeft:4}}>Edit</button>
                                        )}
                                        <button onClick={() => handleCancel(booking.userId, booking.bookingIdx)} style={{marginLeft:4, color:'red'}}>
                                            Cancel
                                        </button>
                                        {booking.status === 'confirmed' && booking.confirmDate && (
                                            <div style={{fontSize:'0.8em'}}>Confirmed on {new Date(booking.confirmDate).toLocaleString()}</div>
                                        )}
                                        {booking.status === 'cancelled' && booking.cancelDate && (
                                            <div style={{fontSize:'0.8em', color:'red'}}>Cancelled on {new Date(booking.cancelDate).toLocaleString()}</div>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};