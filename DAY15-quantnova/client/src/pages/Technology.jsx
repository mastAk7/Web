import { useEffect, useState } from "react";
import api from "../api";

export default function Technology() {
  const [tech, setTech] = useState([]);
  useEffect(() => { api.get("/api/stats").then(r => setTech(r.data.tech)); }, []);

  return (
    <div className="container">
      <h2>Technology & Data Edge</h2>
      <div className="grid">
        {tech.map((t) => (
          <div key={t} className="card">{t}</div>
        ))}
      </div>
    </div>
  );
}


