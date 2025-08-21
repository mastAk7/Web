import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <nav className="nav">
      <div className="nav-inner container">
        <strong><Link to="/">QuantNova Fund</Link></strong>
        <button className="nav-toggle" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/strategies" onClick={close}>Strategies</NavLink>
          <NavLink to="/portfolio" onClick={close}>Risk</NavLink>
          <NavLink to="/capital" onClick={close}>Capital</NavLink>
          <NavLink to="/technology" onClick={close}>Technology</NavLink>
          <NavLink to="/compliance" onClick={close}>Compliance</NavLink>
          <NavLink to="/positioning" onClick={close}>Why Us</NavLink>
          <NavLink to="/contact" className="btn" onClick={close}>Request Access</NavLink>
        </div>
      </div>
    </nav>
  );
}


