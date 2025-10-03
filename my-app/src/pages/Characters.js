// src/pages/Characters.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { CHARACTERS, CHARACTER_ORDER } from '../data/characters';

export default function Characters() {
  const nav = useNavigate();
  const { state, dispatch } = useGame();

  if (!state.lesson) return <div className="card">Hãy chọn bài trước.</div>;

  const choose = (id) => {
    dispatch({ type: 'SET_CHARACTER', payload: id });
    dispatch({ type: 'RESET_FOR_QUIZ' });
    nav('/quiz');
  };

  const isSpecial = state.auth.role === 'special';

  return (
    <div>
      <h2>🧙 Chọn nhân vật</h2>
      <div className="char-grid-4">
        {CHARACTER_ORDER.map(id => {
          const c = CHARACTERS[id];
          const locked = c.premium === true && !isSpecial;

          return (
            <div key={id} className="card character-card" style={{ position: 'relative' }}>
              <div className="character-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span>{c.name}</span>
                {c.premium && (
                  <span className="badge" title={locked ? 'Chỉ dành cho tài khoản đặc biệt' : 'Mở khóa'}>
                    {locked ? '🔒 Premium' : '✨ Premium'}
                  </span>
                )}
              </div>

              <div className="portrait">
                {/* bạn có thể gắn src ảnh phù hợp tại đây */}
                <img src={`/characters/${id}.jpg`} alt={c.name} onError={(e)=>{ e.currentTarget.style.opacity = .25; }} />
              </div>

              <div className="character-skill">
                <div style={{ fontWeight: 800, color: '#cfdbff', marginBottom: 4 }}>Kỹ năng</div>
                <div style={{ color: '#b6c2e2' }}>{c.skill}</div>
              </div>

              <div className="character-stats">
                <div>HP: <b>10.000</b></div>
                <div>Mana: <b>{c.uses}</b></div>
              </div>

              <div className="character-footer">
                <button
                  className="btn"
                  onClick={() => choose(id)}
                  disabled={locked}
                  title={locked ? 'Đăng nhập tài khoản đặc biệt để chọn' : 'Chọn nhân vật'}
                  style={{ width: '100%' }}
                >
                  {locked ? 'Đã khóa' : 'Chọn'}
                </button>
              </div>

              {locked && (
                <div
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 14,
                    background: 'linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.55))',
                    display: 'grid', placeItems: 'center', pointerEvents: 'none'
                  }}
                >
                  <div className="badge">🔒 Tài khoản thường</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
