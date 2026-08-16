const stack = document.querySelector(".project-stack");
const cards = [...document.querySelectorAll(".project-card")];

const desktopSlots = [
  { y: 0, s: 1, opacity: 1 },
  { y: -118, s: 0.58, opacity: 0.98 },
  { y: -166, s: 0.48, opacity: 0.88 },
  { y: -210, s: 0.39, opacity: 0.76 },
  { y: -250, s: 0.32, opacity: 0.6 },
  { y: 118, s: 0.58, opacity: 0.98 },
  { y: 166, s: 0.48, opacity: 0.88 },
  { y: 210, s: 0.39, opacity: 0.76 },
  { y: 250, s: 0.32, opacity: 0.6 },
  { y: 288, s: 0.26, opacity: 0 },
];

const mobileSlots = [
  { y: 0, s: 1, opacity: 1 },
  { y: -68, s: 0.58, opacity: 0.96 },
  { y: -98, s: 0.48, opacity: 0.84 },
  { y: -126, s: 0.39, opacity: 0.68 },
  { y: -152, s: 0.32, opacity: 0.52 },
  { y: 68, s: 0.58, opacity: 0.96 },
  { y: 98, s: 0.48, opacity: 0.84 },
  { y: 126, s: 0.39, opacity: 0.68 },
  { y: 152, s: 0.32, opacity: 0.52 },
  { y: 178, s: 0.26, opacity: 0 },
];

const tabletSlots = [
  { y: 0, s: 1, opacity: 1 },
  { y: -104, s: 0.62, opacity: 0.96 },
  { y: -146, s: 0.5, opacity: 0.82 },
  { y: -184, s: 0.4, opacity: 0.66 },
  { y: -218, s: 0.32, opacity: 0.5 },
  { y: 104, s: 0.62, opacity: 0.96 },
  { y: 146, s: 0.5, opacity: 0.82 },
  { y: 184, s: 0.4, opacity: 0.66 },
  { y: 218, s: 0.32, opacity: 0.5 },
  { y: 252, s: 0.26, opacity: 0 },
];

let active = 0;
let wheelLock = false;
let wheelRemainder = 0;
let wheelResetTimer = 0;

const renderStack = () => {
  const slots = window.innerWidth <= 700 ? mobileSlots : window.innerWidth <= 1180 ? tabletSlots : desktopSlots;

  cards.forEach((card, index) => {
    const slotIndex = (index - active + cards.length) % cards.length;
    const slot = slots[slotIndex] || slots[slots.length - 1];

    card.classList.toggle("is-front", slotIndex === 0);
    card.style.zIndex = String(100 - slotIndex);
    card.style.setProperty("--x", "0px");
    card.style.setProperty("--y", `${slot.y}px`);
    card.style.setProperty("--s", String(slot.s));
    card.style.setProperty("--card-opacity", String(slot.opacity));
  });
};

const cycle = (direction) => {
  active = (active + direction + cards.length) % cards.length;
  renderStack();
};

stack.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    if (wheelLock) return;

    wheelRemainder += event.deltaY;
    window.clearTimeout(wheelResetTimer);
    wheelResetTimer = window.setTimeout(() => {
      wheelRemainder = 0;
    }, 180);

    const mobile = window.innerWidth <= 700;
    const threshold = mobile ? 70 : 58;
    if (Math.abs(wheelRemainder) < threshold) return;

    const direction = wheelRemainder > 0 ? 1 : -1;
    wheelRemainder = 0;
    wheelLock = true;
    cycle(direction);
    window.setTimeout(() => {
      wheelLock = false;
    }, mobile ? 980 : 620);
  },
  { passive: false },
);

window.addEventListener("resize", renderStack);
renderStack();
