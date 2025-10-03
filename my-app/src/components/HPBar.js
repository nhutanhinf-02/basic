import React from 'react';

export default function HPBar({ value = 10000, label = 'HP', enemy = false }) {
  const pct = Math.max(0, Math.min(100, (value / 10000) * 100));
  return (
    <div className="card">
      <div className="flex" style={{ justifyContent:'space-between' }}>
        <div>{label}</div>
        <div className="badge">{value}/10000</div>
      </div>
      <div className="hpbar" aria-label={label}>
        <div className={`hpfill ${enemy ? 'enemy' : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
