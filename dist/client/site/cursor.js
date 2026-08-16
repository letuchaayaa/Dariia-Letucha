const cursor = document.createElement("span");
cursor.className = "custom-cursor";
document.body.appendChild(cursor);

const interactiveSelector = "a, button, input, textarea, label, .project-card, .service-card";
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;
let hovering = false;

window.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse") return;
  targetX = event.clientX;
  targetY = event.clientY;
  hovering = Boolean(event.target.closest(interactiveSelector));
  cursor.classList.add("is-visible");
  cursor.classList.toggle("is-hovering", hovering);
});

window.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));

const renderCursor = () => {
  currentX += (targetX - currentX) * 0.24;
  currentY += (targetY - currentY) * 0.24;
  cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${hovering ? 1.85 : 1})`;
  requestAnimationFrame(renderCursor);
};

renderCursor();
