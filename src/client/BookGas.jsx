import {auth , db} from "../firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore"
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./BookGas.css";

export default function BookGas(){

    const [uid, setUid] = useState("");
    const [msg, setMsg] = useState("");
    const [address, setAddress] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [payment, setPayment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) setUid(user.uid);
            else setUid("");
        });
        return () => unsubscribe();
    }, []);

    const bookGas= async(e)=>{
        e.preventDefault();
        if (!uid) {
            setMsg("You must be logged in to book gas. Redirecting to signup...");
            setTimeout(() => {
                navigate('/signup');
            }, 1000);
            return;
        }
        if (!payment) {
            setMsg("Please select a payment option.");
            return;
        }
        const ref = doc(db,"users",uid);
        const snap = await getDoc(ref);
        const data =snap.data();
        const thisYear = new Date().getFullYear();
        const allBookings = data.bookings || [];
        const thisYearBookings = allBookings.filter((b)=> b.year === thisYear);

        if (thisYearBookings.length >= 12){
            setMsg("You reached your yearly booking limit.");
            return;
        };

        const newBooking ={
            date:new Date().toISOString(),
            year: thisYear,
            status :"pending",
            address,
            quantity,
            payment
        }
        
        await updateDoc(ref, {
            bookings: [...allBookings, newBooking],
        });

        setMsg("Gas booked successfully");
        setAddress("");
        setQuantity(1);
        setPayment("");
    };

    return(
        <div className="gas-booking-container">
            <h1 className="gas-booking-title">Book Gas</h1>
            <form onSubmit={bookGas} className="gas-booking-form">
                <div>
                    <label>Delivery Address</label>
                    <input type="text" value={address} onChange={e=>setAddress(e.target.value)} required placeholder="Enter your address" />
                </div>
                <div>
                    <label>Quantity (Cylinders)</label>
                    <input type="number" min="1" max="5" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} required />
                </div>
                <div>
                    <label>Payment Option</label>
                    <select value={payment} onChange={e=>setPayment(e.target.value)} required>
                        <option value="">Select payment method</option>
                        <option value="Online">Online</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                </div>
                <button type="submit">Book Now</button>
            </form>
            <p className="gas-booking-msg">{msg}</p>
        </div>
    );
}
