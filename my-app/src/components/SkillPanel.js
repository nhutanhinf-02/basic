import React from 'react';
import { useGame } from '../context/GameContext';
import { CHARACTERS } from '../data/characters';

export default function SkillPanel({ onUse, disabled = false }) {
  const { state, dispatch } = useGame();
  const key = state.characterId;
  const left = state.skillUses[key] ?? 0;
  const c = CHARACTERS[key];

  const cantUse = disabled || left <= 0 || state.usedSkillThisQuestion;

  // ripple + action
  const handleClick = (e) => {
    if (cantUse) return;

    // ripple
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'rip';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);

    // action
    dispatch({ type: 'APPLY_SKILL', key });
    onUse?.(key);
  };

  return (
    <div className={`card skill-panel ${cantUse ? 'skill-panel--dim' : ''}`}>
      <div className="skill-header">
        <div className="skill-title">
          <span className="skill-emoji">🎯</span>
          <span>Kỹ năng</span>
        </div>
        <span className="skill-uses" title="Số lần còn lại">Còn {left}</span>
      </div>

      <div className="skill-body">
        <div className="skill-meta">
          <div className="skill-name">{c?.name}</div>
          <div className="skill-dot">:</div>
          <div className="skill-desc">{c?.skill}</div>
        </div>

        <button
          className="btn skill-btn"
          disabled={cantUse}
          onClick={handleClick}
        >
          Dùng kỹ năng (mỗi câu 1 lần)
        </button>
      </div>

      {disabled && (
        <div className="skill-overlay">
          <div className="skill-overlay__badge">🌪 Gió to</div>
          <div className="skill-overlay__text">Không thể dùng kỹ năng trong khu vực này</div>
        </div>
      )}
    </div>
  );
}
