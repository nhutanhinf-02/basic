// src/data/characters.js
export const CHARACTERS = {
  natsu:   { id:'natsu', name:'Natsu', skill:'+10s cho 3 câu tiếp theo', uses:2,
             videoId:'DW42bLEiw8E', startAt:0, seconds:10 },

  lucy:    { id:'lucy', name:'Lucy', skill:'Ẩn 1 đáp án sai ( -10s )', uses:5,
             videoId:'buKXp6nJoiM', startAt:348, seconds:12 },

  gray:    { id:'gray', name:'Gray', skill:'Đóng băng thời gian câu hiện tại', uses:2,
             videoId:'4gHKuW0PDlQ', startAt:616, seconds:9 },

  erza:    { id:'erza', name:'Erza', skill:'Câu hiện tại đúng +25 điểm', uses:3,
             videoId:'uvtyhHSWBtc', startAt:737, seconds:13 },

  laxus:   { id:'laxus', name:'Laxus', skill:'Thử thách 5 đúng liên tiếp: đủ 5 → +200; sai → -100 & kết thúc', uses:1,
             videoId:'uvtyhHSWBtc', startAt:760, seconds:10 },

  mirajane:{ id:'mirajane', name:'Mirajane', skill:'Bỏ qua & cho là đúng câu hiện tại', uses:2,
             videoId:'HUuz6K_B8pU', startAt:1214, seconds:6 },

  wendy:   { id:'wendy', name:'Wendy', skill:'Được chọn lại 1 lần nếu sai ở câu này', uses:3,
             videoId:'yDEJIkx6DZ0', startAt:8, seconds:7 },

  juvia:   { id:'juvia', name:'Juvia', skill:'+15s cho câu hỏi hiện tại', uses:3,
             videoId:'4gHKuW0PDlQ', startAt:390, seconds:18 },

  jellal:  { id:'jellal', name:'Jellal', skill:'Bảy Vì Sao Phán Xét: Ẩn 2 đáp án sai', uses:2,
             videoId:'4gHKuW0PDlQ', startAt:1225, seconds:25 },

  gajeel:  { id:'gajeel', name:'Gajeel', skill:'3 câu tới nếu sai chỉ mất 1/2 HP', uses:2,
             videoId:'bW85aoz3l1M', startAt:1058, seconds:10 },

  /* ===== NHÂN VẬT MỚI (premium) ===== */
  frieren: { id:'frieren', name:'Frieren',
             skill:'Zoltraak: Nếu câu hiện tại sai thì câu sau +45s & +2000 HP',
             uses:1, premium:true,
             videoId:'GqQnAFE3M94', startAt: 13*60+45, seconds: 20 },

  fern:    { id:'fern', name:'Fern',
             skill:'Defensive Magic: Ở câu kế, nếu đúng còn ≥15s → x2 điểm',
             uses:3, premium:true,
             videoId:'nSBQkWkzZvk', startAt: 16*60+43, seconds: 17 },

  stark:   { id:'stark', name:'Stark',
             skill:'Lightning Strike: 3 câu kế mỗi câu đúng +500 HP',
             uses:2, premium:true,
             videoId:'OpwpR-8HqxA', startAt: 9*60+0, seconds: 18 },

  sein:    { id:'sein', name:'Sein',
             skill:'Magic of the Goddess: 5 câu kế miễn nhiễm thời tiết xấu',
             uses:1, premium:true,
             videoId:'ft7fP7M3aaE', startAt: 8*60+25, seconds: 15 },
};

export const CHARACTER_ORDER = Object.keys(CHARACTERS);
