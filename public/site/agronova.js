const caseTrack = document.querySelector(".case-track");
let caseOffset = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateCaseTrack = () => {
  if (!caseTrack) return;
  const maxOffset = Math.max(0, caseTrack.scrollWidth - window.innerWidth + 58);
  caseOffset = clamp(caseOffset, 0, maxOffset);
  caseTrack.style.transform = `translate3d(${-caseOffset}px, 0, 0)`;
};

window.addEventListener(
  "wheel",
  (event) => {
    if (!caseTrack) return;
    event.preventDefault();
    caseOffset += event.deltaY * 0.95;
    updateCaseTrack();
  },
  { passive: false },
);

window.addEventListener("resize", updateCaseTrack);
updateCaseTrack();
