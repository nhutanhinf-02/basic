// src/pages/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

/** Danh sách môn cho phần chọn môn (có thể đổi tên hiển thị) */
const SUBJECTS = [
  { id: 'TH',    label: 'Lớp 1 TH' },
  { id: 'QT',    label: 'Lớp 2 QT' },
  { id: 'IC3',   label: 'Lớp 3 IC3' },
  { id: 'SPARK', label: 'Lớp 4 SPARK' },
  { id: 'GS6',   label: 'Lớp 5 GS6' },
];

export default function Home() {
  const nav = useNavigate();
  const { state, dispatch } = useGame();
  const [localName, setLocalName] = useState(state.playerName || '');

  const setPlayerName = (value) => {
    setLocalName(value);
    dispatch({ type: 'SET_PLAYER_NAME', payload: value });
  };

  const chooseSubject = (subjectId) => {
    if (!state.playerName || state.playerName.trim() === '') {
      alert('Hãy nhập tên người chơi trước nhé!');
      return;
    }
    dispatch({ type: 'SET_SUBJECT', payload: subjectId });
    nav('/lessons');
  };

  return (
    <div>
      <h2>🏠 Trang Home – Đặt tên & chọn môn học</h2>
      {/* Khung nhập tên (không đổi CSS hiện có) */}
      <div className="card name-card">
        <div className="name-head">
          <div className="name-icon">🪪</div>
          <div className="name-title">Tên người chơi</div>
        </div>
        <div className="name-field">
          <span className="input-neo-icon">👤</span>
          <input
            className="input-neo"
            placeholder="Nhập tên hiển thị…"
            value={localName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>
      </div>

      {/* Lưới nút các môn học */}
      <div className="grid" style={{ marginTop: 16 }}>
        {SUBJECTS.map((s) => (
          <button key={s.id} className="btn" onClick={() => chooseSubject(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <h2 className="festival-title">Trung thu là tết đoàn viên</h2>
            <div className="festival-desc">
  Tết Trung Thu, còn gọi là Tết trông Trăng, 
  diễn ra vào rằm tháng Tám âm lịch hằng năm. Đây là dịp để gia đình sum họp, 
  cùng nhau ngắm trăng, thưởng thức bánh Trung Thu và chia sẻ niềm vui. 
  Với thiếu nhi, Trung Thu là ngày hội rước đèn, múa lân, phá cỗ trông trăng đầy ắp tiếng cười. 
  Ngày Tết Trung Thu không chỉ là nét đẹp văn hóa truyền thống mà còn thể hiện tình thân, 
  sự quan tâm và yêu thương trong mỗi gia đình Việt Nam.
</div>
    </div>
  );
}
