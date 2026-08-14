window.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-mwg-hero]');
  if (!root) return;

  const sources = [...root.querySelectorAll('.mwg-hero__media img')].map((image) => image.src);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(hover: none)').matches;
  const mobileViewport = window.matchMedia('(max-width: 700px)').matches;
  let index = 0;
  let distance = 0;
  let previousX = null;
  let previousY = null;

  const updateHeader = () => {
    const rect = root.getBoundingClientRect();
    document.body.classList.toggle('mwg-active', rect.top <= 1 && rect.bottom > 48);
  };

  const createImage = (x, y, deltaX) => {
    if (reducedMotion || !sources.length || y > root.clientHeight - 110) return;
    const image = document.createElement('img');
    image.className = 'mwg-hero__falling';
    image.src = sources[index];
    image.alt = '';
    index = (index + 1) % sources.length;
    root.append(image);

    const size = Math.min(Math.max(root.clientWidth * (coarsePointer ? .35 : .15), coarsePointer ? 112 : 150), 280);
    const startX = x - size / 2 + (Math.random() - .5) * size * .55;
    const startY = y - size / 2;
    const drift = Math.max(-180, Math.min(180, deltaX * 3.2));
    const turn = (Math.random() - .5) * 34;
    const floorY = root.clientHeight - size * .9;

    const animation = image.animate([
      { transform: `translate3d(${startX}px, ${startY}px, 0) rotate(${turn * -.35}deg) scale(1.28)`, offset: 0 },
      { transform: `translate3d(${startX + drift * .35}px, ${Math.max(startY + 30, floorY)}px, 0) rotate(0deg) scale(.92)`, offset: .48 },
      { transform: `translate3d(${startX + drift * .72}px, ${Math.max(startY + 8, floorY - size * .46)}px, 0) rotate(${turn}deg) scale(.9)`, offset: .7 },
      { transform: `translate3d(${startX + drift}px, ${root.clientHeight + size * .35}px, 0) rotate(${turn * 1.7}deg) scale(.86)`, offset: 1 },
    ], {
      duration: 1150,
      easing: 'cubic-bezier(.35,.05,.22,1)',
      fill: 'forwards',
    });
    animation.addEventListener('finish', () => image.remove(), { once: true });
    animation.addEventListener('cancel', () => image.remove(), { once: true });
  };

  const move = (x, y) => {
    const rect = root.getBoundingClientRect();
    if (previousX === null || previousY === null) {
      previousX = x;
      previousY = y;
      return;
    }
    const deltaX = x - previousX;
    const deltaY = y - previousY;
    distance += Math.abs(deltaX) + Math.abs(deltaY);
    const threshold = root.clientWidth / (coarsePointer ? 6 : 8);
    if (distance > threshold) {
      distance = 0;
      createImage(x - rect.left, y - rect.top, deltaX);
    }
    previousX = x;
    previousY = y;
  };

  root.addEventListener('pointermove', (event) => move(event.clientX, event.clientY), { passive: true });
  root.addEventListener('pointerleave', () => {
    previousX = null;
    previousY = null;
  });

  if ((coarsePointer || mobileViewport) && !reducedMotion) {
    window.setTimeout(() => {
      const rect = root.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const drops = [
        [.2, .18, 32],
        [.72, .22, -24],
        [.42, .12, 18],
        [.82, .38, -34],
        [.28, .34, 26],
        [.58, .27, -18],
        [.14, .42, 30],
      ];
      drops.forEach(([x, y, drift], dropIndex) => {
        window.setTimeout(() => createImage(root.clientWidth * x, root.clientHeight * y, drift), dropIndex * 190);
      });
    }, 2000);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
});
