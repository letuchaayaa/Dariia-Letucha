(() => {
  const scene = document.querySelector('[data-explorations-scroll]');
  const grid = document.querySelector('[data-explorations-grid]');
  if (!scene || !grid) return;

  const images = [...grid.querySelectorAll('.explorations-grid__image')];
  const titlePanel = scene.querySelector('.explorations-title');
  const title = titlePanel?.querySelector('h2');
  const actionButtons = [...(titlePanel?.querySelectorAll('a') || [])];
  const stage = scene.querySelector('.explorations-section');
  const revealOrder = [12, 3, 17, 8, 1, 15, 6, 19, 10, 4, 14, 0, 18, 7, 11, 2, 16, 9, 5, 13];
  const rank = new Map(revealOrder.map((imageIndex, orderIndex) => [imageIndex, orderIndex]));
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const ease = (value) => 0.5 - Math.cos(value * Math.PI) / 2;
  let baseTitleSize = title ? parseFloat(getComputedStyle(title).fontSize) : 0;

  let ticking = false;
  const render = () => {
    ticking = false;
    const available = Math.max(1, scene.offsetHeight - window.innerHeight);
    const progress = clamp((window.scrollY - scene.offsetTop) / available);

    const depart = ease(clamp((progress - .86) / .11));
    images.forEach((image, index) => {
      const delay = (rank.get(index) || 0) * 0.012;
      const local = ease(clamp((progress - .08 - delay) / .5));
      const hidden = 1 - local;
      const columns = window.innerWidth <= 700 ? 4 : 5;
      const column = index % columns;
      const row = Math.floor(index / columns);
      const direction = index % 2 === 0 ? -1 : 1;
      const flyX = Math.sin((index + 1) * 1.73) * window.innerWidth * .72 * depart;
      const flyY = Math.cos((index + 2) * 1.19) * window.innerHeight * .62 * depart - depart * depart * 130;
      const flyZ = (160 + (index % 5) * 74) * depart;
      const rotateX = direction * (62 + (index % 4) * 29) * depart;
      const rotateY = -direction * (96 + (index % 6) * 34) * depart;
      const rotateZ = direction * (20 + (column + row) * 11) * depart;
      const flatten = Math.max(.16, 1 - depart * .84);
      const opacity = local * (1 - depart);
      image.style.opacity = String(opacity);
      image.style.visibility = opacity > .002 ? 'visible' : 'hidden';
      image.style.transform = `translate3d(${flyX}px, ${hidden * window.innerHeight + flyY}px, ${hidden * -900 + flyZ}px) rotateX(${hidden * -70 + rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scaleY(${flatten})`;
    });

    const introTitle = 1 - ease(clamp((progress - .58) / .18));
    const cta = ease(clamp((progress - .955) / .045));
    if (stage) {
      const paper = Math.round(14 + cta * 241);
      stage.style.backgroundColor = `rgb(${paper}, ${paper}, ${paper})`;
      stage.style.setProperty('--paper-progress', String(cta));
    }
    if (titlePanel && title) {
      const ink = Math.round(245 * (1 - cta) + 14 * cta);
      titlePanel.style.opacity = String(Math.max(introTitle, cta));
      titlePanel.style.color = `rgb(${ink}, ${ink}, ${ink})`;
      title.style.fontSize = `${baseTitleSize}px`;
      title.style.textShadow = `0 2px ${28 * (1 - cta)}px rgba(0, 0, 0, ${.72 * (1 - cta)})`;
    }
    actionButtons.forEach((button) => {
      button.style.opacity = String(cta);
      button.style.transform = `translateY(${(1 - cta) * 10}px)`;
      button.style.pointerEvents = cta > .8 ? 'auto' : 'none';
    });
  };

  const requestRender = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  };

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', () => {
    if (title) {
      title.style.removeProperty('font-size');
      baseTitleSize = parseFloat(getComputedStyle(title).fontSize);
    }
    requestRender();
  });
  render();
})();
