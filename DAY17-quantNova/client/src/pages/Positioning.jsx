export default function Positioning() {
  const bullets = [
    "Thrives in volatility",
    "Multi-strategy diversification",
    "AI + alt-data edge",
    "Institutional-grade risk management",
    "Radical transparency",
    "Regulatory + ethical gold standard",
  ];
  return (
    <div className="container">
      <h2>QuantNova Fund: The Future of Hedge Funds in India</h2>
      <div className="grid" style={{ marginBottom: 48, gap: 24 }}>
        {(bullets || []).map((r) => (
          <div key={r} className="card">{r}</div>
        ))}
      </div>
      <div className="card">
        <h3>Old Hedge Funds vs QuantNova</h3>
        <p className="small">
          Legacy funds rely on discretionary bets. QuantNova is data-driven, multi-strategy and
          transparent by design—built to adapt across regimes.
        </p>
      </div>
    </div>
  );
}


