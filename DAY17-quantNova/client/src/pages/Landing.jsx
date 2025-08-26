import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Landing() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/api/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <header className="hero container">
        <div className="feature-badge">
          <span className="sparkle">✨</span>
          Next-Generation AI Hedge Fund
        </div>
        <h1>{stats?.tagline || "Turning Volatility into Opportunity."}</h1>
        <p>{stats?.subtext || "India's first multi-strategy, AI-powered hedge fund."}</p>
        <div className="quick">
          {(stats?.quick || []).map((q, i) => <span key={i} className="tag">{q}</span>)}
        </div>
        <div className="hero-cta">
          <Link to="/strategies" className="btn">Explore Our Strategy</Link>
          <a className="btn" href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/pitch-deck`} target="_blank" rel="noreferrer">Download Pitch Deck</a>
          <Link to="/contact" className="btn">Request Access</Link>
        </div>
        <p className="small disclaimer">
          Educational demo. Not an offer to sell or solicit securities.
        </p>
      </header>
    </>
  );
}


