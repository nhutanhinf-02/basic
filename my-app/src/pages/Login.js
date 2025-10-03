// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function Login() {
  const { state, dispatch } = useGame();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const u = username.trim();
    const p = password;

    // Tài khoản tĩnh
    if (u === 'hsnvl1' && p === '12345') {
      dispatch({ type: 'LOGIN', payload: { username: u, role: 'regular' } });
      nav('/');
      return;
    }
    if (u === 'hsnvl2' && p === 'nvl0915747') {
      dispatch({ type: 'LOGIN', payload: { username: u, role: 'special' } });
      nav('/');
      return;
    }
    setErr('Sai tài khoản hoặc mật khẩu.');
  };

  if (state.auth.loggedIn) {
    // Nếu đã login rồi, đẩy về home
    nav('/');
    return null;
  }

  return (
    <div className="container">
      <div className="card name-card" style={{ maxWidth: 520, margin: '60px auto' }}>
        <div className="name-head">
          <div className="name-icon">🔒</div>
          <div className="name-title">Đăng nhập</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="name-field" style={{ marginBottom: 12 }}>
            <div className="input-neo-icon">👤</div>
            <input
              className="input-neo"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="name-field" style={{ marginBottom: 16 }}>
            <div className="input-neo-icon">🔑</div>
            <input
              className="input-neo"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {err && <div className="note red" style={{ marginBottom: 10 }}>{err}</div>}

          <button type="submit" className="btn" style={{ width: '100%' }}>
            ĐĂNG NHẬP
          </button>
                <h2 className="festival-title">Trung thu là tết đoàn viên</h2>

          {/* <div className="note" style={{ marginTop: 12 }}>
            Tài khoản thường: <b>hsnvl1</b> / <b>12345</b><br/>
            Tài khoản đặc biệt: <b>hsnvl2</b> / <b>nvl0915747</b>
          </div> */}
        </form>
      </div>
    </div>
  );
}
