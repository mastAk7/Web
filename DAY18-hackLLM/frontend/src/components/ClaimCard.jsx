import '../styles/claimcard.css';

export default function ClaimCard({ claim, scores, evidence }) {
    const rows = [
        ['Contradiction', scores.contradiction],
        ['Lack of support', scores.lack_support],
        ['Instability', scores.instability],
        ['Speculative', scores.speculative],
        ['Numeric', scores.numeric]
    ];
    return (
        <div className="bg-[linear-gradient(180deg,rgba(255,90,163,0.02),rgba(12,8,12,0.36))] border border-[rgba(255,90,163,0.04)] p-5 rounded-lg shadow-[0_10px_30px_rgba(2,2,4,0.45)]">
            <div className="text-white font-semibold mb-3">{claim}</div>

            <div className="space-y-3">
                {rows.map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3">
                        <div className="w-36 text-[rgba(201,182,200,0.9)]">{k}</div>
                        <div className="flex-1 bg-[rgba(255,255,255,0.03)] h-2 rounded-full overflow-hidden">
                            <div className="metric-fill bg-gradient-to-r from-primary to-pink2 h-2" style={{ width: `${Math.round(v * 100)}%` }} />
                        </div>
                        <div className="w-12 text-right text-[rgba(201,182,200,0.9)] font-mono">{(v * 100).toFixed(0)}%</div>
                    </div>
                ))}
            </div>

            {evidence?.text && (
                <div className="mt-4 text-[rgba(201,182,200,0.9)]">
                    <div className="text-[10px] uppercase text-[rgba(255,255,255,0.72)]">Top Evidence</div>
                    <p className="mt-2">{evidence.text}</p>
                </div>
            )}
        </div>
    );
}