const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pageTransitionsEnabled = false;

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);
const easeInOutCubicValue = (value) => value < 0.5
  ? 4 * value * value * value
  : 1 - Math.pow(-2 * value + 2, 3) / 2;
const seededNoise = (x, y) => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
};
const homeLoaderStorageKey = "dariia-home-loader-seen";
const hasSeenHomeLoader = () => {
  try {
    return window.sessionStorage.getItem(homeLoaderStorageKey) === "true";
  } catch {
    return false;
  }
};
const markHomeLoaderSeen = () => {
  try {
    window.sessionStorage.setItem(homeLoaderStorageKey, "true");
  } catch {
    // Session storage can be unavailable in private browser modes.
  }
};

const internalPages = new Set([
  "index.html",
  "daria.html",
  "copy-main.html",
  "projects.html",
  "projects-test.html",
  "about.html",
  "about-dark.html",
  "lets-talk.html",
  "services.html",
  "agronova.html",
  "klaries.html",
  "white-dent.html",
  "site-project.html",
  "index-light.html",
  "services-light.html",
  "projects-light.html",
  "about-light.html",
  "lets-talk-light.html",
]);

const paletteStorageKey = "dariia-site-palette";
const transitionStorageKey = "dariia-transition-palette";
const palettes = ["black", "white", "grey", "blue", "white-violet", "black-violet"];
const paletteLabels = {
  black: "Black",
  white: "White",
  grey: "Grey",
  blue: "Blue",
  "white-violet": "White/Violet",
  "black-violet": "Black/Violet",
};

const getStoredPalette = () => {
  try {
    const stored = window.localStorage.getItem(paletteStorageKey);
    return palettes.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};

const setStoredPalette = (palette) => {
  try {
    window.localStorage.setItem(paletteStorageKey, palette);
  } catch {
    // Local storage can be unavailable in private browser modes.
  }
};

const getInitialPalette = () => {
  const params = new URLSearchParams(window.location.search);
  const queryPalette = params.get("theme");
  if (palettes.includes(queryPalette)) return queryPalette;
  return "black-violet";
};

const applyPalette = (palette, persist = false) => {
  const nextPalette = palettes.includes(palette) ? palette : "black";
  palettes.forEach((name) => document.body.classList.remove(`theme-${name}`));
  document.body.classList.remove("light-site");
  document.body.classList.add(`theme-${nextPalette}`);
  document.body.dataset.palette = nextPalette;
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    const isActive = button.dataset.themeChoice === nextPalette;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  window.dispatchEvent(new CustomEvent("dariia:palette-change", { detail: { palette: nextPalette } }));
  if (persist) setStoredPalette(nextPalette);
};

const getCurrentPalette = () => document.body.dataset.palette || getInitialPalette();

const blackTransitionPages = new Set([
  "index.html",
  "daria.html",
  "copy-main.html",
  "services.html",
]);

const getTransitionPaletteForPage = (pageName) => (
  blackTransitionPages.has(pageName) ? "black-violet" : "white"
);

const setStoredTransitionPalette = (palette) => {
  try {
    window.sessionStorage.setItem(transitionStorageKey, palette);
  } catch {
    // Session storage can be unavailable in private browser modes.
  }
};

const getStoredTransitionPalette = () => {
  try {
    const stored = window.sessionStorage.getItem(transitionStorageKey);
    return palettes.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};

const clearStoredTransitionPalette = () => {
  try {
    window.sessionStorage.removeItem(transitionStorageKey);
  } catch {
    // Session storage can be unavailable in private browser modes.
  }
};

const getPixelColorForPalette = (palette) => {
  if (palette === "blue") return "#054DE8";
  if (palette === "white" || palette === "grey") return "rgb(10, 10, 10)";
  if (palette === "white-violet" || palette === "black-violet") return "#9f63ff";
  return "#9f63ff";
};

const updatePaletteAssets = (palette) => {
  const blueAssetMap = {
    "doodle-film": "assets/theme-blue/sticker-film.png",
    "doodle-dog": "assets/theme-blue/sticker-smile.png",
    "doodle-can": "assets/theme-blue/sticker-can.png",
    "doodle-smile": "assets/theme-blue/sticker-smile.png",
    "doodle-hand": "assets/theme-blue/sticker-hand.png",
  };
  const purpleAssetMap = {
    "doodle-film": "assets/sticker-purple-film.png",
    "doodle-dog": "assets/sticker-purple-smile.png",
    "doodle-can": "assets/sticker-purple-can.png",
    "doodle-smile": "assets/sticker-purple-smile.png",
    "doodle-hand": "assets/sticker-purple-hand.png",
  };
  const sourceMap = palette === "blue" ? blueAssetMap : purpleAssetMap;
  document.querySelectorAll(".doodle").forEach((image) => {
    const key = Object.keys(sourceMap).find((className) => image.classList.contains(className));
    if (key) image.src = sourceMap[key];
  });
};

const setupPaletteSwitcher = () => {
  const current = getInitialPalette();
  applyPalette(current, false);
  updatePaletteAssets(current);

  document.querySelectorAll(".desktop-nav a, .menu-panel nav a, .footer-nav a").forEach((link) => {
    const label = link.textContent.trim().toLowerCase();
    const href = link.getAttribute("href") || "";
    if (label.includes("light") || href.includes("-light.html")) {
      link.remove();
    }
  });

  document.querySelectorAll(".projects-title").forEach((title) => {
    title.setAttribute("aria-label", "Mine Projects");
    title.querySelectorAll(".title-mine").forEach((word) => {
      word.textContent = "Mine";
    });
  });

  document.querySelectorAll(".cv-link").forEach((link) => {
    link.setAttribute("aria-hidden", "true");
    link.tabIndex = -1;
  });

  document.querySelectorAll(".theme-switcher").forEach((switcher) => switcher.remove());

  applyPalette(current, false);
  updatePaletteAssets(current);
};

const getPageName = (url) => {
  const path = new URL(url, window.location.href).pathname;
  return path.split("/").pop() || "index.html";
};

const createPixelTransition = () => {
  if (prefersReducedMotion.matches) return null;
  const existing = document.querySelector(".pixel-transition");
  if (existing) return existing;

  const layer = document.createElement("div");
  layer.className = "pixel-transition";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `
    <canvas class="pixel-transition-canvas"></canvas>
    <div class="pixel-transition-progress">
      <div class="pixel-transition-percent">1%</div>
      <div class="pixel-transition-bar"><span></span></div>
    </div>
  `;

  document.body.appendChild(layer);
  return layer;
};

const drawTransitionPixels = (context, width, height, progress, time, pixelColor = "#9f63ff") => {
  const grid = window.innerWidth <= 768 ? 13 : 15;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.hypot(centerX, centerY);
  const maxEdgeDistance = Math.min(width, height) / 2;
  const revealDistance = maxEdgeDistance * progress;
  const softEdge = grid * 13;
  const safeCenter = Math.min(width, height) * 0.1;

  context.clearRect(0, 0, width, height);
  context.fillStyle = pixelColor;
  context.shadowColor = pixelColor === "#9f63ff" ? "rgba(159, 99, 255, 0.34)" : "rgba(10, 10, 10, 0.18)";

  for (let y = 0; y < height + grid; y += grid) {
    for (let x = 0; x < width + grid; x += grid) {
      const edgeDistance = Math.min(x, y, width - x, height - y);
      const angle = Math.atan2(y - centerY, x - centerX);
      const rawDistance = Math.hypot(x - centerX, y - centerY);
      const radius = rawDistance / maxRadius;
      const noise = seededNoise(x / grid, y / grid);
      const cloudA = Math.sin(x * 0.008 + Math.cos(y * 0.003) * 2.1 + time * 0.48);
      const cloudB = Math.cos(y * 0.011 - Math.sin(x * 0.004) * 1.8 - time * 0.4);
      const cloudC = Math.sin((x + y) * 0.0058 + Math.sin(angle * 2 + time) * 1.6);
      const cloud = cloudA + cloudB + cloudC + noise * 1.15;
      const edgeBias = 0.9 + clampValue(edgeDistance / maxEdgeDistance, 0, 1) * 0.5;
      const inPatch = cloud > edgeBias;
      const spin = Math.sin(angle * 3 + radius * 10.5 - time * 2.1);
      const ripple = Math.sin(radius * 27 - time * 4.4 + angle * 1.35);
      const stagger = (noise - 0.5) * softEdge + spin * grid * 5.4 + ripple * grid * 2.1;
      const wave = clampValue((revealDistance + stagger - edgeDistance) / softEdge, 0, 1);
      const nearWave = clampValue(1 - Math.abs(edgeDistance - revealDistance - stagger) / softEdge, 0, 1);
      const keepCenterClean = rawDistance > safeCenter || progress > 0.88;

      if (inPatch && wave > 0.025 && keepCenterClean) {
        const pulse = 0.5 + Math.sin(time * 3.2 + radius * 19 + angle * 2.2 + noise * 6) * 0.5;
        const glow = nearWave * (0.45 + pulse * 0.55);
        const pixelSize = Math.max(2, Math.floor(grid * (0.18 + glow * 0.11)));
        context.shadowBlur = glow > 0.68 ? 2 : 0;
        context.globalAlpha = clampValue(0.16 + wave * 0.28 + glow * 0.26 + pulse * 0.08, 0.14, 0.74);
        context.fillRect(
          Math.round(x + (grid - pixelSize) / 2),
          Math.round(y + (grid - pixelSize) / 2),
          pixelSize,
          pixelSize
        );
      }
    }
  }

  context.globalAlpha = 1;
  context.shadowBlur = 0;
};

const animatePixelTransition = (layer, direction, onDone, theme = "dark") => {
  const canvas = layer.querySelector(".pixel-transition-canvas");
  const context = canvas.getContext("2d", { alpha: true });
  const percent = layer.querySelector(".pixel-transition-percent");
  const bar = layer.querySelector(".pixel-transition-bar span");
  if (!context) {
    onDone?.();
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const duration = direction === "cover" ? 780 : 110;
  const started = performance.now();
  const isLight = theme !== "black" && theme !== "black-violet";
  layer.classList.add("is-active");
  layer.dataset.palette = theme;
  layer.classList.toggle("is-light", isLight);
  layer.classList.toggle("is-covering", direction === "cover");
  layer.classList.toggle("is-revealing", direction === "reveal");
  layer.style.setProperty("--transition-bg-opacity", direction === "cover" ? "1" : "0");

  const frame = (now) => {
    const elapsed = now - started;
    const raw = clampValue(elapsed / duration, 0, 1);
    const eased = easeInOutCubicValue(raw);
    const progress = direction === "cover" ? eased : 1 - eased;
    const backgroundOpacity = direction === "cover" ? 1 : 1 - eased;
    const progressValue = direction === "cover" ? Math.max(1, Math.round(eased * 100)) : 100;
    layer.style.setProperty("--transition-bg-opacity", backgroundOpacity.toFixed(3));
    if (percent) percent.textContent = `${progressValue}%`;
    if (bar) bar.style.setProperty("--load-progress", `${progressValue}%`);
    drawTransitionPixels(context, width, height, progress, elapsed * 0.0046, getPixelColorForPalette(theme));

    if (raw < 1) {
      window.requestAnimationFrame(frame);
      return;
    }

    if (direction === "reveal") {
      layer.classList.remove("is-active", "is-revealing");
      layer.style.setProperty("--transition-bg-opacity", "0");
      context.clearRect(0, 0, width, height);
    }
    onDone?.();
  };

  window.requestAnimationFrame(frame);
};

const revealPage = () => {
  const layer = createPixelTransition();
  if (!layer) return;
  const transitionPalette = getStoredTransitionPalette() || getTransitionPaletteForPage(getPageName(window.location.href));
  animatePixelTransition(layer, "reveal", () => {
    clearStoredTransitionPalette();
  }, transitionPalette);
};

const coverPage = (href, theme = "dark") => {
  const layer = createPixelTransition();
  if (!layer) {
    window.location.href = href;
    return;
  }
  animatePixelTransition(layer, "cover", () => {
    window.location.href = href;
  }, theme);
};

const setupPageTransitions = () => {
  if (!pageTransitionsEnabled || prefersReducedMotion.matches) return;
  let isTransitioning = false;
  let lastHandledAt = 0;

  const handleNavigation = (event, force = false) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (force && !link.closest(".desktop-nav, .menu-panel nav, .footer-nav")) return;
    const now = performance.now();
    if (!force && now - lastHandledAt < 450) return;
    if (isTransitioning) {
      event.preventDefault();
      return;
    }

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const target = new URL(href, window.location.href);
    if (target.href === window.location.href) {
      event.preventDefault();
      const menuShell = document.querySelector(".menu-shell");
      const menuButton = document.querySelector(".menu-button");
      menuShell?.classList.remove("is-open");
      menuShell?.setAttribute("aria-hidden", "true");
      menuButton?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      return;
    }
    if (target.protocol !== window.location.protocol) return;
    if (target.protocol !== "file:" && target.origin !== window.location.origin) return;

    const pageName = getPageName(target.href);
    if (!internalPages.has(pageName)) return;

    event.preventDefault();
    isTransitioning = true;
    const menuShell = document.querySelector(".menu-shell");
    const menuButton = document.querySelector(".menu-button");
    menuShell?.classList.remove("is-open");
    menuShell?.setAttribute("aria-hidden", "true");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    lastHandledAt = now;
    const transitionPalette = getTransitionPaletteForPage(pageName);
    setStoredTransitionPalette(transitionPalette);
    coverPage(target.href, transitionPalette);
  };

  document.addEventListener("pointerup", (event) => handleNavigation(event, true), true);
  document.addEventListener("click", (event) => handleNavigation(event), true);
};

const setupLoader = () => {
  if (prefersReducedMotion.matches || getPageName(window.location.href) !== "index.html" || hasSeenHomeLoader()) return;

  const loader = document.createElement("div");
  loader.className = "site-loader";
  loader.innerHTML = `
    <canvas class="loader-canvas" aria-hidden="true"></canvas>
    <div class="loader-content" aria-live="polite">
      <div class="loader-percent">1%</div>
      <div class="loader-bar"><span></span></div>
    </div>
  `;
  document.body.appendChild(loader);
  document.documentElement.style.overflow = "hidden";

  const canvas = loader.querySelector(".loader-canvas");
  const context = canvas.getContext("2d", { alpha: true });
  const percent = loader.querySelector(".loader-percent");
  const bar = loader.querySelector(".loader-bar span");

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frameId = 0;
  const gridSize = 13;
  const pixelColor = getPixelColorForPalette(getCurrentPalette());
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const easeInOutCubic = (value) => value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
  const randomAt = (x, y) => {
    const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  const resizeLoaderCanvas = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  let progress = 1;
  let targetProgress = 1;
  const started = performance.now();
  const minimumDuration = 3000;
  const resources = [
    ...document.images,
  ].filter(Boolean);
  const totalResources = Math.max(resources.length + 1, 1);
  let completedResources = 0;

  const markResourceDone = () => {
    completedResources += 1;
    targetProgress = Math.max(targetProgress, Math.min(99, Math.round((completedResources / totalResources) * 100)));
  };

  resources.forEach((resource) => {
    let doneAlready = false;
    const done = () => {
      if (doneAlready) return;
      doneAlready = true;
      markResourceDone();
    };

    if (resource.tagName === "IMG" && resource.complete) {
      done();
      return;
    }
    if (resource.tagName === "VIDEO" && resource.readyState >= 2) {
      done();
      return;
    }

    resource.addEventListener("load", done, { once: true });
    resource.addEventListener("loadeddata", done, { once: true });
    resource.addEventListener("error", done, { once: true });
  });

  const drawLoader = (now) => {
    context.clearRect(0, 0, width, height);

    const elapsed = now - started;
    const intro = easeInOutCubic(clamp(elapsed / minimumDuration, 0, 1));
    const grid = window.innerWidth <= 768 ? 11 : gridSize;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.hypot(centerX, centerY);
    const maxEdgeDistance = Math.min(width, height) / 2;
    const revealDistance = maxEdgeDistance * intro;
    const softEdge = grid * 12;
    const time = elapsed * 0.0022;
    const safeCenter = Math.min(width, height) * 0.13;

    context.fillStyle = pixelColor;
    context.shadowColor = "rgba(159, 99, 255, 0.42)";

    for (let y = 0; y < height + grid; y += grid) {
      for (let x = 0; x < width + grid; x += grid) {
        const edgeDistance = Math.min(x, y, width - x, height - y);
        const noise = randomAt(x / grid, y / grid);
        const angle = Math.atan2(y - centerY, x - centerX);
        const rawDistance = Math.hypot(x - centerX, y - centerY);
        const radius = rawDistance / maxRadius;
        const cloudA = Math.sin(x * 0.0085 + Math.cos(y * 0.003) * 2.4 + time * 0.42);
        const cloudB = Math.cos(y * 0.0105 - Math.sin(x * 0.004) * 2.1 - time * 0.34);
        const cloudC = Math.sin((x + y) * 0.006 + Math.sin(angle * 2.2 + time) * 1.8);
        const cloud = cloudA + cloudB + cloudC + noise * 1.2;
        const edgeBias = 0.64 + clamp(edgeDistance / maxEdgeDistance, 0, 1) * 0.38;
        const inPatch = cloud > edgeBias;
        const spin = Math.sin(angle * 3.1 + radius * 11 - time * 2.2);
        const ripple = Math.sin(radius * 30 - time * 4.8 + angle * 1.4);
        const stagger = (noise - 0.5) * softEdge + spin * grid * 5 + ripple * grid * 2.2;
        const wave = clamp((revealDistance + stagger - edgeDistance) / softEdge, 0, 1);
        const nearWave = clamp(1 - Math.abs(edgeDistance - revealDistance - stagger) / softEdge, 0, 1);
        const keepCenterClean = rawDistance > safeCenter || intro > 0.86;

        if (inPatch && wave > 0.02 && keepCenterClean) {
          const pulse = 0.5 + Math.sin(time * 3 + radius * 20 + angle * 2.4 + noise * 6) * 0.5;
          const glow = nearWave * (0.45 + pulse * 0.55);
          const pixelSize = Math.max(2, Math.floor(grid * (0.2 + glow * 0.12)));
          context.shadowBlur = glow > 0.62 ? 5 : 0;
          context.globalAlpha = clamp(0.12 + wave * 0.35 + glow * 0.38 + pulse * 0.12, 0.1, 0.86);
          context.fillRect(
            Math.round(x + (grid - pixelSize) / 2),
            Math.round(y + (grid - pixelSize) / 2),
            pixelSize,
            pixelSize
          );
        }
      }
    }

    context.globalAlpha = 1;
    context.shadowBlur = 0;

    frameId = window.requestAnimationFrame(drawLoader);
  };

  if (context) {
    resizeLoaderCanvas();
    window.addEventListener("resize", resizeLoaderCanvas);
    frameId = window.requestAnimationFrame(drawLoader);
  }

  const tick = () => {
    const elapsed = performance.now() - started;
    const loadReady = document.readyState === "complete";
    const timedProgress = Math.min(100, 1 + Math.floor((elapsed / minimumDuration) * 99));
    const measuredProgress = loadReady ? 100 : Math.max(targetProgress, Math.min(92, timedProgress));
    const nextTarget = elapsed >= minimumDuration && loadReady ? 100 : Math.min(timedProgress, measuredProgress);
    if (nextTarget > progress) {
      progress = Math.min(100, Math.round(progress + Math.max(1, (nextTarget - progress) * 0.12)));
    }
    if (elapsed >= minimumDuration && loadReady) {
      progress = 100;
    }
    percent.textContent = `${progress}%`;
    bar.style.setProperty("--load-progress", `${progress}%`);

    if (progress >= 100 && elapsed >= minimumDuration && loadReady) {
      markHomeLoaderSeen();
      loader.classList.add("is-hidden");
      document.documentElement.style.overflow = "";
      window.setTimeout(() => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resizeLoaderCanvas);
        loader.remove();
      }, 340);
      return;
    }

    window.requestAnimationFrame(tick);
  };

  if (document.readyState === "complete") {
    window.requestAnimationFrame(tick);
  } else {
    window.addEventListener("load", () => {
      completedResources = totalResources;
      targetProgress = 100;
    }, { once: true });
    window.requestAnimationFrame(tick);
  }
};

const randomLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const setupMenuScramble = () => {
  if (prefersReducedMotion.matches || window.matchMedia("(hover: none), (max-width: 700px)").matches) return;

  document.querySelectorAll(".desktop-nav a, .menu-panel nav a").forEach((link) => {
    const original = link.textContent.trim();
    link.dataset.label = original;

    link.addEventListener("mouseenter", () => {
      if (link.dataset.scrambling === "true") return;
      link.dataset.scrambling = "true";
      let frame = 0;
      const totalFrames = 9;
      const letters = [...original];
      const mutableIndexes = letters
        .map((char, index) => (/^[A-Za-z]$/.test(char) ? index : null))
        .filter((index) => index !== null)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(5, Math.max(4, Math.floor(original.replaceAll(" ", "").length * 0.45))));

      const interval = window.setInterval(() => {
        const activeCount = frame < totalFrames - 3 ? mutableIndexes.length : Math.max(0, mutableIndexes.length - (frame - totalFrames + 3) * 2);
        const activeIndexes = new Set(mutableIndexes.slice(0, activeCount));
        const next = letters.map((char, index) => {
          if (char === " ") return " ";
          if (!activeIndexes.has(index)) return char;
          return randomLetters[Math.floor(Math.random() * randomLetters.length)];
        }).join("");

        link.innerHTML = [...next].map((char, index) => {
          const isActive = activeIndexes.has(index);
          const lift = isActive ? Math.sin(frame + index) * 1.2 : 0;
          const weight = isActive ? 600 : 500;
          return `<span class="scramble-char" style="transform:translateY(${lift}px);font-weight:${weight}">${char}</span>`;
        }).join("");

        frame += 1;
        if (frame > totalFrames) {
          window.clearInterval(interval);
          link.textContent = original;
          link.dataset.scrambling = "false";
        }
      }, 50);
    });
  });
};

setupPaletteSwitcher();
setupLoader();
if (getStoredTransitionPalette()) {
  window.requestAnimationFrame(revealPage);
}
setupPageTransitions();
setupMenuScramble();
