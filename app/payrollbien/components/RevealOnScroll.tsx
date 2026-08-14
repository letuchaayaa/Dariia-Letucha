"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      "main > section:not(.hero):not(.about-hero):not(.service-hero):not(.contact-hero):not(.services-pin):not(.principles-pin):not(.team-reveal):not(.team-scroll)",
    ));

    sections.forEach(section => {
      section.classList.add("section-reveal");
      const items = Array.from(section.querySelectorAll<HTMLElement>(
        ":scope > *, .values__grid > *, .service-benefits__grid > *, .service-details__grid > *, .team-page__grid > *, .stats > *",
      ));
      items.forEach((child, index) => {
        if (!(child instanceof HTMLElement) || child.matches("video, [class$='__veil']")) return;
        child.classList.add("section-reveal__item");
        child.style.setProperty("--reveal-delay", `${Math.min(index * 90, 540)}ms`);
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}
