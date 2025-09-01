import React from 'react';
import About from './landing/About.jsx';
import Strategies from './landing/Strategies.jsx';
import Model from './landing/Model.jsx';
import '../styles/theme.css';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="landing-root">
      <header className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Hallucination Probability</h1>
          <p className="hero-sub">Five detectors. One probability. Quick, explainable checks for AI answers.</p>
        </div>
      </header>

      <section id="about" className="panel">
        <About />
      </section>

      <section id="strategies" className="panel">
        <Strategies />
      </section>

      <section id="model" className="panel">
        <Model />
      </section>
    </div>
  );
}
