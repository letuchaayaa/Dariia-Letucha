const initializePageTransition = () => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let layer = document.querySelector('.page-transition');

  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'page-transition';
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(layer);
  }

  let canvas = layer.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    layer.replaceChildren(canvas);
  }
  const context = canvas?.getContext('2d', { alpha: true });
  let running = false;
  let frameId = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const ease = (value) => value < .5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
  const noise = (x, y) => {
    const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  const resize = () => {
    if (!canvas || !context) return null;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { width, height };
  };

  const drawDots = (width, height, progress, time) => {
    const grid = window.innerWidth <= 700 ? 12 : 15;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxEdge = Math.min(width, height) / 2;
    const reach = maxEdge * progress;
    const softness = grid * 11;

    context.clearRect(0, 0, width, height);
    context.fillStyle = '#111';

    for (let y = 0; y < height + grid; y += grid) {
      for (let x = 0; x < width + grid; x += grid) {
        const edge = Math.min(x, y, width - x, height - y);
        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        const random = noise(x / grid, y / grid);
        const drift = Math.sin(angle * 3 + time * 4 + random * 5) * grid * 4;
        const ripple = Math.cos((x + y) * .007 - time * 5) * grid * 2.4;
        const wave = clamp((reach + drift + ripple - edge) / softness);
        const patch = Math.sin(x * .011 + time * 2.1) + Math.cos(y * .013 - time * 1.7) + random;
        if (wave < .05 || patch < .35) continue;

        const pulse = .5 + Math.sin(time * 8 + random * 8 + angle * 2) * .5;
        const size = 2 + Math.floor(pulse * 1.8);
        context.globalAlpha = clamp(.12 + wave * .46 + pulse * .16, .1, .72);
        context.fillRect(
          Math.round(x + Math.sin(time * 5 + random * 6) * 2),
          Math.round(y + Math.cos(time * 4 + random * 6) * 2),
          size,
          size,
        );
      }
    }
    context.globalAlpha = 1;
  };

  const startCover = () => {
    if (running) return;
    running = true;
    root.classList.add('page-is-leaving');

    window.setTimeout(() => {
      root.classList.remove('page-is-leaving');
      layer.style.background = 'rgba(255,255,255,0)';
      if (context && canvas) context.clearRect(0, 0, canvas.width, canvas.height);
      running = false;
    }, 1050);

    if (reducedMotion || !context) {
      layer.style.background = '#fff';
      return;
    }

    const size = resize();
    if (!size) return;
    const started = performance.now();
    const duration = 600;

    const frame = (now) => {
      const raw = clamp((now - started) / duration);
      const progress = ease(raw);
      layer.style.background = `rgba(255,255,255,${progress.toFixed(3)})`;
      drawDots(size.width, size.height, progress, (now - started) * .001);
      if (raw < 1) frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    const link = target instanceof Element ? target.closest('a[href]') : null;
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    event.preventDefault();
    startCover();
    window.setTimeout(() => { location.href = url.href; }, 620);
  }, true);

  window.addEventListener('page-transition:start', startCover);

  window.addEventListener('pageshow', () => {
    if (!running) return;
    cancelAnimationFrame(frameId);
    root.classList.remove('page-is-leaving');
    layer.style.background = 'rgba(255,255,255,0)';
    running = false;
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePageTransition, { once: true });
} else {
  initializePageTransition();
}
