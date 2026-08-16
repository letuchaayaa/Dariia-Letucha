(() => {
  const section = document.querySelector("[data-what-i-do-orbit]");
  const cardsLayer = document.querySelector("[data-orbit-stage]");
  const activeTitle = document.querySelector("[data-orbit-title]");

  if (!section || !cardsLayer || !activeTitle) return;

  const projects = [
    { id: "eden", title: "Eden", href: "site-project.html#eden", image: "assets/project-eden-cover.png" },
    { id: "vinyl", title: "Vinyl", href: "site-project.html#vinyl", image: "assets/project-vinyl-cover.png" },
    { id: "agronova", title: "Agronova", href: "agronova.html", image: "assets/project-agronova-cover.png" },
    { id: "sila", title: "Sila Studio", href: "site-project.html#sila", image: "assets/project-sila-studio-cover.png" },
    { id: "tennis", title: "Tennis", href: "site-project.html#tennis", image: "assets/project-tennis-cover.png" },
    { id: "klaries", title: "Klaries", href: "klaries.html", image: "assets/project-klaries-cover.png" },
    { id: "white-dent", title: "White Dent", href: "white-dent.html", image: "assets/project-white-dent-cover.png" },
    { id: "tpd", title: "Think Plan Do", href: "site-project.html#tpd", image: "assets/project-tpd-cover.png" },
    { id: "solaris", title: "Solaris", href: "site-project.html#solaris", image: "assets/project-solaris-cover.png" },
    { id: "pifagor", title: "Pifagor", href: "projects.html", image: "assets/project-pifagor-cover.png" },
    { id: "steptravel", title: "Step Travel", href: "site-project.html#steptravel", image: "assets/project-steptravel-cover.png" },
    { id: "blackpeat", title: "BlackPeat", href: "projects.html", image: "assets/project-blackpeat-cover.png" },
  ];

  const buildEllipseLUT = (radiusX, radiusY, tilt, samples = 1000) => {
    const points = [];
    let totalLength = 0;

    for (let index = 0; index <= samples; index += 1) {
      const angle = (index / samples) * Math.PI * 2;
      const ellipseX = Math.cos(angle) * radiusX;
      const ellipseY = Math.sin(angle) * radiusY;
      const x = ellipseX * Math.cos(tilt) - ellipseY * Math.sin(tilt);
      const y = ellipseX * Math.sin(tilt) + ellipseY * Math.cos(tilt);

      if (index > 0) {
        const previous = points[index - 1];
        totalLength += Math.hypot(x - previous.x, y - previous.y);
      }

      points.push({ x, y, length: totalLength, progress: 0 });
    }

    points.forEach((point) => {
      point.progress = totalLength ? point.length / totalLength : 0;
    });

    return points;
  };

  const getEllipsePoint = (lut, progress) => {
    const normalized = ((progress % 1) + 1) % 1;
    let start = 0;
    let end = lut.length - 1;

    while (start < end - 1) {
      const middle = Math.floor((start + end) / 2);
      if (lut[middle].progress < normalized) start = middle;
      else end = middle;
    }

    const first = lut[start];
    const second = lut[end];
    const distance = second.progress - first.progress || 1;
    const interpolation = (normalized - first.progress) / distance;

    return {
      x: first.x + (second.x - first.x) * interpolation,
      y: first.y + (second.y - first.y) * interpolation,
    };
  };

  let size = { width: 1280, height: 720 };
  let ellipseLUT = [];
  let animationFrame = 0;
  let lastFrame = 0;
  let phase = 0;
  let direction = 1;
  let velocityBonus = 0;
  let activeIndex = null;
  let touchY = 0;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const cards = projects.map((project, index) => {
    const card = document.createElement("a");
    const media = document.createElement("div");
    const image = document.createElement("img");
    const number = document.createElement("span");

    card.className = "what-i-do-orbit__card";
    card.href = project.href;
    card.setAttribute("aria-label", `Open project: ${project.title}`);
    card.style.setProperty("--intro-delay", `${(projects.length - 1 - index) * 55}ms`);

    media.className = "what-i-do-orbit__media";
    image.src = project.image;
    image.alt = project.title;
    image.draggable = false;
    image.decoding = "async";
    image.loading = index < 6 ? "eager" : "lazy";
    number.className = "what-i-do-orbit__number";
    number.textContent = String(index + 1).padStart(3, "0");

    media.append(image, number);
    card.appendChild(media);
    cardsLayer.appendChild(card);

    card.addEventListener("mouseenter", () => setActive(index));
    card.addEventListener("mouseleave", clearActive);
    card.addEventListener("focus", () => setActive(index));
    card.addEventListener("blur", clearActive);

    return card;
  });

  const updateSize = () => {
    const bounds = section.getBoundingClientRect();
    size = { width: bounds.width, height: bounds.height };
    const mobile = size.width <= 768;
    const radiusX = mobile ? size.width * 0.42 : size.width * 0.43;
    const radiusY = mobile ? size.height * 0.24 : size.height * 0.34;
    const tilt = mobile ? Math.PI / 6 : Math.PI / 7;
    ellipseLUT = buildEllipseLUT(radiusX, radiusY, tilt);
  };

  const setActive = (index) => {
    activeIndex = index;
    cardsLayer.classList.add("has-active-card");
    activeTitle.textContent = projects[index].title;
    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === index);
    });
  };

  const clearActive = () => {
    activeIndex = null;
    cardsLayer.classList.remove("has-active-card");
    activeTitle.textContent = "Selected projects";
    cards.forEach((card) => card.classList.remove("is-active"));
  };

  const positionCards = () => {
    const count = projects.length;

    cards.forEach((card, index) => {
      const progress = index / count + phase;
      const position = getEllipsePoint(ellipseLUT, progress);
      const depth = position.y / Math.max(size.height, 1) + 0.5;
      const zIndex = Math.round(20 + depth * 20);
      const opacity = Math.max(0.58, Math.min(1, 0.72 + depth * 0.38));

      card.style.setProperty("--depth-opacity", opacity.toFixed(2));
      card.style.transform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, 0) translate(-50%, -50%)`;
      card.style.zIndex = activeIndex === index ? "100" : String(zIndex);
    });
  };

  const render = (timestamp) => {
    if (!lastFrame) lastFrame = timestamp;
    const delta = Math.min(timestamp - lastFrame, 40);
    lastFrame = timestamp;

    if (!reducedMotionQuery.matches) {
      velocityBonus *= 0.9;
      phase += (0.000018 * direction + velocityBonus) * delta;
    }

    positionCards();

    animationFrame = requestAnimationFrame(render);
  };

  const sectionIsVisible = () => {
    const bounds = section.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight;
  };

  const addImpulse = (delta) => {
    if (!sectionIsVisible()) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection) direction = nextDirection;
    const impulse = Math.min(Math.abs(delta) * 0.00000025, 0.00016);
    velocityBonus = impulse * direction;
  };

  const onWheel = (event) => addImpulse(event.deltaY);

  const onTouchStart = (event) => {
    touchY = event.touches[0]?.clientY || 0;
  };

  const onTouchMove = (event) => {
    const nextY = event.touches[0]?.clientY || touchY;
    const delta = touchY - nextY;
    touchY = nextY;
    addImpulse(delta);
  };

  const onResize = () => {
    updateSize();
    positionCards();
    lastFrame = 0;
  };

  updateSize();
  positionCards();
  requestAnimationFrame(() => section.classList.add("is-ready"));
  animationFrame = requestAnimationFrame(render);

  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("resize", onResize);

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("resize", onResize);
  });
})();
