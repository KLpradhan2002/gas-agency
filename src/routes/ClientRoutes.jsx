import { Route,Routes } from "react-router-dom";
import Home from "../client/Home";
import Contact from "../client/Contact";
import TrackOrder  from "../client/TrackOrder";
import BookGas from "../client/BookGas";
import Signup from "../auth/Signup";
import Login from "../auth/Login";
import Notification from "../client/Notification";

export default function ClientRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/track" element={<TrackOrder/>}/>
            <Route path="/book" element={<BookGas/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/notification" element={<Notification/>}/>
        </Routes>
    )
};