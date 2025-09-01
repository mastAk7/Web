import React from 'react';
import '../../styles/sections.css';

export default function About() {
  return (
    <div className="card">
      <h2>About Us</h2>
      <p>
        We compute a Hallucination Probability from five light-weight checks — contradiction, evidence, consistency,
        speculative language, and numbers/dates — so users can triage answers quickly and focus human review where it
        matters most.
      </p>
    </div>
  );
}
