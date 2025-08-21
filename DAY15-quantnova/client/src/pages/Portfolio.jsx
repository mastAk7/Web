import { useEffect, useMemo, useState } from "react";
import api from "../api";

function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid #233252", borderRadius: 12, overflow: "hidden" }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: "8px 12px",
            background: value === opt ? "#233252" : "#0e172a",
            color: "#e6eefc",
            border: "none",
            cursor: "pointer"
          }}
        >{opt}</button>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [risk, setRisk] = useState([]);
  const [regime, setRegime] = useState("Growth");
  const [vol, setVol] = useState(15);
  const [alloc, setAlloc] = useState(null);

  useEffect(() => { api.get("/api/stats").then(r => setRisk(r.data.risk)); }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.post("/api/allocate", { regime, volatility: Number(vol) });
        setAlloc(data);
      } catch {}
    };
    run();
  }, [regime, vol]);

  const regimes = useMemo(() => ["Growth", "Inflation", "Recession"], []);

  return (
    <div className="container">
      <h2>Portfolio & Risk Management</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div className="small">Macro Regime</div>
            <Toggle options={regimes} value={regime} onChange={setRegime} />
          </div>
          <div>
            <div className="small">Target Volatility: {vol}%</div>
            <input type="range" min="5" max="30" value={vol} onChange={(e) => setVol(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: 16 }}>
        {(risk || []).map((r) => (
          <div key={r} className="card">{r}</div>
        ))}
      </div>

      <div className="card">
        <h3>Simulated Allocation</h3>
        <p className="small">Illustrative allocation by strategy given selected regime and volatility.</p>
        <div className="grid">
          {alloc?.allocation?.map((a) => (
            <div key={a.strategy} className="card">
              <strong>{a.strategy}</strong>
              <div className="small">{a.weight}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


