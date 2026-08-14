const menuButton = document.querySelector(".menu-button");
const menuShell = document.querySelector(".menu-shell");
const menuBackdrop = document.querySelector(".menu-backdrop");
const menuClose = document.querySelector(".menu-close");
const menuLinks = document.querySelectorAll(".menu-panel a");
const stage = document.querySelector(".sticker-stage");
const cover = document.querySelector(".cover");

const setMenu = (open) => {
  menuShell.classList.toggle("is-open", open);
  menuShell.setAttribute("aria-hidden", String(!open));
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
};

const toggleMenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  setMenu(!menuShell.classList.contains("is-open"));
};

menuButton.addEventListener("pointerdown", toggleMenu);
menuButton.addEventListener("click", (event) => event.preventDefault());
menuButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") toggleMenu(event);
});

menuBackdrop.addEventListener("click", () => setMenu(false));
menuClose.addEventListener("click", () => setMenu(false));
menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const stickerSets = {
  black: [
    "assets/sticker-purple-can.png",
    "assets/sticker-purple-smile.png",
    "assets/sticker-purple-film.png",
    "assets/sticker-purple-hand.png",
  ],
  white: [
    "assets/sticker-purple-can.png",
    "assets/sticker-purple-smile.png",
    "assets/sticker-purple-film.png",
    "assets/sticker-purple-hand.png",
  ],
  grey: [
    "assets/sticker-purple-can.png",
    "assets/sticker-purple-smile.png",
    "assets/sticker-purple-film.png",
    "assets/sticker-purple-hand.png",
  ],
  blue: [
    "assets/theme-blue/sticker-can.png",
    "assets/theme-blue/sticker-smile.png",
    "assets/theme-blue/sticker-film.png",
    "assets/theme-blue/sticker-hand.png",
  ],
};

const getStickerPalette = () => document.body.dataset.palette || "black";
const getCurrentStickers = () => stickerSets[getStickerPalette()] || stickerSets.black;

[...new Set(Object.values(stickerSets).flat())].forEach((source) => {
  const image = new Image();
  image.decoding = "async";
  image.src = source;
  image.decode().catch(() => {});
});

requestAnimationFrame(() => {
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
});

let lastSticker = 0;
let stickerIndex = 0;

const isBlankSpace = (target) => !target.closest(".no-stickers, a, button, img");

const isInProtectedZone = (event) => {
  const protectedElements = document.querySelectorAll(".site-header, .hero, .facts, .role");
  return [...protectedElements].some((element) => {
    const rect = element.getBoundingClientRect();
    const padding = 72;
    return (
      event.clientX >= rect.left - padding &&
      event.clientX <= rect.right + padding &&
      event.clientY >= rect.top - padding &&
      event.clientY <= rect.bottom + padding
    );
  });
};

cover.addEventListener("pointermove", (event) => {
  if (
    event.pointerType !== "mouse" ||
    window.innerWidth <= 700 ||
    !isBlankSpace(event.target) ||
    isInProtectedZone(event)
  ) return;

  const now = performance.now();
  if (now - lastSticker < 140) return;
  lastSticker = now;

  const bounds = cover.getBoundingClientRect();
  const sticker = document.createElement("img");
  const currentStickers = getCurrentStickers();
  const jitterX = (Math.random() - 0.5) * 12;
  const jitterY = (Math.random() - 0.5) * 12;

  sticker.className = "cursor-sticker";
  sticker.src = currentStickers[stickerIndex % currentStickers.length];
  sticker.alt = "";
  sticker.decoding = "async";
  sticker.style.left = `${event.clientX - bounds.left + jitterX}px`;
  sticker.style.top = `${event.clientY - bounds.top + jitterY}px`;
  sticker.style.setProperty("--size", `${56 + Math.random() * 22}px`);
  sticker.style.setProperty("--angle", `${-10 + Math.random() * 20}deg`);
  stage.appendChild(sticker);

  if (stage.childElementCount > 12) {
    stage.firstElementChild.remove();
  }

  stickerIndex += 1;
  sticker.addEventListener("animationend", () => sticker.remove(), { once: true });
});
