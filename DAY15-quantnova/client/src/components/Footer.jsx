export default function Footer() {
  return (
    <footer className="footer container">
      <div>© {new Date().getFullYear()} QuantNova Fund · Educational demo</div>
      <div className="small">
        SEBI AIF Cat III · GIFT City feeder (illustrative) · Daily NAV & quarterly audits (illustrative)
      </div>
    </footer>
  );
}


