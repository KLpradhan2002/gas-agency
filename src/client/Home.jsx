import "./Home.css";

export default function Home() {
    return (
        <div className="home-container">
            <img
                src="/logo512.png"
                alt="Gas Agency"
                className="home-img"
            />
            <h1 className="home-title">Welcome To GO-GAS</h1>
            <p className="home-desc">Your trusted partner in gas delivery.<br/>Book anytime, anywhere!</p>
        </div>
    );
}