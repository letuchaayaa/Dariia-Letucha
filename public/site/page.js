const menuButton = document.querySelector(".menu-button");
const menuShell = document.querySelector(".menu-shell");
const menuBackdrop = document.querySelector(".menu-backdrop");
const menuClose = document.querySelector(".menu-close");
const menuLinks = document.querySelectorAll(".menu-panel a");

const setMenu = (open) => {
  if (!menuShell || !menuButton) return;
  menuShell.classList.toggle("is-open", open);
  menuShell.setAttribute("aria-hidden", String(!open));
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
};

const toggleMenu = (event) => {
  event?.preventDefault();
  event?.stopPropagation();
  setMenu(!menuShell?.classList.contains("is-open"));
};

menuButton?.addEventListener("pointerdown", toggleMenu);
menuButton?.addEventListener("click", (event) => event.preventDefault());
menuButton?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") toggleMenu(event);
});
menuBackdrop?.addEventListener("click", () => setMenu(false));
menuClose?.addEventListener("click", () => setMenu(false));
menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
