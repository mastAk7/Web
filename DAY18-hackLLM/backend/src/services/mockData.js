// Lightweight deterministic mock following the agreed contract
function splitSentences(text) {
    return text
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(Boolean);
}
function scoreSentence(s) {
    const lower = s.toLowerCase();
    const speculative = (lower.match(/\b(may|might|could|suggests|appears)\b/g) || []).length;
    const absolutes = (lower.match(/\b(always|never|guaranteed|undoubtedly|obviously)\b/g) || []).length;
    const exclaim = (s.match(/!/g) || []).length;
    // Faux signals in [0,1]
    const specScore = Math.min((speculative * 1 + absolutes * 1.5) / 4, 1);
    const contra = Math.min((absolutes + exclaim) / 5, 1) * 0.7; // pretend more absolute = more risk
    const support = Math.max(0, 0.9 - specScore * 0.5); // pretend more hedging => lower support
    const numeric = /(\d|%|\$|inr|usd|eur)/i.test(s) ? 0.2 : 0.0;
    return { specScore, contra, support, numeric };
}


module.exports = function mockTHI({ response_text, optional_context = [] }) {
    const sentences = splitSentences(response_text);
    const per_claim = sentences.map(s => {
        const { specScore, contra, support, numeric } = scoreSentence(s);
        const lack_support = 1 - support;
        const instability = 0.15; // fixed in mock
        const thi_claim = 0.35 * contra + 0.30 * lack_support + 0.15 * instability + 0.10 * specScore + 0.10 * numeric;
        return {
            claim: s,
            scores: {
                contradiction: Number(contra.toFixed(2)),
                lack_support: Number(lack_support.toFixed(2)),
                instability: instability,
                speculative: Number(specScore.toFixed(2)),
                numeric: Number(numeric.toFixed(2)),
                thi_claim: Number(thi_claim.toFixed(2))
            },
            evidence: {
                text: optional_context[0] || 'Mock evidence placeholder',
                nli: { p_entail: Number((1 - lack_support).toFixed(2)), p_contra: Number(contra.toFixed(2)) }
            },
            highlights: { speculative_spans: [], numeric_flags: [] }
        };
    });
    const thiValues = per_claim.map(c => c.scores.thi_claim).sort((a, b) => a - b);
    const median = thiValues.length % 2 ? thiValues[(thiValues.length - 1) / 2] : (thiValues[thiValues.length / 2 - 1] + thiValues[thiValues.length / 2]) / 2;
    const p90 = thiValues[Math.floor(thiValues.length * 0.9)] || thiValues[thiValues.length - 1] || 0;
    const thi = Math.max(median, p90);
    const threshold = 0.5;
    return {
        thi: Number(thi.toFixed(2)),
        label: thi >= threshold ? 'hallucination' : 'safe',
        threshold,
        weights: { contradiction: 0.35, lack_support: 0.30, instability: 0.15, speculative: 0.10, numeric: 0.10 },
        per_claim
    };
};
console.log("working")