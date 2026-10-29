/*
  CONFETTI.JS
  -----------
  A tiny, dependency-free confetti burst used on level complete.
  Draws to a canvas placed over the modal, runs for ~1.6s, then
  removes itself. Respects the reduced-motion setting.
*/

const CONFETTI_COLORS = ['#FFC24B', '#FF4F81', '#3FD3FF', '#9DFF6A', '#FFFFFF'];

function burstConfetti(container, options = {}) {
  if (document.body.classList.contains('reduced-motion')) return;

  const count = options.count || 90;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  container.appendChild(canvas);

  const dpr = window.devicePixelRatio || 1;
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const pieces = Array.from({ length: count }, () => ({
    x: rect.width / 2 + (Math.random() - 0.5) * 40,
    y: rect.height * 0.35,
    vx: (Math.random() - 0.5) * 9,
    vy: -6 - Math.random() * 6,
    size: 5 + Math.random() * 5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    gravity: 0.28 + Math.random() * 0.1
  }));

  const start = performance.now();
  const duration = 1600;

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, rect.width, rect.height);

    pieces.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

if (typeof module !== 'undefined') {
  module.exports = { burstConfetti };
}
