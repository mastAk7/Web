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
      <div className="page-header">
        <h2>Get in Touch</h2>
        <p className="subtitle">Ready to explore investment opportunities? Let's start a conversation.</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">💼</div>
            <h3>Investment Access</h3>
            <p>Connect with our team to discuss investment opportunities and learn about our strategies.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>Strategy Details</h3>
            <p>Get comprehensive insights into our AI-powered multi-strategy approach.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3>Secure Process</h3>
            <p>Your information is protected with enterprise-grade security measures.</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={submitLead}>
            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    id="name"
                    type="text" 
                    value={lead.name} 
                    onChange={(e) => setLead({ ...lead, name: e.target.value })} 
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    value={lead.email} 
                    onChange={(e) => setLead({ ...lead, email: e.target.value })} 
                    placeholder="your.email@company.com" 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Investment Profile</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="investorType">Investor Type</label>
                  <select 
                    id="investorType"
                    value={lead.investorType} 
                    onChange={(e) => setLead({ ...lead, investorType: e.target.value })}
                    required
                  >
                    <option value="">Select investor type</option>
                    <option value="Institution">Institution</option>
                    <option value="HNWI/Family Office">HNWI / Family Office</option>
                    <option value="NRI/Foreign">NRI / Foreign Investor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={lead.requestPitchDeck} 
                      onChange={(e) => setLead({ ...lead, requestPitchDeck: e.target.checked })} 
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">Request Pitch Deck</span>
                  </label>
                  <p className="checkbox-hint">We'll email you our detailed investment presentation</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea 
                  id="message"
                  rows="4" 
                  value={lead.message} 
                  onChange={(e) => setLead({ ...lead, message: e.target.value })} 
                  placeholder="Tell us about your investment objectives, timeline, or any specific questions you have..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                <span className="btn-text">Request Access</span>
                <span className="btn-icon">→</span>
              </button>
              {leadOk && <div className="success-message">{leadOk}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


