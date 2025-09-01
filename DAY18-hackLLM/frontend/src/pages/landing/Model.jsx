import React from 'react';
import '../../styles/sections.css';

export default function Model() {
  return (
    <div className="card">
      <h2>Model</h2>
      <p>
        The prototype aggregates detector scores into a single Hallucination Probability (0–1). We keep the
        computation transparent and weights configurable so teams can tune sensitivity and prioritize recalls.
      </p>
    </div>
  );
}
