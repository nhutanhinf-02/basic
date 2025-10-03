// src/pages/Result.js
import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { CHARACTERS } from '../data/characters';

/** Xếp hạng + nhãn huy hiệu */
function getRank(score) {
  if (score <= 200) return { tier: 'c',  text: 'Lính Tập Sự – D' };
  if (score <= 400) return { tier: 'c',  text: 'Kỵ Sĩ Tân Binh – D+' };
  if (score <= 600) return { tier: 'b',  text: 'Chiến Binh Quả Cảm – C' };
  if (score <= 800) return { tier: 'b',  text: 'Kỵ Sĩ Hoàng Gia – C+' };
  if (score <= 1000) return { tier: 'a', text: 'Thống Lĩnh – B' };
  if (score <= 1150) return { tier: 'a', text: 'Hộ Vệ Hoàng Gia – B+' };
  if (score <= 1300) return { tier: 's', text: 'Đại Hiệp Sĩ – A' };
  if (score <= 1450) return { tier: 's', text: 'Chỉ Huy Tối Cao – A+' };
  if (score <= 1520) return { tier: 'ss', text: 'Vương Công – S' };
  if (score <= 1580) return { tier: 'ss', text: 'Quân Vương Bất Diệt – SS' };
  return { tier: 'sss', text: 'Đế Vương Vĩnh Hằng – SSS' };
}

/**
 * Ảnh với danh sách fallback:
 * - urls[0] lỗi -> thử urls[1], v.v...
 * - nếu hết, dùng avatar chữ cái theo playerName.
 */
function ImageWithFallback({ urls, alt, playerName }) {
  const [idx, setIdx] = useState(0);
  const handleError = useCallback(() => {
    setIdx((i) => (i + 1 < urls.length ? i + 1 : i));
  }, []);
  const srcOk = urls[idx];

  if (!srcOk || idx >= urls.length) {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      playerName || 'Player'
    )}&background=0D8ABC&color=fff`;
    return <img src={fallback} alt={alt || 'avatar'} />;
  }

  return <img src={srcOk} alt={alt || 'avatar'} onError={handleError} />;
}

export default function Result() {
  const { state } = useGame();

  const win  = state.hpEnemy === 0 || state.answered >= 30;
  const lose = state.wrong >= 5 || state.hpPlayer <= 0;

  const rank = useMemo(() => getRank(state.score), [state.score]);
  const char = state.characterId ? CHARACTERS[state.characterId] : null;

  /**
   * Tạo danh sách URL ứng viên theo thứ tự ưu tiên:
   * 1) char.image (nếu dev đã set) — hỗ trợ cả "/characters/natsu.jpg" hoặc "natsu.jpg"
   * 2) PUBLIC_URL + char.image (nếu char.image là tương đối)
   * 3) PUBLIC_URL + "/characters/<id>.{jpg,png,webp}"
   *
   * Lưu ý: CRA sẽ phục vụ ảnh trong thư mục /public,
   * ví dụ đặt ảnh tại: public/characters/natsu.jpg
   */
  const candidateUrls = useMemo(() => {
    const list = [];
    const PUBLIC = process.env.PUBLIC_URL || '';

    if (char?.image) {
      // nếu đã set, cho chạy thử trực tiếp
      // ex: "/characters/natsu.jpg" hoặc "characters/natsu.jpg" hoặc "natsu.jpg"
      list.push(char.image);
      // nếu thiếu slash hoặc không có PUBLIC_URL, thêm biến thể
      if (!char.image.startsWith('http')) {
        const normalized =
          char.image.startsWith('/') ? `${PUBLIC}${char.image}` : `${PUBLIC}/${char.image}`;
        list.push(normalized);
      }
    }

    // Tự suy luận theo id nhân vật (đặt file vào public/characters/)
    if (char?.id) {
      ['jpg', 'png', 'webp', 'jpeg'].forEach(ext => {
        list.push(`${PUBLIC}/characters/${char.id}.${ext}`);
      });
    }

    // lọc trùng
    return Array.from(new Set(list));
  }, [char]);

  const confetti = Array.from({ length: 60 });

  return (
    <div className={`result ${lose ? 'result--lose' : 'result--win'}`}>
      {win && !lose && (
        <div className="confetti" aria-hidden>
          {confetti.map((_, i) => <span key={i} style={{ '--i': i }} />)}
        </div>
      )}

      <h2>🏁 Kết quả</h2>

      <div className="result-card">
        {/* Top: avatar + badge + điểm */}
        <div className="result-top">
          <div className="result-avatar">
            <ImageWithFallback
              urls={candidateUrls}
              alt={char?.name || 'avatar'}
              playerName={state.playerName}
            />
          </div>

          <div className="result-hero">
            <div className={`rank-badge tier-${rank.tier}`}>
              <span className="rank-icon">🏆</span>
              <span className="rank-text">{rank.text}</span>
            </div>

            <div className="score-line">
              <span className="label">Điểm số:</span>
              <span className="score-big">{state.score}</span>
            </div>

            <div className="result-status">
              Trạng thái: {win && !lose ? 'Chiến thắng' : lose ? 'Thất bại' : 'Hoàn thành'}
            </div>
          </div>
          
        </div>

        {/* Thống kê */}
        <div className="result-grid">
          <div className="stat">
            <div className="stat-label">Người chơi</div>
            <div className="stat-value">{state.playerName || '—'}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Nhân vật</div>
            <div className="stat-value">{char?.name || '—'}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Trả lời</div>
            <div className="stat-value">{state.answered}/30</div>
          </div>
          <div className="stat">
            <div className="stat-label">Sai</div>
            <div className="stat-value">{state.wrong}/5</div>
          </div>
          <div className="stat">
            <div className="stat-label">Chuỗi Laxus</div>
            <div className="stat-value">{state.laxusStreak || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-label">HP {state.playerName || 'người chơi'}</div>
            <div className="stat-value">{state.hpPlayer}</div>
          </div>
          <div className="stat">
            <div className="stat-label">HP đối thủ</div>
            <div className="stat-value">{state.hpEnemy}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Môn học</div>
            <div className="stat-value">{state.subject || '—'}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Bài</div>
            <div className="stat-value">{state.lesson || '—'}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Kỹ năng còn</div>
            <div className="stat-value">
              {state.characterId ? state.skillUses[state.characterId] : 0}
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="result-actions">
          <Link className="btn ghost" to="/">Về Home</Link>
          <Link className="btn primary" to="/lessons">Chơi lại bài khác</Link>
        </div>
      </div>
    </div>
  );
}
