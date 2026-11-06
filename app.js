/* ================================================
   CosmoClock · JavaScript
   ================================================ */

// ===== STARS CANVAS =====
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars(count = 220) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.2,
      opacity: Math.random(),
      speed: Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw nebula gradients
  const nebulaColors = [
    { x: 0.8, y: 0.2, r: 300, color: 'rgba(124, 58, 237, 0.08)' },
    { x: 0.2, y: 0.7, r: 250, color: 'rgba(8, 145, 178, 0.06)' },
    { x: 0.5, y: 0.5, r: 200, color: 'rgba(236, 72, 153, 0.04)' },
  ];
  nebulaColors.forEach(({ x, y, r, color }) => {
    const grd = ctx.createRadialGradient(
      x * canvas.width, y * canvas.height, 0,
      x * canvas.width, y * canvas.height, r
    );
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Draw stars
  stars.forEach(star => {
    star.opacity += star.twinkleSpeed * star.twinkleDir;
    if (star.opacity >= 1 || star.opacity <= 0.1) {
      star.twinkleDir *= -1;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();

    // Rare big stars with cross glow
    if (star.radius > 1.3) {
      ctx.strokeStyle = `rgba(200, 200, 255, ${star.opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(star.x - star.radius * 3, star.y);
      ctx.lineTo(star.x + star.radius * 3, star.y);
      ctx.moveTo(star.x, star.y - star.radius * 3);
      ctx.lineTo(star.x, star.y + star.radius * 3);
      ctx.stroke();
    }
  });

  requestAnimationFrame(drawStars);
}

resizeCanvas();
createStars();
drawStars();
window.addEventListener('resize', () => { resizeCanvas(); createStars(); });

// ===== FLOATING PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#a855f7', '#3b82f6', '#22d3ee', '#f472b6', '#34d399'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 15 + 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = p.style.height = (Math.random() * 4 + 1) + 'px';
    container.appendChild(p);
  }
}
createParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== LED GRID ANIMATION =====
const ledGrid = document.getElementById('led-grid');
const ledCount = 25;
for (let i = 0; i < ledCount; i++) {
  const led = document.createElement('div');
  led.className = 'led';
  led.id = `led-${i}`;
  ledGrid.appendChild(led);
}

// LED face patterns (5x5 index)
const patterns = {
  calm: [
    0,0,0,0,0,
    0,1,0,1,0,
    0,0,0,0,0,
    1,0,0,0,1,
    0,1,1,1,0,
  ],
  moderate: [
    0,0,0,0,0,
    0,1,0,1,0,
    0,0,0,0,0,
    0,1,1,1,0,
    0,0,0,0,0,
  ],
  high: [
    1,0,1,0,1,
    0,1,0,1,0,
    0,0,0,0,0,
    1,0,0,0,1,
    0,1,1,1,0,
  ],
  wave: [0,0,0,0,0, 1,0,0,0,1, 0,1,0,1,0, 0,0,1,0,0, 0,0,0,0,0],
};

function setLEDs(pattern) {
  document.querySelectorAll('.led').forEach((led, i) => {
    led.classList.remove('on', 'dim');
    if (pattern[i] === 1) led.classList.add('on');
  });
}

let currentPattern = 'calm';
setLEDs(patterns.calm);

// Cycle through patterns periodically
const patternCycle = ['calm', 'wave', 'moderate', 'wave', 'calm'];
let pIdx = 0;
setInterval(() => {
  pIdx = (pIdx + 1) % patternCycle.length;
  setLEDs(patterns[patternCycle[pIdx]]);
}, 2000);

// ===== STATUS CYCLING =====
const statusStates = [
  { label: '😌 CALMA',     leds: 'calm' },
  { label: '😟 ATENCIÓN',  leds: 'moderate' },
  { label: '😌 CALMA',     leds: 'calm' },
];
let sIdx = 0;

function cycleStatus() {
  const s = statusStates[sIdx % statusStates.length];
  const sv = document.getElementById('status-val');
  if (sv) sv.textContent = s.label;
  setLEDs(patterns[s.leds]);
  sIdx++;
}
setInterval(cycleStatus, 3500);

// ===== DEMO INTERACTIVE =====
const states = {
  calm: {
    fill: '25%',
    face: '😌',
    suggestion: 'Todo está bien. Tu ritmo cardíaco es estable y estás en calma.',
  },
  moderate: {
    fill: '58%',
    face: '😟',
    suggestion: 'Nivel moderado detectado. Respirá profundo: inhala 4 seg, exhala 4 seg.',
  },
  high: {
    fill: '90%',
    face: '😰',
    suggestion: '⚠️ Ansiedad alta. Detenete un momento, tomá agua y practica la técnica 4-7-8.',
  },
};

function setState(key) {
  const s = states[key];
  document.getElementById('meter-fill').style.width = s.fill;
  document.getElementById('meter-thumb').style.left = s.fill;
  document.getElementById('demo-face').textContent = s.face;
  document.getElementById('demo-suggestion').textContent = s.suggestion;

  // Update active button
  document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-${key}`).classList.add('active');

  // Sync LED pattern + watch status
  if (patterns[key]) setLEDs(patterns[key]);
  const sv = document.getElementById('status-val');
  const labels = { calm: '😌 CALMA', moderate: '😟 MODERADO', high: '😰 ALTO' };
  if (sv) sv.textContent = labels[key];
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const elements = document.querySelectorAll('.card, .step, .feature-item, .team-card, .demo-box, .canva-showcase');
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}
initReveal();

// ===== SMOOTH ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--purple-400)'
      : '';
  });
});

// ===== PARALLAX HERO NEBULA (mouse move) =====
document.addEventListener('mousemove', e => {
  const watch = document.getElementById('watch-device');
  const container = document.getElementById('device-container');
  if (watch) {
    if (container && container.classList.contains('exploded-active')) {
      watch.style.transform = `perspective(900px) scale(1.03)`;
      return;
    }
    const tx = (e.clientX / window.innerWidth - 0.5) * 12;
    const ty = (e.clientY / window.innerHeight - 0.5) * 12;
    watch.style.transform = `perspective(900px) rotateY(${tx}deg) rotateX(${-ty}deg)`;
  }
});

// ===== INTERACTIVE WATCH COMPONENTS EXPLOSION =====
function toggleWatchComponents() {
  const container = document.getElementById('device-container');
  const hintText = document.querySelector('#watch-hint .hint-text');
  const hintIcon = document.querySelector('#watch-hint .hint-icon');
  if (!container) return;

  const isActive = container.classList.toggle('exploded-active');

  if (hintText && hintIcon) {
    if (isActive) {
      hintIcon.textContent = '✕';
      hintText.textContent = 'Toca para cerrar partes';
    } else {
      hintIcon.textContent = '👆';
      hintText.textContent = '¡Toca el reloj para ver sus partes!';
      unhighlightPart();
    }
  }

  const watch = document.getElementById('watch-device');
  if (watch) {
    watch.style.transform = isActive
      ? 'perspective(900px) scale(1.03)'
      : 'perspective(900px) rotateY(0deg) rotateX(0deg)';
  }
}

function highlightPart(partKey) {
  document.querySelectorAll('.watch-hotspot').forEach(spot => {
    if (spot.getAttribute('data-part') === partKey) {
      spot.classList.add('highlight');
    } else {
      spot.classList.remove('highlight');
    }
  });
}

function unhighlightPart() {
  document.querySelectorAll('.watch-hotspot').forEach(spot => {
    spot.classList.remove('highlight');
  });
}

// Hotspot click interaction
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.watch-hotspot').forEach(spot => {
    spot.addEventListener('click', e => {
      e.stopPropagation();
      const part = spot.getAttribute('data-part');
      highlightPart(part);
    });
  });
});

// ===== PROJECT TABS & GALLERY =====
const galleryData = [
  {
    src: 'images/reloj-1.jpg',
    badge: 'Diseño Wearable',
    title: 'CosmoClock micro:bit — Vista General',
    desc: 'Carcasa ergonómica con correa de silicona lila y matriz LED frontal con diseño de corazón que responde a los niveles emocionales.'
  },
  {
    src: 'images/reloj-2.jpg',
    badge: 'Detalle & Controles',
    title: 'Pulsadores A/B, Micrófono y Pines',
    desc: 'Detalle de los botones de interacción A y B para registro rápido, micrófono frontal, botón de encendido y pines de contacto dorados del micro:bit.'
  },
  {
    src: 'images/reloj-3.jpg',
    badge: 'Carcasa y Ensamble',
    title: 'Acabado Galáctico CosmoClock',
    desc: 'Estructura compacta en blanco y lavanda diseñada específicamente para adolescentes, brindando comodidad durante todo el día.'
  },
  {
    src: 'images/reloj-4.jpg',
    badge: 'Interfaz en Muñeca',
    title: 'Pantalla Táctil con Menú de Apps',
    desc: 'CosmoClock en uso diario sobre la muñeca, mostrando el menú con juegos de relajación guiada, chat emocional, música de calma y monitor de pulso.'
  }
];

function switchProjectTab(tab) {
  const btnInfo = document.getElementById('tab-btn-info');
  const btnImages = document.getElementById('tab-btn-images');
  const paneInfo = document.getElementById('tab-pane-info');
  const paneImages = document.getElementById('tab-pane-images');

  if (tab === 'images') {
    if (btnInfo) { btnInfo.classList.remove('active'); btnInfo.setAttribute('aria-selected', 'false'); }
    if (btnImages) { btnImages.classList.add('active'); btnImages.setAttribute('aria-selected', 'true'); }
    if (paneInfo) paneInfo.classList.remove('active');
    if (paneImages) paneImages.classList.add('active');
  } else {
    if (btnImages) { btnImages.classList.remove('active'); btnImages.setAttribute('aria-selected', 'false'); }
    if (btnInfo) { btnInfo.classList.add('active'); btnInfo.setAttribute('aria-selected', 'true'); }
    if (paneImages) paneImages.classList.remove('active');
    if (paneInfo) paneInfo.classList.add('active');
  }
}

// Check hash on page load or change
function checkHashForTab() {
  if (window.location.hash === '#imagenes') {
    switchProjectTab('images');
  }
}
window.addEventListener('hashchange', checkHashForTab);
window.addEventListener('DOMContentLoaded', checkHashForTab);
if (window.location.hash === '#imagenes') checkHashForTab();

// ===== LIGHTBOX MODAL =====
let currentImageIndex = 0;
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxBadge = document.getElementById('lightbox-badge');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');

function openLightbox(index) {
  currentImageIndex = (index + galleryData.length) % galleryData.length;
  const item = galleryData[currentImageIndex];

  if (lightboxImg) lightboxImg.src = item.src;
  if (lightboxBadge) lightboxBadge.textContent = item.badge;
  if (lightboxTitle) lightboxTitle.textContent = item.title;
  if (lightboxDesc) lightboxDesc.textContent = item.desc;

  if (lightboxModal) {
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(e) {
  if (lightboxModal) {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeLightboxImage(delta) {
  openLightbox(currentImageIndex + delta);
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeLightboxImage(-1);
  if (e.key === 'ArrowRight') changeLightboxImage(1);
});

console.log('%c🚀 CosmoClock · Proyecto micro:bit · Isa, Lulu & Pipe', 'color: #a855f7; font-size: 14px; font-weight: bold;');
