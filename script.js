/* ===== TRANSLATIONS ===== */
const i18n = {
  th: {
    sectionLabel: 'กรอกข้อมูลการวิ่ง',
    labelDistance: 'ระยะทาง',
    labelPace: 'เพซ',
    labelTime: 'เวลา',
    labelCalories: 'แคลอรี่',
    unitDistance: 'กม.',
    unitPace: 'นาที/กม.',
    unitTime: 'นาที',
    btnText: 'สร้างสถิติ',
    cardTag: 'วิ่ง',
    statPace: 'เพซ',
    statTime: 'เวลา',
    distanceUnit: 'กิโลเมตร',
    footerText: 'RUNSTAT',
    savePng: 'บันทึก PNG',
    saving: 'กำลังบันทึก...',
  },
  en: {
    sectionLabel: 'Enter Your Run Data',
    labelDistance: 'Distance',
    labelPace: 'Pace',
    labelTime: 'Time',
    labelCalories: 'Calories',
    unitDistance: 'km',
    unitPace: 'min/km',
    unitTime: 'min',
    btnText: 'Generate Stats',
    cardTag: 'RUN',
    statPace: 'Pace',
    statTime: 'Time',
    distanceUnit: 'Kilometers',
    footerText: 'RUNSTAT',
    savePng: 'Save as PNG',
    saving: 'Saving...',
  },
  kr: {
    sectionLabel: '러닝 데이터 입력',
    labelDistance: '거리',
    labelPace: '페이스',
    labelTime: '시간',
    labelCalories: '칼로리',
    unitDistance: 'km',
    unitPace: '분/km',
    unitTime: '분',
    btnText: '통계 생성',
    cardTag: '러닝',
    statPace: '페이스',
    statTime: '시간',
    distanceUnit: '킬로미터',
    footerText: 'RUNSTAT',
    savePng: 'PNG 저장',
    saving: '저장 중...',
  }
};

let currentLang = 'th';

/* ===== LANGUAGE SWITCH ===== */
function setLang(lang) {
  currentLang = lang;
  const t = i18n[lang];

  document.getElementById('label-input').textContent    = t.sectionLabel;
  document.getElementById('label-distance').textContent = t.labelDistance;
  document.getElementById('label-pace').textContent     = t.labelPace;
  document.getElementById('label-time').textContent     = t.labelTime;
  document.getElementById('label-calories').textContent = t.labelCalories;
  document.getElementById('unit-distance').textContent  = t.unitDistance;
  document.getElementById('unit-pace').textContent      = t.unitPace;
  document.getElementById('unit-time').textContent      = t.unitTime;
  document.getElementById('btn-text').textContent       = t.btnText;
  document.getElementById('save-btn-text').textContent  = t.savePng;

  document.body.classList.remove('lang-th', 'lang-kr');
  if (lang === 'th') document.body.classList.add('lang-th');
  if (lang === 'kr') document.body.classList.add('lang-kr');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const rs = document.getElementById('resultSection');
  if (rs.classList.contains('visible')) updateCardLabels(t);
}

function updateCardLabels(t) {
  document.getElementById('card-tag').textContent                = t.cardTag;
  document.getElementById('stat-label-pace').textContent         = t.statPace;
  document.getElementById('stat-label-time').textContent         = t.statTime;
  document.getElementById('display-distance-unit').textContent   = t.distanceUnit;
  document.getElementById('footer-text').textContent             = t.footerText;
}

/* ===== DATE ===== */
function getFormattedDate(lang) {
  const now = new Date();
  if (lang === 'th') return now.toLocaleDateString('th-TH', { day:'2-digit', month:'short', year:'numeric' });
  if (lang === 'kr') return now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
  return now.toLocaleDateString('en-US', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase();
}

/* ===== GENERATE ===== */
function generateCard() {
  const t = i18n[currentLang];

  const rawDist = document.getElementById('distance').value.trim();
  const rawPace = document.getElementById('pace').value.trim();
  const rawTime = document.getElementById('time').value.trim();
  const rawCal  = document.getElementById('calories').value.trim();

  const dist = rawDist !== '' ? parseFloat(rawDist).toFixed(2) : '—';

  let paceDisplay = '—';
  if (rawPace !== '') {
    if (rawPace.includes(':')) {
      const [m, s] = rawPace.split(':');
      paceDisplay = `${parseInt(m)}'${String(parseInt(s)||0).padStart(2,'0')}"`;
    } else { paceDisplay = rawPace; }
  }

  let timeDisplay = '—';
  if (rawTime !== '') {
    if (rawTime.includes(':')) {
      const parts = rawTime.split(':');
      if (parts.length === 2) {
        timeDisplay = `${parseInt(parts[0])}:${String(parseInt(parts[1])).padStart(2,'0')}`;
      } else if (parts.length === 3) {
        timeDisplay = `${parseInt(parts[0])}:${String(parseInt(parts[1])).padStart(2,'0')}:${String(parseInt(parts[2])).padStart(2,'0')}`;
      }
    } else { timeDisplay = rawTime; }
  }

  const calDisplay = rawCal !== '' ? parseInt(rawCal).toLocaleString() : '—';

  document.getElementById('display-distance').textContent = dist;
  document.getElementById('display-pace').textContent     = paceDisplay;
  document.getElementById('display-time').textContent     = timeDisplay;
  document.getElementById('display-calories').textContent = calDisplay;
  document.getElementById('card-date').textContent        = getFormattedDate(currentLang);
  updateCardLabels(t);
  document.getElementById('save-btn-text').textContent    = t.savePng;

  const rs      = document.getElementById('resultSection');
  const card    = document.getElementById('statsCard');
  const saveBtn = document.getElementById('saveBtn');

  rs.classList.add('visible');
  saveBtn.classList.add('visible');

  card.classList.remove('animate');
  void card.offsetWidth;
  card.classList.add('animate');

  setTimeout(() => { rs.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
}

/* ===== DRAW CARD TO CANVAS ===== */
function drawCard(canvas) {
  const dpr = 3;
  const W = 400, H = 420;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const pad = 20;
  const cW  = W - pad * 2;
  const cH  = H - pad * 2;
  const r   = 32;

  // --- Outer dark background ---
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  // --- White card with rounded corners ---
  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.lineTo(pad + cW - r, pad);
  ctx.quadraticCurveTo(pad + cW, pad, pad + cW, pad + r);
  ctx.lineTo(pad + cW, pad + cH - r);
  ctx.quadraticCurveTo(pad + cW, pad + cH, pad + cW - r, pad + cH);
  ctx.lineTo(pad + r, pad + cH);
  ctx.quadraticCurveTo(pad, pad + cH, pad, pad + cH - r);
  ctx.lineTo(pad, pad + r);
  ctx.quadraticCurveTo(pad, pad, pad + r, pad);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // subtle shadow
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur  = 30;
  ctx.fill();
  ctx.shadowBlur  = 0;

  // --- Top accent bar ---
  const grad = ctx.createLinearGradient(pad + 40, 0, pad + cW - 40, 0);
  grad.addColorStop(0,   'rgba(0,0,0,0)');
  grad.addColorStop(0.3, '#1a1a1a');
  grad.addColorStop(0.7, '#1a1a1a');
  grad.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(pad, pad, cW, 3);

  const iL = pad + 22; // inner left
  const iR = pad + cW - 22; // inner right
  let y = pad + 32;

  // --- RUN tag ---
  const t    = i18n[currentLang];
  const tag  = t.cardTag.toUpperCase();
  ctx.font = '700 10px "DM Sans", sans-serif';
  const tagW = ctx.measureText(tag).width + 24;
  ctx.fillStyle = '#0a0a0a';
  roundRect(ctx, iL, y, tagW, 22, 11);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px "DM Sans", sans-serif';
  ctx.letterSpacing = '0.16em';
  ctx.textAlign = 'center';
  ctx.fillText(tag, iL + tagW / 2, y + 15);
  ctx.letterSpacing = '0';

  // --- Date ---
  ctx.fillStyle = '#888888';
  ctx.font = '500 11px "DM Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(document.getElementById('card-date').textContent, iR, y + 15);

  y += 44;

  // --- Big distance number ---
  const distText = document.getElementById('display-distance').textContent;
  ctx.fillStyle = '#0a0a0a';
  ctx.font = 'italic 800 ' + (distText.length <= 4 ? '92' : '76') + 'px "Barlow Condensed", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(distText, iL - 4, y + 72);

  y += 92;

  // --- Distance unit ---
  const unitText = t.distanceUnit;
  ctx.fillStyle = '#888888';
  ctx.font = '500 13px "DM Sans", "Noto Sans Thai", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(unitText, iL, y);

  y += 28;

  // --- Divider ---
  ctx.strokeStyle = '#e5e5e5';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(iL + 20, y);
  ctx.lineTo(iR - 20, y);
  ctx.stroke();

  y += 24;

  // --- 3 stats ---
  const colW = (iR - iL) / 3;
  const stats = [
    { val: document.getElementById('display-pace').textContent,     label: t.statPace.toUpperCase() },
    { val: document.getElementById('display-time').textContent,     label: t.statTime.toUpperCase() },
    { val: document.getElementById('display-calories').textContent, label: 'KCAL' },
  ];

  stats.forEach((s, i) => {
    const cx = iL + colW * i + colW / 2;

    // value
    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 26px "Barlow Condensed", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.val, cx, y + 24);

    // label
    ctx.fillStyle = '#888888';
    ctx.font = '600 10px "DM Sans", sans-serif';
    ctx.letterSpacing = '0.1em';
    ctx.fillText(s.label, cx, y + 40);
    ctx.letterSpacing = '0';

    // separator
    if (i < 2) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(iL + colW * (i + 1), y + 4);
      ctx.lineTo(iL + colW * (i + 1), y + 36);
      ctx.stroke();
    }
  });

  y += 60;

  // --- Footer divider ---
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(iL, y);
  ctx.lineTo(iR, y);
  ctx.stroke();

  y += 16;

  // --- Footer badge ---
  ctx.fillStyle = '#bbbbbb';
  ctx.font = '700 10px "DM Sans", sans-serif';
  ctx.letterSpacing = '0.14em';
  ctx.textAlign = 'right';
  ctx.fillText('RUNSTAT', iR, y + 10);
  ctx.letterSpacing = '0';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ===== SAVE AS PNG ===== */
async function saveAsPng() {
  const t       = i18n[currentLang];
  const btn     = document.getElementById('saveBtn');
  const btnText = document.getElementById('save-btn-text');

  btn.classList.add('loading');
  btnText.textContent = t.saving;

  try {
    // Wait for fonts to be ready
    await document.fonts.ready;

    const canvas = document.createElement('canvas');
    drawCard(canvas);

    const link = document.createElement('a');
    const dist = document.getElementById('display-distance').textContent;
    link.download = `runstat-${dist}km.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (e) {
    console.error('PNG export error:', e);
  }

  btn.classList.remove('loading');
  btnText.textContent = t.savePng;
}

/* ===== ENTER KEY ===== */
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('keydown', e => { if (e.key === 'Enter') generateCard(); });
});

/* ===== LANG BUTTONS ===== */
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

/* ===== INIT ===== */
setLang('th');
