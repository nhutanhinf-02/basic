// src/data/lessons.js
export function getLessonMeta(subject) {
  // ---- TH: Tin học / Thuật toán cơ bản ----
  const metaTH = [
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
  ];

  // ---- QT: Quản trị ----
  const metaQT = [
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
  ];

  // ---- IC3: Digital Literacy / Productivity ----
  const metaIC3 = [
    'Thông tin, quyết định và xử lý thông tin',
    'Máy tính và làm việc với máy tính',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
  ];

  // ---- SPARK: Tư duy sáng tạo / STEM mini ----
  const metaSPARK = [
    'Phần cứng và phần mềm, Gõ phím đúng cách',
    'Thông tin trên web và tìm kiếm trên internet',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
  ];

  // ---- GS6: Kỹ năng học tập / Study Skills ----
  const metaGS6 = [
    'Chức năng của máy tính, Tìm thông tin và giải quyết vấn đề trên Website',
    'Tổ chức lưu trữ và bản quyền nội dung thông tin',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
    'TH',
  ];

  // Bản đồ môn → meta
  const pool = {
    TH: metaTH,
    QT: metaQT,
    IC3: metaIC3,
    SPARK: metaSPARK,
    GS6: metaGS6,
  };

  const arr = pool[subject] || metaTH; // fallback TH nếu subject không khớp
  return arr.map((desc, i) => ({
    id: i + 1,
    title: `Bài ${i + 1}`,
    desc,
  }));
}
