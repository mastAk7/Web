import { useState } from "react";
import api from "../api";

export default function Contact() {
  const [lead, setLead] = useState({ name: "", email: "", investorType: "", message: "", requestPitchDeck: false });
  const [leadOk, setLeadOk] = useState("");

  const submitLead = async (e) => {
    e.preventDefault();
    setLeadOk("");
    try {
      const { data } = await api.post("/api/leads", lead);
      if (data.ok) setLeadOk("Thanks! We'll reach out soon.");
      setLead({ name: "", email: "", investorType: "", message: "", requestPitchDeck: false });
    } catch (e) {
      setLeadOk("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Contact & Request Access</h2>
      <div className="card">
        <form className="form contact-form" onSubmit={submitLead}>
          <div className="form-row">
            <div>
              <label>Name</label>
              <input value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Your full name" required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="name@company.com" required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Investor Type</label>
              <select value={lead.investorType} onChange={(e) => setLead({ ...lead, investorType: e.target.value })}>
                <option value="">Select</option>
                <option>Institution</option>
                <option>HNWI/Family Office</option>
                <option>NRI/Foreign</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label>Request Pitch Deck</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={lead.requestPitchDeck} onChange={(e) => setLead({ ...lead, requestPitchDeck: e.target.checked })} />
                <span className="small">Email me the deck</span>
              </label>
            </div>
          </div>
          <div>
            <label>Message</label>
            <textarea rows="4" value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} placeholder="Tell us a bit about you and your objectives." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" type="submit">Request Access</button>
            {leadOk && <div className="small">{leadOk}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}


