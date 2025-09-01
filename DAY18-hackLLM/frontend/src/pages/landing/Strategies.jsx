import React from 'react';
import '../../styles/sections.css';

export default function Strategies() {
  return (
    <div className="card">
      <h2>Strategies</h2>
      <ul>
        <li>Run detectors in parallel for low latency.</li>
        <li>Surface supporting evidence and links where available.</li>
        <li>Show per-check scores and a combined probability.</li>
        <li>Flag high-probability items for human review.</li>
      </ul>
    </div>
  );
}
