import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./TrackOrder.css";

export default function TrackOrder() {
  const [uid, setUid] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("track"); // 'track' or 'history'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid("");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!uid) {
        setBooking(null);
        setBookingHistory([]);
        setLoading(false);
        return;
      }
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      const bookings = (data && data.bookings) ? data.bookings : [];
      setBookingHistory(bookings.slice().reverse());
      if (bookings.length > 0) {
        setBooking(bookings[bookings.length - 1]);
      } else {
        setBooking(null);
      }
      setLoading(false);
    };
    fetchBooking();
  }, [uid]);

  if (loading) return <div>Loading...</div>;
  if (!uid) return <div className="track-order-not-logged">Please login to track your order.</div>;
  if (!booking) return <div>No bookings found.</div>;

  return (
    <div className="track-order-container">
      <div className="trackorder-btn-group">
        <button className={view === "track" ? "trackorder-btn-active" : "trackorder-btn"} onClick={() => setView("track")}>Track Order</button>
        <button className={view === "history" ? "trackorder-btn-active" : "trackorder-btn"} onClick={() => setView("history")}>Booking History</button>
      </div>
      {view === "track" ? (
        <>
          <h2>Track Your Order</h2>
          <div className="track-order-details">
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Booking Date:</strong> {booking.date ? new Date(booking.date).toLocaleString() : "-"}</p>
            <p><strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
            {booking.status === "confirmed" && (
              <>
                <p><strong>Delivery Date:</strong> {booking.deliveryDate || "-"}</p>
                <p><strong>Delivery Time:</strong> {booking.deliveryTime || "-"}</p>
                {booking.confirmDate && <p><strong>Confirmed On:</strong> {new Date(booking.confirmDate).toLocaleString()}</p>}
              </>
            )}
            {booking.status === "cancelled" && booking.cancelDate && (
              <p style={{ color: "red" }}><strong>Cancelled On:</strong> {new Date(booking.cancelDate).toLocaleString()}</p>
            )}
            {booking.status === "pending" && (
              <p>Waiting for admin confirmation.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2>Booking History</h2>
          <div className="booking-history-list">
            {bookingHistory.length === 0 ? (
              <div style={{color: '#888', textAlign: 'center'}}>No previous bookings found.</div>
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
                  {bookingHistory.map((b, i) => (
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
        </>
      )}
    </div>
  );
}
