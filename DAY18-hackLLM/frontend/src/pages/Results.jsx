import { useAnalysisStore } from '../store/useAnalysisStore';
import ScoreGauge from '../components/ScoreGauge.jsx';
import ClaimCard from '../components/ClaimCard.jsx';
import '../styles/results.css';


export default function Results() {
    const { result } = useAnalysisStore();
    if (!result) return <div className="muted">No analysis yet.</div>;
    const { thi, label, threshold, per_claim } = result;
    return (
        <div className="results-root max-w-[1200px] mx-auto px-4">
            <div className="results-top">
                <div className="gauge-wrap">
                    <ScoreGauge value={thi} label="THI" />
                </div>
                <div className="summary">
                    <div style={{display:'flex',alignItems:'center'}}>
                        <div className="status">{label.toUpperCase()}</div>
                        <div className="status-pill">Threshold: <strong>{(threshold * 100).toFixed(0)}%</strong></div>
                    </div>
                    <div className="explain muted">The combined Hallucination Probability aggregates five lightweight checks.</div>
                </div>
            </div>

            <section className="claims-grid">
                {per_claim?.map((c, i) => (
                    <ClaimCard key={i} {...c} />
                ))}
            </section>
        </div>
    );
}