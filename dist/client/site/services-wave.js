(() => {
  const wrapper = document.querySelector("[data-services-wave]");
  if (!wrapper) return;

  const leftColumn = wrapper.querySelector("[data-wave-left]");
  const rightColumn = wrapper.querySelector("[data-wave-right]");
  const image = wrapper.querySelector("[data-wave-image]");
  const leftItems = [...leftColumn.querySelectorAll(".services-wave__item")];
  const rightItems = [...rightColumn.querySelectorAll(".services-wave__item")];
  const items = leftItems.map((left, index) => ({ left, right: rightItems[index] })).filter((item) => item.right);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let frame = 0;
  let currentProgress = 0;
  let targetProgress = 0;
  let activeIndex = -1;
  let leftRange = 0;
  let rightRange = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const calculateRanges = () => {
    const maxLeft = Math.max(...leftItems.map((item) => item.offsetWidth), 1);
    const maxRight = Math.max(...rightItems.map((item) => item.offsetWidth), 1);
    leftRange = Math.max(leftColumn.offsetWidth - maxLeft, 0);
    rightRange = Math.max(rightColumn.offsetWidth - maxRight, 0);
  };

  const getProgress = () => {
    const bounds = wrapper.getBoundingClientRect();
    const distance = Math.max(wrapper.offsetHeight - window.innerHeight, 1);
    return clamp(-bounds.top / distance);
  };

  const focusClosestItem = () => {
    const viewportCenter = window.innerHeight / 2;
    let nextIndex = 0;
    let smallestDistance = Infinity;

    leftItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - viewportCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nextIndex = index;
      }
    });

    if (nextIndex === activeIndex) return;

    activeIndex = nextIndex;
    items.forEach(({ left, right }, index) => {
      const focused = index === activeIndex;
      left.classList.toggle("is-focused", focused);
      right.classList.toggle("is-focused", focused);
    });

    const nextImage = leftItems[activeIndex]?.dataset.image;
    if (nextImage && image && !image.src.endsWith(nextImage)) {
      image.src = nextImage;
    }
  };

  const update = () => {
    const phaseOffset = currentProgress * Math.PI * 2 * 1.65;
    const waveNumber = window.innerWidth <= 920 ? 1.25 : 1.7;

    leftItems.forEach((item, index) => {
      const phase = waveNumber * index + phaseOffset - Math.PI / 2;
      const wave = (Math.sin(phase) + 1) / 2;
      item.style.transform = `translate3d(${(wave * leftRange).toFixed(2)}px, 0, 0)`;
    });

    rightItems.forEach((item, index) => {
      const phase = waveNumber * index + phaseOffset - Math.PI / 2;
      const wave = (Math.sin(phase) + 1) / 2;
      item.style.transform = `translate3d(${(-wave * rightRange).toFixed(2)}px, 0, 0)`;
    });

    wrapper.style.setProperty("--thumb-y", `${Math.sin(phaseOffset) * 18}px`);
    focusClosestItem();
  };

  const render = () => {
    targetProgress = getProgress();
    currentProgress += (targetProgress - currentProgress) * 0.11;
    update();
    frame = requestAnimationFrame(render);
  };

  const setStatic = () => {
    currentProgress = 0.34;
    update();
  };

  const start = () => {
    calculateRanges();
    if (reducedMotion.matches) {
      setStatic();
      return;
    }
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  };

  const handleResize = () => {
    calculateRanges();
    update();
  };

  window.addEventListener("resize", handleResize, { passive: true });
  reducedMotion.addEventListener("change", start);
  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", handleResize);
    reducedMotion.removeEventListener("change", start);
  });

  start();
})();
