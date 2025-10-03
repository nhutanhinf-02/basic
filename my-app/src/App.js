// src/App.js
// src/App.js
import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Characters from './pages/Characters';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Login from './pages/Login';
import { useGame } from './context/GameContext';

function RequireAuth({ children }) {
  const { state } = useGame();
  const loc = useLocation();
  if (!state.auth.loggedIn) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return children;
}

export default function App() {
  const { state, dispatch } = useGame();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="container">
      <header className="topbar">
        <Link to="/" className="brand">SeedB TH</Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/lessons">Bài</Link>
          <Link to="/characters">Nhân vật</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/result">Kết quả</Link>
          {!state.auth.loggedIn ? (
            <Link to="/login">Đăng nhập</Link>
          ) : (
            <span style={{ marginLeft: 10 }}>
              <span className="badge">👤 {state.auth.username} – {state.auth.role === 'special' ? 'Đặc biệt' : 'Thường'}</span>
              <button className="btn" style={{ marginLeft: 8, padding: '8px 12px' }} onClick={logout}>Đăng xuất</button>
            </span>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <RequireAuth><Home /></RequireAuth>
        } />
        <Route path="/lessons" element={
          <RequireAuth><Lessons /></RequireAuth>
        } />
        <Route path="/characters" element={
          <RequireAuth><Characters /></RequireAuth>
        } />
        <Route path="/quiz" element={
          <RequireAuth><Quiz /></RequireAuth>
        } />
        <Route path="/result" element={
          <RequireAuth><Result /></RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
