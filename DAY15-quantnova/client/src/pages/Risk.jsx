export default function Risk() {
  const rows = [
    { risk: "Model Overfit", mitigation: "Cross-validation, live gating" },
    { risk: "Liquidity", mitigation: "Position sizing, slippage models" },
    { risk: "Tail Events", mitigation: "Convex hedges, circuit-breakers" },
    { risk: "Counterparty", mitigation: "Diversified brokers, margin buffers" },
  ];

  return (
    <div className="container">
      <h2>Risk Management</h2>
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div><strong>Risk</strong></div>
          <div><strong>Mitigation</strong></div>
          {rows.map((r) => (
            <>
              <div key={r.risk}>{r.risk}</div>
              <div className="small">{r.mitigation}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}


