// src/data/questions.js

/* ====================== API dùng trong app ====================== */
/** Dùng trong Quiz: ưu tiên đọc JSON; nếu không có thì fallback 30 câu giống nhau */
export async function getQuestionsAsync(subject, lesson) {
  const s = subject || 'TH';
  const l = lesson || 1;

  // Chuẩn hóa đường dẫn file JSON: /public/questions/<SUBJECT>/<02>.json
  const pad = String(l).padStart(2, '0');
  const url = `/questions/${s}/${pad}.json`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Đảm bảo format hợp lệ
    return data.map(normalizeAnswerIndex);
  } catch {
    // ⬇️ Fallback: 30 câu giống nhau theo yêu cầu
    return makeDiscipline30(s, l);
  }
}

/** Bản sync (vẫn cần vì một vài nơi có thể còn dùng), cũng trả về fallback */
export function getQuestions(subject, lesson) {
  return makeDiscipline30(subject || 'TH', lesson || 1);
}

/* ====================== Fallback: 30 câu giống nhau ====================== */
function makeDiscipline30(subject, lesson) {
  const text = 'Cả lớp giữ trật tự chung';
  const options = [
    'Đồng ý',        // A: đúng (index 0)
    'Không đồng ý',
    'Không đồng ý',
    'Không đồng ý',
  ];

  const qs = [];
  for (let i = 1; i <= 30; i++) {
    qs.push({
      id: `${subject}-${lesson}-${i}`, // id khác nhau để engine / key React ổn định
      text,
      options: options.slice(),        // giữ nguyên thứ tự — A luôn là đúng
      answer: 0,                       // index của đáp án đúng
    });
  }
  return qs.map(normalizeAnswerIndex);
}

/* ====================== Helpers ====================== */
/** Đảm bảo answer là index hợp lệ (mặc định 0) */
function normalizeAnswerIndex(q) {
  const ans = typeof q.answer === 'number' ? q.answer : 0;
  return { ...q, answer: ans };
}
