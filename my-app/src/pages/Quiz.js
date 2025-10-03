// src/pages/Quiz.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getQuestionsAsync } from '../data/questions';
import { CHARACTERS } from '../data/characters';
import Timer from '../components/Timer';
import HPBar from '../components/HPBar';
import SkillPanel from '../components/SkillPanel';
import CutsceneOverlay from '../components/CutsceneOverlay';

export default function Quiz() {
  const nav = useNavigate();
  const { state, dispatch, timeBonusForCurrentQuestion, isTimeFrozen } = useGame();

  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qIndex, setQIndex] = useState(0);

  // Fisher–Yates với PRNG có seed (LCG) để xáo trộn câu hỏi theo lượt
  function shuffleWithSeed(arr, seed) {
    if (!Array.isArray(arr)) return arr;
    const a = arr.slice();
    let s = (seed >>> 0) || 1;
    const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setQuestions(null);
    setQIndex(0);
    getQuestionsAsync(state.subject, state.lesson).then((qs) => {
      if (!alive) return;
      const shuffled = shuffleWithSeed(qs, state.quizSeed);
      setQuestions(shuffled);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [state.subject, state.lesson, state.quizSeed]);

  const q = questions?.[qIndex];

  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [timeAdjust, setTimeAdjust] = useState(0);
  const [tickKey, setTickKey] = useState(0);
  const [cutscene, setCutscene] = useState(null);

  // đèn pin ban đêm
  const nightActive = state.weather.active && state.weather.type === 'night';
  const [nightPos, setNightPos] = useState({ x: '50%', y: '35%' });
  const handleMouseMove = (e) => {
    if (!nightActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setNightPos({ x: `${x}%`, y: `${y}%` });
  };

  // thời gian
  const baseTime = 30;
  const bonusTime = timeBonusForCurrentQuestion() + timeAdjust;
  const freezeAll = isTimeFrozen() || !!cutscene;

  const onTimeout = () => handleAnswer(-1, 0);

  const nextQuestion = () => {
    setHiddenOptions([]);
    setTimeAdjust(0);
    dispatch({ type: 'NEXT_QUESTION_TICK' });
    if (qIndex >= 29 || state.hpPlayer === 0) {
      nav('/result');
    } else {
      setQIndex(qIndex + 1);
      setTickKey(tickKey + 1);
    }
  };

  function handleAnswer(optionIdx, timeLeft) {
    if (!q) return;
    const correct = optionIdx === q.answer;

    if (!correct && state.buffs.wendyRetryThis > 0) {
      dispatch({ type: 'WENDY_RETRY_CONSUME' });
      alert('Sai rồi! Bạn được chọn lại 1 lần (Wendy).');
      return;
    }

    const DMG_PLAYER_WRONG = 2000;
    const DMG_ENEMY_PER_CORRECT = 10000 / 30;

    // dự đoán để điều hướng mượt
    let predictedPlayerHP = state.hpPlayer;
    if (!correct) {
      let dmg = DMG_PLAYER_WRONG;
      if (state.buffs.gajeelHalfDamageNext3 > 0) dmg = Math.ceil(dmg / 2);
      const seinImmune = (state.buffs?.seinWeatherImmunity ?? 0) > 0;
      if (state.weather.active && state.weather.type === 'wind' && !seinImmune) dmg += 500;
      predictedPlayerHP = Math.max(0, predictedPlayerHP - dmg);
    }

    let predictedEnemyHP = state.hpEnemy;
    if (correct) predictedEnemyHP = Math.max(0, predictedEnemyHP - DMG_ENEMY_PER_CORRECT);

    dispatch({ type: 'ANSWER', correct, timeLeft });

    const lose = predictedPlayerHP <= 0;
    const done = qIndex >= 29;
    if (lose || done) nav('/result');
    else nextQuestion();
  }

  const onUseSkill = (key) => {
    const char = CHARACTERS[key];
    if (char?.videoId) {
      setCutscene({
        videoId: char.videoId,
        seconds: char.seconds ?? 10,
        startAt: char.startAt ?? 0,
      });
    }
    if (!q) { dispatch({ type: 'APPLY_SKILL', key }); return; }

    if (key === 'lucy') {
      const wrongIdx = [0,1,2,3].filter(i => i !== q.answer && !hiddenOptions.includes(i));
      if (wrongIdx.length > 0) {
        const pick = wrongIdx[Math.floor(Math.random() * wrongIdx.length)];
        setHiddenOptions(prev => [...prev, pick]);
        setTimeAdjust(t => t - 10);
      }
    }
    if (key === 'jellal') {
      const wrongIdx = [0,1,2,3].filter(i => i !== q.answer && !hiddenOptions.includes(i));
      const rm = wrongIdx.sort(() => 0.5 - Math.random()).slice(0, 2);
      if (rm.length) setHiddenOptions(prev => [...prev, ...rm]);
    }
    if (key === 'mirajane') {
      handleAnswer(q.answer, baseTime + Math.max(0, bonusTime));
    }

    dispatch({ type: 'APPLY_SKILL', key });
  };

  // thời tiết
  const qNumber = state.answered + 1;
  const w = state.weather;
  const showWarn = w.triggered && !w.active && w.warnAt === qNumber;
  const showActive = w.active;

  const quizClass = `quiz-screen ${w.active ? w.type : ''} ${nightActive ? 'night' : ''}`;

  if (!state.characterId) return <div className="card">Hãy chọn nhân vật trước.</div>;
  if (loading || !questions) return <div className="card">Đang tải câu hỏi…</div>;

  // tên người chơi (rút gọn để không phá layout)
  const displayName = (state.playerName || '').trim();
  const shortName = displayName.length > 18 ? displayName.slice(0, 18) + '…' : displayName;

  const abcd = ['A','B','C','D'];

  return (
    <div
      className={`quiz-layout quiz-compact ${quizClass}`}
      onMouseMove={handleMouseMove}
      style={nightActive ? { ['--nx']: nightPos.x, ['--ny']: nightPos.y } : undefined}
    >
      {/* ===== CỘT TRÁI ===== */}
      <div>
        {/* Header gọn + chống tràn tên */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="flex" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div className="flex" style={{ gap: 10, flexWrap: 'wrap' }}>
              <div className="badge">Môn: <b style={{ marginLeft: 6 }}>{state.subject}</b></div>
              <div className="badge">Bài: <b style={{ marginLeft: 6 }}>{state.lesson}</b></div>
              <div className="badge">Câu: <b style={{ marginLeft: 6 }}>{qIndex + 1}/30</b></div>
            </div>
            <div className="flex" style={{ gap: 10, flexWrap: 'wrap' }}>
              {displayName && (
                <div className="badge truncate" title={displayName}>
                  Người chơi: <b style={{ marginLeft: 6 }}>{shortName}</b>
                </div>
              )}
              <div className="badge">Điểm: <b style={{ marginLeft: 6 }}>{state.score}</b></div>
            </div>
          </div>
        </div>

        {(showWarn || showActive) && (
          <div className={`banner ${showActive ? 'danger' : 'warn'}`}>
            {showWarn
              ? <>⚠️ Sau <b>3 câu nữa</b> sẽ đi đến <b>khu vực thời tiết xấu</b> ({w.type}).</>
              : <>🛑 Bạn đã đi đến <b>khu vực thời tiết xấu</b>: <b>{w.type}</b>
                  {w.type === 'rain' && ' – Mưa: mỗi câu -10s'}
                  {w.type === 'night' && ' – Đêm tối: trả lời đúng KHÔNG được cộng điểm (3 câu)'}
                  {w.type === 'volcano' && ' – Núi lửa: mỗi giây -1 điểm (3 câu)'}
                  {w.type === 'wind' && ' – Gió to: sai -500 HP, không dùng skill (5 câu)'}
                </>}
          </div>
        )}

        {/* Câu hỏi */}
        <div className="card">
          <div className="section-title">🧩 {q.text}</div>
          <div className="options">
            {[0,1,2,3].filter(i => !hiddenOptions.includes(i)).map(i => (
              <button
                key={i}
                className="option"
                onClick={() => handleAnswer(i, baseTime + Math.max(0, bonusTime))}
                disabled={!!cutscene}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span className="badge" style={{ minWidth: 28, textAlign: 'center', fontWeight: 900 }}>
                  {abcd[i]}
                </span>
                <span>{q.options[i]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CỘT PHẢI (STICKY) ===== */}
      <aside className="quiz-sidebar">
        <Timer
          base={baseTime}
          bonus={bonusTime}
          freeze={freezeAll}
          onTimeout={onTimeout}
          tickKey={tickKey}
          onSecondTick={() => dispatch({ type: 'WEATHER_SECOND_TICK' })}
        />

        <div className="grid">
          <HPBar
            value={state.hpPlayer}
            label={displayName ? `HP – ${shortName}` : 'HP người chơi'}
          />
          <HPBar value={state.hpEnemy} label="HP đối thủ" enemy />
        </div>

        <div className="card"><b>Điểm hiện tại:</b> {state.score}</div>

        <SkillPanel
          onUse={onUseSkill}
          disabled={
            (w.active && w.type === 'wind') &&
            ((state.buffs?.seinWeatherImmunity ?? 0) <= 0)
          }
        />
      </aside>

      {cutscene && (
        <CutsceneOverlay
          videoId={cutscene.videoId}
          seconds={cutscene.seconds}
          startAt={cutscene.startAt}
          onClose={() => setCutscene(null)}
        />
      )}
    </div>
  );
}
