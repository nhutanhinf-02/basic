// src/pages/Lessons.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getLessonMeta } from '../data/lessons';

export default function Lessons() {
  const nav = useNavigate();
  const { state, dispatch } = useGame();

  if (!state.subject) return <div className="card">Hãy quay lại Home để chọn môn.</div>;

  const pick = (n) => {
    dispatch({ type: 'SET_LESSON', payload: n });
    nav('/characters');
  };

  const meta = getLessonMeta(state.subject);

  return (
    <div>
      <h2>🧩 Chọn bài trắc nghiệm – Môn {state.subject}</h2>

      <div className="lesson-grid">
        {meta.map(({ id, title, desc }) => (
          <div key={id} className="lesson-card">
            <div className="lesson-card__head">
              <span className="lesson-badge">{title}</span>
            </div>
            <div className="lesson-card__body">
              <div className="lesson-title">{title}</div>
              <div className="lesson-desc">{desc}</div>
            </div>
            <div className="lesson-card__foot">
              <button className="btn lesson-btn" onClick={() => pick(id)}>
                Vào bài
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
