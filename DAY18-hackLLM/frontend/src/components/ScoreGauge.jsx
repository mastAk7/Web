// Minimal CSS radial gauge using conic-gradient
import { useEffect, useRef } from 'react';

export default function ScoreGauge({ value = 0, label = 'THI' }) {
    const pct = Math.max(0, Math.min(1, value));
    const size = 140;
    const stroke = 12;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const ref = useRef(null);

    useEffect(() => {
        const circle = ref.current;
        if (!circle) return;
        const offset = circumference * (1 - pct);
        // animate using transition on stroke-dashoffset
        circle.style.strokeDashoffset = offset.toString();
    }, [pct, circumference]);

    const isLow = pct < 0.5;
    return (
        <div className="score-gauge">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="gauge-svg">
                <defs>
                    <linearGradient id="g1" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#ff5aa3" />
                        <stop offset="100%" stopColor="#ff2d8a" />
                    </linearGradient>
                </defs>
                <g transform={`translate(${size / 2}, ${size / 2})`}>
                    <circle r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={stroke} />
                    <circle
                        ref={ref}
                        r={radius}
                        fill="none"
                        stroke="url(#g1)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        transform="rotate(-90)"
                        style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,.9,.34,1)' }}
                    />
                    <g>
                        <text x="0" y="-6" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">{Math.round(pct * 100)}%</text>
                        <text x="0" y="18" textAnchor="middle" fontSize="12" fill="var(--muted)">{label}</text>
                    </g>
                </g>
            </svg>
        </div>
    );
}