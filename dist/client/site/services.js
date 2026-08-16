const accordion = document.querySelector("[data-accordion]");
const scopeSection = document.querySelector(".scope-section");
const contactSection = document.querySelector(".services-contact");
const leadersSection = document.querySelector(".leaders-section");
const horizontalSection = document.querySelector("[data-horizontal-text]");
const siteHeader = document.querySelector(".site-header");

if (accordion) {
  const items = [...accordion.querySelectorAll(".scope-item")];

  items.forEach((item) => {
    const button = item.querySelector("button");

    button.addEventListener("click", () => {
      items.forEach((candidate) => {
        const isCurrent = candidate === item;
        candidate.classList.toggle("is-open", isCurrent);
        candidate.querySelector("button").setAttribute("aria-expanded", String(isCurrent));
      });
    });
  });
}

if (scopeSection) {
  const scopeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scopeSection.classList.add("scope-in-view");
        }
      });
    },
    { threshold: 0.22 },
  );

  scopeObserver.observe(scopeSection);
}

if (contactSection) {
  const contactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          contactSection.classList.add("in-view");
        }
      });
    },
    { threshold: 0.3 },
  );

  contactObserver.observe(contactSection);
}

if (leadersSection) {
  const thresholds = [0.62, 0.67, 0.72, 0.77, 0.82, 0.86, 0.9, 0.94];

  const updateLeadersProgress = () => {
    const rect = leadersSection.getBoundingClientRect();
    const scrollable = Math.max(rect.height - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);

    leadersSection.classList.toggle("leaders-stage-panel", progress > 0.12);
    leadersSection.classList.toggle("leaders-stage-photo", progress > 0.48);
    leadersSection.classList.toggle("leaders-stage-title", progress > 0.54);

    thresholds.forEach((threshold, index) => {
      leadersSection.classList.toggle(`leaders-badge-${index + 1}`, progress > threshold);
    });
  };

  updateLeadersProgress();
  window.addEventListener("scroll", updateLeadersProgress, { passive: true });
  window.addEventListener("resize", updateLeadersProgress);
}

if (horizontalSection && siteHeader) {
  const updateHeaderVisibility = () => {
    const rect = horizontalSection.getBoundingClientRect();
    siteHeader.classList.toggle("services-header-hidden", rect.bottom <= 0);
  };

  updateHeaderVisibility();
  window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
  window.addEventListener("resize", updateHeaderVisibility);
}
