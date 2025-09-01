import { useState } from 'react';
import '../styles/sections.css';

export default function About() {
  const [tab, setTab] = useState('about');
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-white font-bold">About</h1>
        <div className="flex gap-2">
          <button onClick={() => setTab('about')} className={`px-3 py-1 rounded ${tab==='about' ? 'bg-pink-700/20 text-white' : 'text-pink-200'}`}>About</button>
          <button onClick={() => setTab('strategies')} className={`px-3 py-1 rounded ${tab==='strategies' ? 'bg-pink-700/20 text-white' : 'text-pink-200'}`}>Strategies</button>
          <button onClick={() => setTab('model')} className={`px-3 py-1 rounded ${tab==='model' ? 'bg-pink-700/20 text-white' : 'text-pink-200'}`}>Model</button>
        </div>
      </div>

      <div className="bg-[rgba(12,8,12,0.35)] border border-[rgba(255,90,163,0.04)] p-6 rounded-lg">
        {tab === 'about' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">What we do</h2>
            <p className="text-pink-100/80">We run five lightweight checks to compute a Hallucination Probability and surface per-claim evidence so reviewers can triage answers quickly.</p>
          </div>
        )}
        {tab === 'strategies' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Strategies</h2>
            <ul className="text-pink-100/80 list-disc pl-5">
              <li>Contrast claims with available evidence</li>
              <li>Flag speculative language</li>
              <li>Detect numeric inconsistencies</li>
            </ul>
          </div>
        )}
        {tab === 'model' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Model</h2>
            <p className="text-pink-100/80">Our scoring combines simple heuristics with explainable per-claim breakdowns so results are transparent.</p>
          </div>
        )}
      </div>
    </div>
  );
}
