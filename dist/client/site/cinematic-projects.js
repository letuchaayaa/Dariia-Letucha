(() => {
  const section = document.querySelector("[data-cinematic-projects]");
  if (!section) return;

  const sticky = section.querySelector(".cinematic-sticky");
  const stage = section.querySelector(".cinematic-stage");
  const cards = [...section.querySelectorAll(".cinematic-card")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let frame = 0;
  let targetProgress = 0;
  let currentProgress = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const easeInOut = (value) => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2);

  const layouts = {
    desktop: [
      { x: -34, y: -16, r: -4, depth: -220 },
      { x: 26, y: -22, r: 3, depth: -100 },
      { x: -22, y: 18, r: 2, depth: 60 },
      { x: 34, y: 12, r: -3, depth: 140 },
      { x: -42, y: -2, r: -7, depth: -40 },
      { x: 12, y: 24, r: 5, depth: 220 },
      { x: 43, y: -5, r: 4, depth: -180 },
      { x: -6, y: -28, r: -2, depth: 40 },
    ],
    mobile: [
      { x: -24, y: -21, r: -3, depth: -160 },
      { x: 19, y: -24, r: 2, depth: -70 },
      { x: -18, y: 16, r: 2, depth: 20 },
      { x: 22, y: 19, r: -2, depth: 80 },
      { x: -22, y: -2, r: -4, depth: -30 },
      { x: 8, y: 24, r: 3, depth: 110 },
      { x: 24, y: -7, r: 3, depth: -120 },
      { x: -6, y: -26, r: -2, depth: 30 },
    ],
  };

  const getProgress = () => {
    const bounds = section.getBoundingClientRect();
    const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
    return clamp(-bounds.top / distance);
  };

  const updateCards = () => {
    const mobile = window.innerWidth <= 760;
    const layout = mobile ? layouts.mobile : layouts.desktop;
    const count = cards.length;
    const spacing = 1 / count;

    cards.forEach((card, index) => {
      const local = clamp((currentProgress - index * spacing * 0.78 + 0.1) / 0.34);
      const eased = easeInOut(local);
      const point = layout[index % layout.length];
      const startScale = mobile ? 0.48 : 0.42;
      const endScale = mobile ? 1.05 : 1.22;
      const scale = startScale + eased * (endScale - startScale);
      const introZ = -760 + eased * (760 + point.depth);
      const x = point.x * eased;
      const y = point.y * eased;
      const rotate = point.r * eased;
      const fadeIn = clamp(local / 0.22);
      const fadeOut = 1 - clamp((local - 0.76) / 0.24);
      const opacity = reducedMotion.matches ? 1 : Math.min(fadeIn, fadeOut);
      const zIndex = Math.round(20 + eased * 40 + point.depth / 20);

      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(zIndex);
      card.style.transform = [
        "translate(-50%, -50%)",
        `translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}vh, ${introZ.toFixed(2)}px)`,
        `rotate(${rotate.toFixed(2)}deg)`,
        `scale(${scale.toFixed(3)})`,
      ].join(" ");
    });
  };

  const render = () => {
    targetProgress = getProgress();
    currentProgress += (targetProgress - currentProgress) * 0.12;
    updateCards();
    frame = requestAnimationFrame(render);
  };

  const setStatic = () => {
    currentProgress = 0.42;
    targetProgress = 0.42;
    updateCards();
  };

  if (reducedMotion.matches) {
    setStatic();
  } else {
    frame = requestAnimationFrame(render);
  }

  reducedMotion.addEventListener("change", () => {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) setStatic();
    else frame = requestAnimationFrame(render);
  });

  window.addEventListener("resize", updateCards, { passive: true });
  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", updateCards);
  });

  sticky.addEventListener("mousemove", (event) => {
    if (reducedMotion.matches) return;
    const x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 12;
    const y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 8;
    stage.style.setProperty("transform", `rotateX(${-y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`);
  });

  sticky.addEventListener("mouseleave", () => {
    stage.style.removeProperty("transform");
  });
})();
