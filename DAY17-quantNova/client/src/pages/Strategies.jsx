import { useEffect, useState } from "react";
import api from "../api";

function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="small">{children}</p>
    </div>
  );
}

export default function Strategies() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/api/stats").then(r => setStats(r.data)); }, []);

  const sections = [
    { k: "Factor Equity", d: (
      <>
        <strong>How it works:</strong> Multifactor signals across value, quality, momentum.<br/>
        <strong>Why it wins:</strong> Persistent factor premia in EMs.<br/>
        <strong>Risks:</strong> Factor crowding, drawdowns.<br/>
        <strong>Mitigation:</strong> Diversified tilts, dynamic exposure.
      </>
    )},
    { k: "Stat-Arb", d: (
      <>
        <strong>How it works:</strong> Mean-reversion and co-integration pairs.
        <br/><strong>Why it wins:</strong> Micro-inefficiencies persist.
        <br/><strong>Risks:</strong> Regime breaks.
        <br/><strong>Mitigation:</strong> Regime filters, stop-outs.
      </>
    )},
    { k: "Volatility Trading", d: (
      <>
        <strong>How it works:</strong> Long/short vol via options and futures.
        <br/><strong>Why it wins:</strong> Vol risk premium and convexity.
        <br/><strong>Risks:</strong> Tail events.
        <br/><strong>Mitigation:</strong> Position limits, convex hedges.
      </>
    )},
    { k: "AI/ML Alpha", d: (
      <>
        <strong>How it works:</strong> Tree/NN models on rich features.
        <br/><strong>Why it wins:</strong> Nonlinear alpha capture.
        <br/><strong>Risks:</strong> Overfitting.
        <br/><strong>Mitigation:</strong> Cross-validation, live gates.
      </>
    )},
    { k: "Alternative Data", d: (
      <>
        <strong>How it works:</strong> Satellite, web, card, supply-chain.
        <br/><strong>Why it wins:</strong> Faster information.
        <br/><strong>Risks:</strong> Data bias.
        <br/><strong>Mitigation:</strong> Bias audits, privacy compliance.
      </>
    )},
    { k: "Macro Overlays", d: (
      <>
        <strong>How it works:</strong> Systematic macro hedges and overlays.
        <br/><strong>Why it wins:</strong> Downside protection.
        <br/><strong>Risks:</strong> Hedge drag.
        <br/><strong>Mitigation:</strong> Dynamic activation.
      </>
    )},
  ];

  const order = stats?.strategies || sections.map(s => s.k);
  const list = order.map(k => sections.find(s => s.k === k) || { k, d: null });

  return (
    <div className="container">
      <h2>Strategy Pods</h2>
      <div className="grid">
        {list.map(({ k, d }) => (
          <Card key={k} title={k}>{d}</Card>
        ))}
      </div>
    </div>
  );
}


