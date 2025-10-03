// src/context/GameContext.js
import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { CHARACTERS } from '../data/characters';

const DMG_PLAYER_WRONG = 2000;
const DMG_ENEMY_PER_CORRECT_INT = 333;

const WEATHER_DURATIONS = { rain: 5, night: 3, volcano: 3, wind: 5 };
const WEATHER_TYPES = ['rain', 'night', 'volcano', 'wind'];

/* ===== Buff mặc định ===== */
const initialBuffs = {
  natsuPlus10sNext3: 0,
  gajeelHalfDamageNext3: 0,

  grayFreezeThis: false,
  erzaBonus25OnThis: false,
  juviaPlus15sThis: 0,
  lucyRemoveOneThis: 0,
  jellalRemoveTwoThis: 0,
  wendyRetryThis: 0,
  mirajaneAutoCorrect: 0,

  // NEW (Frieren, Fern, Stark, Sein)
  frierenArmed: 0,
  frierenGrantNext: 0,
  frierenPlus15sThis: 0,

  fernGrantNext: 0,
  fernActiveThis: 0,

  starkHealOnCorrectNext3: 0,

  seinWeatherImmunity: 0,
};

/* ===== Trạng thái ban đầu ===== */
const initialState = {
  // seed xáo trộn câu hỏi cho từng lượt
  quizSeed: null,

  // Auth
  auth: {
    loggedIn: false,
    role: null,      // 'regular' | 'special'
    username: null,
  },

  subject: null,
  lesson: null,
  characterId: null,

  playerName: '',

  hpPlayer: 10000,
  hpEnemy: 10000,

  wrong: 0,
  answered: 0,
  score: 0,

  usedSkillThisQuestion: false,

  buffs: { ...initialBuffs },

  laxusActive: false,
  laxusStreak: 0,

  weather: {
    triggered: false,
    warnAt: null,
    startAt: null,
    type: null,
    remaining: 0,
    active: false,
  },

  skillUses: Object.fromEntries(Object.entries(CHARACTERS).map(([k, v]) => [k, v.uses])),
};

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function reducer(state, action) {
  switch (action.type) {
    /* ===== Auth ===== */
    case 'LOGIN': {
      const { username, role } = action.payload;
      return { ...state, auth: { loggedIn: true, role, username } };
    }
    case 'LOGOUT': {
      return { ...state, auth: { loggedIn: false, role: null, username: null } };
    }

    /* ===== Flow chọn môn/bài/nhân vật ===== */
    case 'SET_SUBJECT':
      return { ...state, subject: action.payload, lesson: null, characterId: null };
    case 'SET_LESSON':
      return { ...state, lesson: action.payload };
    case 'SET_CHARACTER':
      return { ...state, characterId: action.payload };

    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload?.trim() || '' };

    case 'RESET_FOR_QUIZ': {
      const startAt = randomInt(6, 22);
      const warnAt = startAt - 3;
      const type = WEATHER_TYPES[randomInt(0, WEATHER_TYPES.length - 1)];
      const quizSeed = Math.floor(Math.random() * 1e9); // seed xáo câu hỏi cho lượt này

      return {
        ...state,
        quizSeed,
        hpPlayer: 10000,
        hpEnemy: 10000,
        wrong: 0,
        answered: 0,
        score: 0,
        usedSkillThisQuestion: false,
        buffs: { ...initialBuffs },
        skillUses: Object.fromEntries(Object.entries(CHARACTERS).map(([k, v]) => [k, v.uses])),
        laxusActive: false,
        laxusStreak: 0,
        weather: { triggered: true, warnAt, startAt, type, remaining: 0, active: false },
      };
    }

    /* ===== Skill ===== */
    case 'APPLY_SKILL': {
      if (state.usedSkillThisQuestion) return state;

      const key = action.key;
      const left = state.skillUses[key] ?? 0;
      if (left <= 0) return state;

      const b0 = { ...state.buffs };

      // Gió to: chặn skill nếu không có miễn nhiễm từ Sein
      const windBlock = state.weather.active && state.weather.type === 'wind' && b0.seinWeatherImmunity <= 0;
      if (windBlock) return state;

      const skillUses = { ...state.skillUses, [key]: left - 1 };
      let buffs = { ...b0 };
      let { laxusActive, laxusStreak } = state;

      if (key === 'natsu')    buffs.natsuPlus10sNext3 += 3;
      if (key === 'lucy')     buffs.lucyRemoveOneThis += 1;
      if (key === 'gray')     buffs.grayFreezeThis = true;
      if (key === 'erza')     buffs.erzaBonus25OnThis = true;
      if (key === 'mirajane') buffs.mirajaneAutoCorrect += 1;
      if (key === 'wendy')    buffs.wendyRetryThis = 1;
      if (key === 'juvia')    buffs.juviaPlus15sThis += 1;
      if (key === 'jellal')   buffs.jellalRemoveTwoThis += 1;
      if (key === 'gajeel')   buffs.gajeelHalfDamageNext3 += 3;
      if (key === 'laxus')    { laxusActive = true; laxusStreak = 0; }

      // NEW
      if (key === 'frieren')  buffs.frierenArmed = 1;
      if (key === 'fern')     buffs.fernGrantNext = 1;
      if (key === 'stark')    buffs.starkHealOnCorrectNext3 += 3;
      if (key === 'sein')     buffs.seinWeatherImmunity += 5;

      return { ...state, skillUses, buffs, usedSkillThisQuestion: true, laxusActive, laxusStreak };
    }

    /* ===== Sang câu mới ===== */
    case 'NEXT_QUESTION_TICK': {
      const b = { ...state.buffs };

      // Giảm dần các buff theo số câu
      if (b.natsuPlus10sNext3 > 0)        b.natsuPlus10sNext3 -= 1;
      if (b.gajeelHalfDamageNext3 > 0)    b.gajeelHalfDamageNext3 -= 1;
      if (b.starkHealOnCorrectNext3 > 0)  b.starkHealOnCorrectNext3 -= 1;
      if (b.seinWeatherImmunity > 0)      b.seinWeatherImmunity -= 1;

      // Reset các buff 1-câu
      b.grayFreezeThis = false;
      b.erzaBonus25OnThis = false;
      b.juviaPlus15sThis = 0;
      b.lucyRemoveOneThis = 0;
      b.jellalRemoveTwoThis = 0;
      b.wendyRetryThis = 0;

      // Clear cờ của vòng trước
      b.frierenPlus15sThis = 0;
      b.fernActiveThis = 0;

      // Thời tiết
      const nextQNumber = state.answered + 1;
      let weather = { ...state.weather };
      if (weather.triggered && !weather.active && nextQNumber === weather.startAt) {
        weather.active = true;
        weather.remaining = WEATHER_DURATIONS[weather.type] || 3;
      } else if (weather.active) {
        weather.remaining = Math.max(0, weather.remaining - 1);
        if (weather.remaining === 0) weather.active = false;
      }

      // Apply các grant-next
      if (b.frierenGrantNext > 0) {
        b.frierenGrantNext = 0;
        b.frierenPlus15sThis = 1;
        const hpPlayer = Math.min(10000, Math.round(state.hpPlayer + 1000));
        return { ...state, usedSkillThisQuestion: false, buffs: b, weather, hpPlayer };
      }
      if (b.fernGrantNext > 0) {
        b.fernGrantNext = 0;
        b.fernActiveThis = 1;
      }

      return { ...state, usedSkillThisQuestion: false, buffs: b, weather };
    }

    /* ===== Tick mỗi giây (núi lửa) ===== */
    case 'WEATHER_SECOND_TICK': {
      const b = state.buffs;
      if (state.weather.active && state.weather.type === 'volcano' && b.seinWeatherImmunity <= 0) {
        return { ...state, score: Math.max(0, state.score - 1) };
      }
      return state;
    }

    /* ===== Trả lời ===== */
    case 'ANSWER': {
      const { correct, timeLeft } = action;
      let {
        score, hpEnemy, hpPlayer, wrong, answered, buffs,
        laxusActive, laxusStreak, weather
      } = state;

      // Mirajane auto đúng
      const isCorrect = correct || (buffs.mirajaneAutoCorrect > 0);
      if (buffs.mirajaneAutoCorrect > 0 && !correct) {
        buffs = { ...buffs, mirajaneAutoCorrect: buffs.mirajaneAutoCorrect - 1 };
      }

      answered += 1;

      const immuneWeather = buffs.seinWeatherImmunity > 0;

      if (isCorrect) {
        const nightNoScore = weather.active && weather.type === 'night' && !immuneWeather;
        if (!nightNoScore) {
          let gained = 30 + Math.max(0, timeLeft);
          if (buffs.erzaBonus25OnThis) gained += 25;
          if (buffs.fernActiveThis > 0 && timeLeft >= 15) {
            // Fern: x2 điểm nếu còn >=15s
            gained *= 2;
          }
          score += gained;
        }

        // Laxus
        if (laxusActive) {
          laxusStreak += 1;
          if (laxusStreak >= 5) {
            score += 200;
            laxusActive = false;
            laxusStreak = 0;
          }
        }

        // Trừ HP địch
        hpEnemy = Math.max(0, hpEnemy - DMG_ENEMY_PER_CORRECT_INT);

        // Stark +500 HP khi đúng
        if (buffs.starkHealOnCorrectNext3 > 0) {
          hpPlayer = Math.min(10000, Math.round(hpPlayer + 500));
        }

      } else {
        // Sai: Laxus fail
        if (laxusActive) {
          score = Math.max(0, score - 100);
          laxusActive = false;
          laxusStreak = 0;
        }

        // Trừ HP người chơi
        let dmg = DMG_PLAYER_WRONG;
        if (buffs.gajeelHalfDamageNext3 > 0) dmg = Math.ceil(dmg / 2);
        if (weather.active && weather.type === 'wind' && !immuneWeather) dmg += 500;
        hpPlayer = Math.max(0, hpPlayer - dmg);

        wrong += 1;

        // Frieren: nếu đã arm và người chơi sai → câu sau +45s & +2000 HP
        if (buffs.frierenArmed > 0) {
          buffs = { ...buffs, frierenArmed: 0, frierenGrantNext: 1 };
        }
      }

      // Câu 30: nếu đúng ≥ 26 thì ép HP địch = 0
      if (answered === 30) {
        const correctCount = answered - wrong;
        if (correctCount >= 26) {
          hpEnemy = 0;
        }
      }

      return {
        ...state,
        score: Math.max(0, score),
        hpEnemy: Math.max(0, Math.round(hpEnemy)),
        hpPlayer: Math.max(0, Math.round(hpPlayer)),
        wrong,
        answered,
        buffs,
        laxusActive,
        laxusStreak
      };
    }

    case 'WENDY_RETRY_CONSUME':
      return { ...state, buffs: { ...state.buffs, wendyRetryThis: 0 } };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Khôi phục session từ localStorage
  useEffect(() => {
    const raw = localStorage.getItem('ftquiz_auth_v1');
    if (raw) {
      try {
        const auth = JSON.parse(raw);
        if (auth?.loggedIn && (auth.role === 'regular' || auth.role === 'special')) {
          dispatch({ type: 'LOGIN', payload: { username: auth.username, role: auth.role } });
        }
      } catch {}
    }
  }, []);

  // Lưu session
  useEffect(() => {
    localStorage.setItem('ftquiz_auth_v1', JSON.stringify(state.auth));
  }, [state.auth]);

  const value = useMemo(() => ({
    state,
    dispatch,
    timeBonusForCurrentQuestion: () => {
      const b = state.buffs;
      let bonus =
        (b.natsuPlus10sNext3 > 0 ? 10 : 0) +
        (b.juviaPlus15sThis > 0 ? 15 * b.juviaPlus15sThis : 0) +
        (b.frierenPlus15sThis > 0 ? 45 : 0); // Frieren +45s

      const immuneWeather = b.seinWeatherImmunity > 0;
      if (!immuneWeather && state.weather.active && state.weather.type === 'rain') bonus -= 10;

      return bonus;
    },
    isTimeFrozen: () => state.buffs.grayFreezeThis === true,
  }), [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
