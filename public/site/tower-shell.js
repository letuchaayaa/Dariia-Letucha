const towerMenuButton = document.querySelector(".tower-menu-button");
const towerMenuShell = document.querySelector(".tower-menu-shell");
const towerMenuBackdrop = document.querySelector(".tower-menu-backdrop");
const towerMenuClose = document.querySelector(".tower-menu-close");
const towerMenuLinks = document.querySelectorAll(".tower-mobile-nav a");

const setTowerMenu = (open) => {
  if (!towerMenuButton || !towerMenuShell) return;
  towerMenuShell.classList.toggle("is-open", open);
  towerMenuShell.setAttribute("aria-hidden", String(!open));
  towerMenuButton.setAttribute("aria-expanded", String(open));
};

towerMenuButton?.addEventListener("click", () => setTowerMenu(true));
towerMenuBackdrop?.addEventListener("click", () => setTowerMenu(false));
towerMenuClose?.addEventListener("click", () => setTowerMenu(false));
towerMenuLinks.forEach((link) => link.addEventListener("click", () => setTowerMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setTowerMenu(false);
});
