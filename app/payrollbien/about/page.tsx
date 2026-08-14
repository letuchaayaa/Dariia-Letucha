"use client";

import { useEffect, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const principles = [
  {
    title: "We place full emphasis on providing our clients with a quality payroll service.",
    body: "We place full emphasis on providing our clients with a quality payroll service, continually achieving a high minimum core accuracy rate and ensuring the real time and accurate reporting of the payroll services function.",
    image: "/payrollbien-assets/about-quality.png",
    color: "#a9fdfa",
    dark: true,
  },
  {
    title: "We have multiple control measures in place to ensure any possible errors are eradicated ahead of the payroll execution.",
    body: "We have multiple control measures in place to ensure any possible errors are eradicated ahead of the payroll execution.",
    image: "/payrollbien-assets/about-control.png",
    color: "#957cf4",
    dark: false,
  },
  {
    title: "With a bespoke and transparent pricing structure, we never include any hidden costs as part of our onboarding process for clients.",
    body: "With a bespoke and transparent pricing structure, we never include any hidden costs as part of our onboarding process for clients.",
    image: "/payrollbien-assets/about-transparent.png",
    color: "#fed500",
    dark: true,
  },
];

function Mark({ light = false }: { light?: boolean }) {
  return (
    <a className={`mark ${light ? "mark--light" : ""}`} href="/payrollbien/" aria-label="PayrollBien home">
      <img src="/payrollbien-assets/logo.svg" alt="" />
    </a>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`eyebrow eyebrow--logo ${light ? "eyebrow--light" : ""}`}>
      <img src={light ? "/payrollbien-assets/brand-mark-color.svg" : "/payrollbien-assets/brand-mark.svg"} alt="" />
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [activePrinciple, setActivePrinciple] = useState(0);
  const principlesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const section = principlesRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const ratio = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, scrollable)));
        setActivePrinciple(ratio < .36 ? 0 : ratio < .68 ? 1 : 2);
      }
      document.querySelectorAll<HTMLElement>(".scroll-reveal").forEach(node => {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight * .9 && rect.bottom > 0) node.classList.add("is-visible");
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="about-page">
      <SiteHeader />

      <section className="about-hero">
        <video autoPlay muted loop playsInline preload="auto" src="/payrollbien-assets/hero.mp4" />
        <div className="about-hero__veil" />
        <div className="about-hero__content">
          <h1>About PayrollBien</h1>
          <p>Since our inception, we&apos;ve been a payroll partner committed to our core values of quality, reliability and transparency.</p>
        </div>
      </section>

      <section className="about-vision">
        <Eyebrow>Our vision</Eyebrow>
        <div className="about-vision__intro">
          <h2 className="scroll-reveal">About Payroll Services</h2>
          <div className="scroll-reveal">
            <p>As a market leader in the payroll services industry for over 10 years, we&apos;ve been focused on innovation and collaboration to ensure our clients receive the best service possible. We&apos;re a payroll partner that knows the key to a great service.</p>
            <a className="button button--dark" href="/payrollbien/contact">Get a Quote</a>
          </div>
        </div>
      </section>

      <section className="about-values-intro">
        <Eyebrow>Our values</Eyebrow>
        <h2 className="scroll-reveal">
          <span>Our core values are the foundation</span>
          <span>of everything we do</span>
        </h2>
      </section>

      <section className="principles-pin" ref={principlesRef}>
        <div className="principles-stage">
          {principles.map((principle, index) => (
            <article
              className={`principle ${index === activePrinciple ? "active" : ""} ${principle.dark ? "" : "principle--light"}`}
              key={principle.title}
            >
              <div className="principle__copy" style={{ background: principle.color }}>
                <h2>{principle.title}</h2>
                <p>{principle.body}</p>
              </div>
              <img src={principle.image} alt="" />
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta" id="contact">
        <Eyebrow light>Let&apos;s talk payroll</Eyebrow>
        <h2>Get started<br />today</h2>
        <p>Learn how our payroll services can give your business the flexibility, scalability and support it needs.</p>
        <a className="button button--light" href="/payrollbien/contact">Get a Quote</a>
      </section>

      <SiteFooter />
    </main>
  );
}
