// src/components/PlayerNameBox.js
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

export default function PlayerNameBox() {
  const { state, dispatch } = useGame();
  const [name, setName] = useState(state.playerName || '');

  useEffect(() => {
    setName(state.playerName || '');
  }, [state.playerName]);

  const save = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_PLAYER_NAME', payload: name });
  };

  return (
    <div className="card name-card" style={{ marginBottom: 16 }}>
      <div className="name-head">
        <div className="name-icon">🎮</div>
        <div className="name-title">Đặt tên nhân vật</div>
      </div>

      <form onSubmit={save}>
        <div className="name-field" style={{ marginBottom: 12 }}>
          <div className="input-neo-icon">📝</div>
          <input
            className="input-neo"
            placeholder="Nhập tên bạn muốn hiển thị"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button className="btn" style={{ width: '100%' }} type="submit">
          Lưu tên
        </button>

        {state.playerName && (
          <div className="note" style={{ marginTop: 10 }}>
            Tên hiện tại: <b>{state.playerName}</b>
          </div>
        )}
      </form>
    </div>
  );
}
