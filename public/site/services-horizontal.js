(() => {
  const section = document.querySelector("[data-horizontal-text]");
  const text = document.querySelector("[data-horizontal-line]");
  if (!section || !text) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let current = 0;
  let target = 0;
  let maxShift = 0;
  let chars = [];

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const random = (min, max) => min + Math.random() * (max - min);

  const splitText = () => {
    const words = text.textContent.trim().split(/\s+/);
    text.textContent = "";

    words.forEach((word, wordIndex) => {
      const wordElement = document.createElement("span");
      wordElement.className = "horizontal-word";
      const fullWord = wordIndex === words.length - 1 ? word : `${word} `;

      [...fullWord].forEach((letter) => {
        const char = document.createElement("span");
        char.className = "horizontal-char";
        char.textContent = letter;
        char.dataset.y = random(-190, 190).toFixed(2);
        char.dataset.r = random(-20, 20).toFixed(2);
        wordElement.append(char);
      });

      text.append(wordElement);
    });

    chars = [...text.querySelectorAll(".horizontal-char")];
  };

  const measure = () => {
    const textWidth = text.scrollWidth;
    maxShift = Math.max(textWidth + window.innerWidth * 0.12, 1);
  };

  const getProgress = () => {
    const bounds = section.getBoundingClientRect();
    const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
    return clamp(-bounds.top / distance);
  };

  const updateChars = () => {
    const viewport = Math.max(window.innerWidth, 1);

    chars.forEach((char) => {
      const rect = char.getBoundingClientRect();
      const enter = clamp((viewport - rect.left) / (viewport * 0.52));
      const ease = 1 - Math.pow(1 - enter, 3);
      const y = Number(char.dataset.y) * (1 - ease);
      const rotation = Number(char.dataset.r) * (1 - ease);

      char.style.setProperty("--char-y", `${y.toFixed(2)}%`);
      char.style.setProperty("--char-r", `${rotation.toFixed(2)}deg`);
    });
  };

  const render = () => {
    target = getProgress();
    current += (target - current) * 0.18;
    text.style.transform = `translate3d(${-current * maxShift}px, 0, 0)`;
    updateChars();
    frame = requestAnimationFrame(render);
  };

  const start = () => {
    cancelAnimationFrame(frame);
    measure();

    if (reducedMotion.matches) {
      text.style.transform = "translate3d(0, 0, 0)";
      chars.forEach((char) => {
        char.style.setProperty("--char-y", "0%");
        char.style.setProperty("--char-r", "0deg");
      });
      return;
    }

    frame = requestAnimationFrame(render);
  };

  splitText();
  start();

  window.addEventListener("resize", start, { passive: true });
  reducedMotion.addEventListener("change", start);
  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", start);
    reducedMotion.removeEventListener("change", start);
  });
})();
