const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const sceneProgress = (element) => clamp((window.scrollY - element.offsetTop) / Math.max(1, element.offsetHeight - window.innerHeight));
const range = (value, start, end) => clamp((value - start) / (end - start));

const menuButton = document.querySelector('.a2-menu-button');
const menuShell = document.querySelector('.a2-menu-shell');
const setMenu = (open) => {
  menuShell?.classList.toggle('is-open', open);
  menuShell?.setAttribute('aria-hidden', String(!open));
  menuButton?.setAttribute('aria-expanded', String(open));
};
menuButton?.addEventListener('click', () => setMenu(true));
document.querySelector('.a2-menu-backdrop')?.addEventListener('click', () => setMenu(false));
document.querySelector('.a2-menu-close')?.addEventListener('click', () => setMenu(false));
document.querySelectorAll('.a2-menu-panel a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const revealHeading = document.querySelector('[data-reveal-text]');

const intro = document.querySelector('[data-scroll-scene="intro"]');
const bio = document.querySelector('[data-scroll-scene="bio"]');
const projects = document.querySelector('[data-scroll-scene="projects"]');
const disciplines = document.querySelector('[data-scroll-scene="disciplines"]');
const introWave = document.querySelector('.intro-wave');
const introPhoto = document.querySelector('.intro-photo');
const revealLines = [...document.querySelectorAll('[data-reveal-line]')];
const projectTrack = document.querySelector('.projects-track');
const projectPanels = [...document.querySelectorAll('.project-card, .process-card')];
const disciplinesContent = document.querySelector('.disciplines-content');
const skyVideo = document.querySelector('.sky-video');
const skyShade = document.querySelector('.sky-shade');
const helmetFrame = document.querySelector('.helmet-frame');
const disciplinesKicker = document.querySelector('.disciplines-content > p');
const scatterWords = [...document.querySelectorAll('[data-scatter-word]')];
const serviceCards = [...document.querySelectorAll('[data-service-card]')];
const leadersStage = document.querySelector('.leaders-stage');
const leaderLogos = [...document.querySelectorAll('[data-leader-logo]')];

scatterWords.forEach((word, wordIndex) => {
  const label = word.textContent.trim();
  word.setAttribute('aria-label', label);
  word.dataset.wordIndex = String(wordIndex);
  word.textContent = '';
  [...label].forEach((character, letterIndex) => {
    const letter = document.createElement('span');
    letter.className = 'scatter-letter';
    letter.setAttribute('aria-hidden', 'true');
    letter.dataset.wordIndex = String(wordIndex);
    letter.dataset.letterIndex = String(letterIndex);
    letter.textContent = character;
    word.append(letter);
  });
});

const scatterLetters = [...document.querySelectorAll('.scatter-letter')];

let ticking = false;
const render = () => {
  ticking = false;
  if (intro) {
    const p = sceneProgress(intro);
    document.body.classList.toggle('intro-finished', p > .7);
    const fadeOut = range(p, .72, .9);
    if (introWave) {
      if (fadeOut > 0) {
        introWave.style.opacity = String(1 - fadeOut);
        introWave.style.transform = `translateX(${-fadeOut * 34}px)`;
      } else {
        introWave.style.removeProperty('opacity');
        introWave.style.removeProperty('transform');
      }
    }
    if (introPhoto) {
      if (fadeOut > 0) {
        introPhoto.style.opacity = String(1 - fadeOut);
        introPhoto.style.transform = `translateY(${-fadeOut * 18}px)`;
      } else {
        introPhoto.style.removeProperty('opacity');
        introPhoto.style.removeProperty('transform');
      }
    }
  }
  if (bio && revealHeading && revealLines.length) {
    const p = sceneProgress(bio);
    revealLines.forEach((line, index) => {
      const start = .06 + index * .12;
      line.style.setProperty('--line-fill', `${Math.round(range(p, start, start + .18) * 108)}%`);
    });
  }
  if (projects && projectTrack) {
    const p = sceneProgress(projects);
    const travel = range(p, 0, .82);
    const eased = travel * travel * (3 - 2 * travel);
    const exit = range(p, .82, 1);
    const exitEased = exit * exit * (3 - 2 * exit);
    const maxX = Math.max(0, projectTrack.scrollWidth - window.innerWidth);
    projectTrack.style.transform = `translate3d(${-eased * maxX - exitEased * window.innerWidth}px,0,0)`;
    projectPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const visible = clamp(1 - Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) / (window.innerWidth * .9));
      panel.style.opacity = String(.35 + visible * .65);
    });
  }
  if (disciplines && helmetFrame && skyVideo) {
    const p = sceneProgress(disciplines);
    if (disciplinesContent) {
      disciplinesContent.style.opacity = '1';
      disciplinesContent.style.transform = 'none';
    }
    const drop = range(p, .18, .23);
    const reveal = range(p, .28, .34);
    helmetFrame.style.opacity = String(drop);
    helmetFrame.style.transform = `translateY(${(1 - drop) * -42}vh) scale(${.92 + drop * .08})`;
    skyVideo.style.opacity = String(reveal);
    skyVideo.style.transform = `scale(${1.08 - reveal * .08})`;
    if (skyShade) skyShade.style.opacity = String(reveal);
    if (disciplinesContent) {
      const textTone = Math.round(10 + reveal * 245);
      disciplinesContent.style.color = `rgb(${textTone}, ${textTone}, ${textTone})`;
    }
    if (disciplinesKicker) disciplinesKicker.style.opacity = String(1 - range(p, .35, .38));
    scatterLetters.forEach((letter, index) => {
      const wordIndex = Number(letter.dataset.wordIndex);
      const letterIndex = Number(letter.dataset.letterIndex);
      const lettersInWord = scatterWords[wordIndex]?.children.length || 1;
      const stagger = (letterIndex / Math.max(1, lettersInWord - 1)) * .03;
      const start = .37 + wordIndex * .045 + stagger;
      const flight = range(p, start, start + .15);
      const direction = index % 2 === 0 ? -1 : 1;
      const x = Math.sin((index + 1) * 1.73) * window.innerWidth * .58 * flight;
      const y = Math.cos((index + 2) * 1.19) * window.innerHeight * .52 * flight - flight * flight * 150;
      const z = (90 + (index % 5) * 42) * flight;
      const rotateX = direction * (78 + (index % 4) * 24) * flight;
      const rotateY = -direction * (110 + (index % 6) * 31) * flight;
      const rotateZ = direction * (22 + (index % 5) * 13) * flight;
      const flatten = Math.max(.035, 1 - flight * .965);
      letter.style.opacity = String(1 - range(flight, .34, 1));
      letter.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scaleY(${flatten})`;
    });
    serviceCards.forEach((card, index) => {
      const start = .58 + index * .035;
      const arrival = range(p, start, start + .04);
      const easedArrival = 1 - Math.pow(1 - arrival, 3);
      const exit = range(p, .75, .8);
      const easedExit = exit * exit * (3 - 2 * exit);
      const fromY = index % 2 === 0 ? -115 : 115;
      const fromX = 42;
      card.style.opacity = String(range(arrival, .05, .55) * (1 - range(exit, .76, 1)));
      card.style.transform = `translate3d(${(1 - easedArrival) * fromX - easedExit * 140}vw, ${(1 - easedArrival) * fromY}vh, 0)`;
    });
    if (leadersStage) leadersStage.style.opacity = String(range(p, .79, .84));
    leaderLogos.forEach((logo, index) => {
      const arrival = range(p, .83 + index * .019, .85 + index * .019);
      const easedArrival = 1 - Math.pow(1 - arrival, 3);
      logo.style.opacity = String(arrival);
      logo.style.transform = `translateY(${(1 - easedArrival) * 44}px) scale(${.72 + easedArrival * .28})`;
    });
    document.body.classList.toggle('helmet-active', p > .18);
  } else {
    document.body.classList.remove('helmet-active');
  }
};
const requestRender = () => { if (!ticking) { ticking = true; requestAnimationFrame(render); } };
window.addEventListener('scroll', requestRender, { passive: true });
window.addEventListener('resize', requestRender);
render();
