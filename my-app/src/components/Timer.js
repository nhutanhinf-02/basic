import React, { useEffect, useState } from 'react';

export default function Timer({ base = 30, bonus = 0, freeze = false, onTimeout, tickKey, onSecondTick }) {
  const clamp = (n) => Math.max(0, Math.floor(n));
  const total = clamp(base + bonus);
  const [left, setLeft] = useState(total);

  useEffect(() => {
    setLeft(total);
  }, [total, tickKey]);

  useEffect(() => {
    if (freeze || left <= 0) return;
    const id = setInterval(() => {
      setLeft((v) => (v > 0 ? v - 1 : 0));
      onSecondTick?.();                    // ✅ báo mỗi giây
    }, 1000);
    return () => clearInterval(id);
  }, [freeze, left, onSecondTick]);

  useEffect(() => {
    if (!freeze && left === 0) onTimeout?.();
  }, [freeze, left, onTimeout]);

  return (
    <div className="timer card">
      <div className="section-title">
        ⏳ Thời gian: {left}s {freeze ? ' (đang tạm dừng)' : ''}
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${(left / Math.max(1, total)) * 100}%` }} />
      </div>
    </div>
  );
}
