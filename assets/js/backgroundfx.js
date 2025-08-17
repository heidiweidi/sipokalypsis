/**
 * Moving Lines Background
 * - Attach to any element with class "moving-lines-bg"
 * - Customize via CSS variables on that element.
 *   Vars:
 *     --ml-color      (CSS color, e.g. "hotpink" or "hsl(210 90% 60%)")
 *     --ml-count      (int, number of lines)
 *     --ml-speed      (float, ~0.1–3)
 *     --ml-thickness  (px)
 *     --ml-opacity    (0–1)
 *     --ml-blur       (e.g., "0.5px")
 *     --ml-trail      (0–0.2: fade amount each frame, higher = longer trail)
 *     --ml-bg         (any CSS background for the host)
 */
(function() {
  const hosts = Array.from(document.querySelectorAll('.moving-lines-bg'));
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); // cap DPR for perf

  hosts.forEach(setup);

  function setup(host) {
    const canvas = document.createElement('canvas');
    host.prepend(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });

    let W = 0, H = 0, running = true;

    const cfg = () => {
      const cs = getComputedStyle(host);
      return {
        color: cs.getPropertyValue('--ml-color').trim() || 'white',
        count: clamp(int(cs.getPropertyValue('--ml-count')), 0, 1000) || 60,
        speed: clamp(float(cs.getPropertyValue('--ml-speed')), 0.05, 5) || 0.7,
        thickness: clamp(int(cs.getPropertyValue('--ml-thickness')), 1, 10) || 2,
        opacity: clamp(float(cs.getPropertyValue('--ml-opacity')), 0, 1) ?? 0.8,
        trail: clamp(float(cs.getPropertyValue('--ml-trail')), 0, 0.25) ?? 0.06
      };
    };

    function resize() {
      const rect = host.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Build lines (particles)
    let lines = [];
    function resetLines() {
      const { count } = cfg();
      lines = new Array(count).fill(0).map(() => makeLine());
    }
    function makeLine() {
      // Randomize orientation: 70% diagonal, 20% horizontal, 10% vertical
      const r = Math.random();
      let angle;
      if (r < 0.1) angle = 0;                 // horizontal
      else if (r < 0.2) angle = Math.PI / 2;  // vertical
      else angle = Math.random() * Math.PI;   // diagonal

      const len = rand(40, 220);
      const speed = rand(20, 120) * cfg().speed;
      const life = rand(3, 9); // seconds
      const t0 = performance.now() / 1000;
      // Start just outside bounds so they slide in
      const margin = 40;
      const x = rand(-margin, W + margin);
      const y = rand(-margin, H + margin);

      // Give each line a subtle hue jitter along its lifetime
      const hueShift = rand(-20, 20);

      return { x, y, len, angle, speed, life, t0, hueShift };
    }

    // Utility randoms
    function rand(a, b) { return a + Math.random() * (b - a); }
    function int(v) { const n = parseInt(v, 10); return Number.isFinite(n) ? n : undefined; }
    function float(v){ const n = parseFloat(v); return Number.isFinite(n) ? n : undefined; }
    function clamp(n, min, max){ return Math.min(max, Math.max(min, n)); }

    resetLines();

    // Animation loop
    let last = performance.now();
    (function frame(now) {
      if (!running) return;
      requestAnimationFrame(frame);
      const dt = Math.min(0.033, (now - last) / 1000); // clamp delta to ~30fps worst case
      last = now;

      const { color, thickness, opacity, trail } = cfg();

      // Trail effect: translucent rect to slowly fade previous strokes
      if (trail > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(0,0,0,${trail})`;
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.clearRect(0, 0, W, H);
      }

      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity;

      lines.forEach((L, i) => {
        // Move
        L.x += Math.cos(L.angle) * L.speed * dt;
        L.y += Math.sin(L.angle) * L.speed * dt;

        // Wrap around screen with margin
        const margin = 60;
        if (L.x < -margin) L.x = W + margin;
        if (L.x > W + margin) L.x = -margin;
        if (L.y < -margin) L.y = H + margin;
        if (L.y > H + margin) L.y = -margin;

        // Slight drift to avoid perfectly straight motion
        L.angle += (Math.random() - 0.5) * 0.003;

        // Color jitter (optional, based on base color hue)
        ctx.strokeStyle = color;
        // If color is hsl(), we can subtly shift hue. Quick heuristic:
        if (/hsl\(/i.test(color)) {
          // Pull the hue number and add a tiny oscillation
          const baseHue = +color.match(/hsl\(\s*([-\d.]+)/i)?.[1] || 0;
          const t = (now / 1000) - L.t0;
          const hue = baseHue + Math.sin(t * 0.5) * 6 + L.hueShift;
          ctx.strokeStyle = color.replace(/hsl\([^)]+\)/i, `hsl(${hue} 90% 60%)`);
        }

        // Draw
        const dx = Math.cos(L.angle) * L.len;
        const dy = Math.sin(L.angle) * L.len;
        ctx.beginPath();
        ctx.moveTo(L.x - dx * 0.5, L.y - dy * 0.5);
        ctx.lineTo(L.x + dx * 0.5, L.y + dy * 0.5);
        ctx.stroke();

        // Respawn after life expires
        if (((now / 1000) - L.t0) > L.life) {
          lines[i] = makeLine();
        }
      });
    })(last);

    // Hot-reload lines if CSS variables change (polling is simple & robust)
    let prevSig = '';
    setInterval(() => {
      const c = cfg();
      const sig = [c.count, c.speed, c.thickness, c.opacity, c.trail, c.color].join('|');
      if (sig !== prevSig) {
        prevSig = sig;
        resize();
        resetLines();
      }
    }, 500);

    // Cleanup if host removed
    const obs = new MutationObserver(() => {
      if (!document.body.contains(host)) {
        running = false;
        ro.disconnect();
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();