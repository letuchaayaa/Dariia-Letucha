const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const sceneProgress = (element) => clamp((window.scrollY - element.offsetTop) / Math.max(1, element.offsetHeight - window.innerHeight));
const range = (value, start, end) => clamp((value - start) / (end - start));

const menuButtons = [...document.querySelectorAll('.a2-menu-button, .floating-menu-button')];
const menuShell = document.querySelector('.a2-menu-shell');
const setMenu = (open) => {
  menuShell?.classList.toggle('is-open', open);
  menuShell?.setAttribute('aria-hidden', String(!open));
  menuButtons.forEach((button) => button.setAttribute('aria-expanded', String(open)));
  document.body.classList.toggle('menu-open', open);
};
menuButtons.forEach((button) => button.addEventListener('click', () => setMenu(true)));
document.querySelector('.a2-menu-backdrop')?.addEventListener('click', () => setMenu(false));
document.querySelector('.a2-menu-close')?.addEventListener('click', () => setMenu(false));
document.querySelectorAll('.a2-menu-panel a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const revealHeading = document.querySelector('[data-reveal-text]');
const typingHeading = document.querySelector('[data-type-text]');

if (typingHeading) {
  const copy = typingHeading.dataset.typeText || '';
  let character = 0;
  let started = false;
  const typeNext = () => {
    const value = copy[character];
    if (value === '|') {
      typingHeading.append(document.createElement('br'));
    } else if (/[,.!?;:]/.test(value)) {
      const punctuation = document.createElement('span');
      punctuation.className = 'intro-punctuation';
      punctuation.textContent = value;
      typingHeading.append(punctuation);
    } else {
      typingHeading.append(document.createTextNode(value));
    }
    character += 1;
    if (character < copy.length) window.setTimeout(typeNext, character % 9 === 0 ? 26 : 13);
  };
  const startTyping = () => {
    if (started) return;
    started = true;
    window.setTimeout(typeNext, 180);
  };
  const typingObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      startTyping();
      typingObserver.disconnect();
    }
  }, { rootMargin: '40% 0px' });
  typingObserver.observe(typingHeading);
}

const intro = document.querySelector('[data-scroll-scene="intro"]');
const bio = document.querySelector('[data-scroll-scene="bio"]');
const projects = document.querySelector('[data-scroll-scene="projects"]');
const disciplines = document.querySelector('[data-scroll-scene="disciplines"]');
const introTitle = document.querySelector('.intro-title');
const introOrbits = document.querySelector('.intro-orbits');
const introPhoto = document.querySelector('.intro-photo');
const revealLinesDesktop = [...document.querySelectorAll('[data-reveal-line]')];
const revealLinesMobile = [...document.querySelectorAll('[data-reveal-line-mobile]')];
const projectTrack = document.querySelector('.projects-track');
const projectPanels = [...document.querySelectorAll('.project-card, .process-card')];
const projectMedia = [...document.querySelectorAll('.project-placeholder')];
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
    document.body.classList.toggle('intro-finished', p > .68);
    const fadeOut = range(p, .58, .86);
    [introTitle, introOrbits].forEach((element) => {
      if (!element) return;
      if (fadeOut > 0) {
        element.style.opacity = String(1 - fadeOut);
        element.style.transform = element === introTitle
          ? `translate(calc(-50% - ${fadeOut * 34}px), -50%)`
          : `translateX(${-fadeOut * 34}px)`;
      } else {
        element.style.removeProperty('opacity');
        element.style.removeProperty('transform');
      }
    });
    if (introPhoto) {
      if (fadeOut > 0) {
        introPhoto.style.setProperty('opacity', String(1 - fadeOut), 'important');
        introPhoto.style.setProperty('transform', `translateY(${-fadeOut * 18}px)`, 'important');
      } else {
        introPhoto.style.removeProperty('opacity');
        introPhoto.style.removeProperty('transform');
      }
    }
  }
  if (bio && revealHeading) {
    const p = sceneProgress(bio);
    const mobileCopy = window.innerWidth <= 1180;
    const activeLines = mobileCopy ? revealLinesMobile : revealLinesDesktop;
    const inactiveLines = mobileCopy ? revealLinesDesktop : revealLinesMobile;
    inactiveLines.forEach((line) => line.style.setProperty('--line-fill', '0%'));
    activeLines.forEach((line, index) => {
      const step = mobileCopy ? .17 : .12;
      const duration = mobileCopy ? .135 : .18;
      const start = .05 + index * step;
      line.style.setProperty('--line-fill', `${Math.round(range(p, start, start + duration) * 108)}%`);
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
    projectMedia.forEach((media) => {
      const rect = media.getBoundingClientRect();
      const offset = clamp((rect.left + rect.width / 2 - window.innerWidth / 2) / window.innerWidth, -1, 1);
      const visible = clamp(1 - Math.abs(offset) * 1.35);
      const image = media.querySelector('img');
      media.style.opacity = String(.3 + visible * .7);
      if (image) image.style.transform = `translate3d(${-offset * 28}px,0,0) scale(1.08)`;
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
    const mobileViewport = window.innerWidth <= 700;
    const viewportScale = mobileViewport ? .68 : window.innerWidth <= 1180 ? .82 : 1;
    const leaderScale = mobileViewport
      ? 1 + range(p, .78, .85) * .2
      : 1 - range(p, .78, .85) * .5;
    helmetFrame.style.opacity = String(drop);
    helmetFrame.style.transform = `translateY(${(1 - drop) * -42}vh) scale(${(.92 + drop * .08) * viewportScale * leaderScale})`;
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
      const compact = window.innerWidth <= 700;
      const fromY = compact ? -125 - index * 12 : index % 2 === 0 ? -115 : 115;
      const fromX = compact ? 0 : 42;
      card.style.opacity = String(range(arrival, .05, .55) * (1 - range(exit, .76, 1)));
      card.style.transform = `translate3d(${(1 - easedArrival) * fromX - easedExit * 140}vw, ${(1 - easedArrival) * fromY}vh, 0)`;
    });
    if (leadersStage) leadersStage.style.opacity = String(range(p, mobileViewport ? .78 : .79, mobileViewport ? .8 : .84));
    leaderLogos.forEach((logo, index) => {
      const start = mobileViewport ? .8 + index * .025 : .83 + index * .019;
      const arrival = range(p, start, start + (mobileViewport ? .018 : .02));
      const easedArrival = 1 - Math.pow(1 - arrival, 3);
      logo.style.opacity = String(arrival);
      logo.style.transform = `translateY(${(1 - easedArrival) * 44}px) scale(${.72 + easedArrival * .28})`;
    });
    document.body.classList.toggle('helmet-active', p > .18);
    document.body.classList.toggle('sky-active', p > .3);
  } else {
    document.body.classList.remove('helmet-active');
    document.body.classList.remove('sky-active');
  }
};
const requestRender = () => { if (!ticking) { ticking = true; requestAnimationFrame(render); } };
window.addEventListener('scroll', requestRender, { passive: true });
window.addEventListener('resize', requestRender);
render();
