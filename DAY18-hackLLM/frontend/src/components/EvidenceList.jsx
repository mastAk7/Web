export default function EvidenceList({ items = [] }) {
    if (!items.length) return null;
    return (
        <ul className="space-y-2">
            {items.map((t, i) => (
                <li key={i} className="text-sm text-slate-600">• {t}</li>
            ))}
        </ul>
    );
}