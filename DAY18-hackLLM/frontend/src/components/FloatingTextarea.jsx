import React, { useRef, useEffect, useState } from 'react';

export default function FloatingTextarea({ id, label, value, onChange, minRows = 1, maxRows = 5 }) {
  const taRef = useRef(null);
  const [filled, setFilled] = useState(Boolean(value && value.length));

  // auto-resize textarea to content but cap height to maxRows so scrollbar appears after that
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    // reset height to shrink if content reduced
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20; // fallback
    const paddingY = parseFloat(getComputedStyle(el).paddingTop || 8) + parseFloat(getComputedStyle(el).paddingBottom || 8) || 32;
    const maxHeight = Math.round(lineHeight * maxRows + paddingY);
    const desired = el.scrollHeight;
    if (desired > maxHeight) {
      el.style.height = maxHeight + 'px';
      el.style.overflowY = 'auto';
    } else {
      el.style.height = Math.max(desired, lineHeight * minRows) + 'px';
      el.style.overflowY = 'hidden';
    }
  }, [value, minRows, maxRows]);

  useEffect(() => setFilled(Boolean(value && value.length)), [value]);

  return (
    <div className={`relative transition-all duration-150 ${filled ? 'filled' : ''}`}>
      <textarea
        id={id}
        ref={taRef}
        rows={minRows}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full rounded-xl bg-[#0b0710] border border-pink-800 p-4 text-pink-50 placeholder-transparent focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-[rgba(255,45,138,0.06)] transition-all duration-200 resize-none"
      />
      <label htmlFor={id} className={`absolute left-2 px-1 text-pink-200/80 transition-all duration-150 ${filled ? '-top-4.5 text-xs' : 'top-4 text-base'}`}>
        {label}
      </label>
    </div>
  );
}
