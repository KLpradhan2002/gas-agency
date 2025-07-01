import "./Contact.css";

export default function Contact() {
    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <form className="contact-form">
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <textarea placeholder="Your message" rows={4}></textarea>
                <button type="submit">Send</button>
            </form>
            <div className="contact-info">
                <div className="contact-card">
                    <span className="contact-icon" role="img" aria-label="phone">📞</span>
                    <div>
                        <div className="contact-label">Mobile</div>
                        <div className="contact-value">+91-9437755276</div>
                    </div>
                </div>
                <div className="contact-card">
                    <span className="contact-icon" role="img" aria-label="email">✉️</span>
                    <div>
                        <div className="contact-label">Email</div>
                        <div className="contact-value">kamallochanpradhan39@gmail.com</div>
                    </div>
                </div>
            </div>
        </div>
    );
}