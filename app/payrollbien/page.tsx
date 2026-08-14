"use client";

import { useEffect, useRef, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

const services = [
  {
    title: "Payroll for Accountants",
    body: "A fully managed, flexible payroll solution to help accountancy firms scale, reduce internal workload, and deliver a seamless service to clients.",
    image: "/payrollbien-assets/service-accountants.png",
    color: "#a9fdfa",
    href: "/payrollbien/services/accountants",
  },
  {
    title: "Payroll for Small/Medium Enterprises",
    body: "Flexible, scalable payroll support designed for growing businesses.",
    image: "/payrollbien-assets/service-sme.png",
    color: "#fed500",
    href: "/payrollbien/services/sme",
  },
  {
    title: "Payroll for Large Enterprises",
    body: "Comprehensive, compliant payroll solutions for complex workforce needs.",
    image: "/payrollbien-assets/service-enterprise.png",
    color: "#957cf4",
    href: "/payrollbien/services/enterprise",
  },
];

const values = [
  {
    title: "Quality",
    body: "We place full emphasis on providing our clients with a quality payroll service, continually achieving a high minimum core accuracy rate and ensuring the real time and accurate reporting of the payroll services function.",
    color: "#a9fdfa",
    shape: "/payrollbien-assets/value-quality.svg",
  },
  {
    title: "Reliability",
    body: "We have multiple control measures in place to ensure any possible errors are eradicated ahead of the payroll execution.",
    color: "#fed500",
    shape: "/payrollbien-assets/value-reliability.svg",
  },
  {
    title: "Transparency",
    body: "With a bespoke and transparent pricing structure, we never include any hidden costs as part of our on-boarding process for clients.",
    color: "#957cf4",
    shape: "/payrollbien-assets/value-transparency.svg",
  },
];

const people = [
  ["Amelia Hart", "Managing Director", "/payrollbien-assets/team-amelia.jpeg"],
  ["Theo Bennett", "Head of Payroll", "/payrollbien-assets/team-theo.jpeg"],
  ["Sofia Malik", "Client Services Director", "/payrollbien-assets/team-sofia.jpeg"],
  ["Oliver Reed", "Compliance Lead", "/payrollbien-assets/team-oliver.jpeg"],
  ["Maya Collins", "Payroll Operations Manager", "/payrollbien-assets/team-maya.jpeg"],
  ["Noah Williams", "Implementation Lead", "/payrollbien-assets/team-noah.jpeg"],
  ["Isla Thompson", "Senior Payroll Specialist", "/payrollbien-assets/team-isla.jpeg"],
  ["Leo Morgan", "Customer Success Manager", "/payrollbien-assets/team-leo.jpeg"],
  ["Eva Patel", "Payroll Analyst", "/payrollbien-assets/team-eva.jpeg"],
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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [menuVisible, setMenuVisible] = useState(true);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [mobileServiceIndex, setMobileServiceIndex] = useState(0);
  const serviceRef = useRef<HTMLElement>(null);
  const mobileServiceRef = useRef<HTMLElement>(null);
  const teamRevealRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const teamTrackRef = useRef<HTMLDivElement>(null);

  const moveTeam = (direction: number) => {
    teamTrackRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

  useEffect(() => {
    const started = performance.now();
    const duration = 1800;
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - started) / duration) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setLoading(false), 320);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setMenuVisible(y < lastY || y < 80);
      lastY = y;

      const service = serviceRef.current;
      if (service) {
        const rect = service.getBoundingClientRect();
        const scrollable = service.offsetHeight - window.innerHeight;
        const ratio = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, scrollable)));
        setServiceIndex(Math.floor(ratio * services.length));
      }

      const mobileService = mobileServiceRef.current;
      if (mobileService && window.innerWidth <= 560) {
        const rect = mobileService.getBoundingClientRect();
        const scrollable = mobileService.offsetHeight - window.innerHeight;
        const ratio = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, scrollable)));
        setMobileServiceIndex(Math.floor(ratio * services.length));
      }

      const reveal = teamRevealRef.current;
      if (reveal) {
        const rect = reveal.getBoundingClientRect();
        const scrollable = reveal.offsetHeight - window.innerHeight;
        const ratio = Math.max(0, Math.min(1, -rect.top / Math.max(1, scrollable)));
        const isMobile = window.innerWidth <= 560;
        reveal.style.setProperty("--circle-progress", String(ratio));
        reveal.style.setProperty("--circle-scale", String(isMobile ? 0.08 + ratio * 1.42 : 0.035 + ratio * 1.18));
        reveal.style.setProperty(
          "--content-opacity",
          String(Math.max(0, Math.min(1, isMobile ? (ratio - 0.08) * 7 : (ratio - 0.42) * 4))),
        );
        reveal.style.setProperty("--content-y", `${Math.max(0, isMobile ? 20 - ratio * 42 : 34 - ratio * 34)}px`);
      }

      const team = teamRef.current;
      const track = teamTrackRef.current;
      if (team && track && window.innerWidth > 900) {
        const rect = team.getBoundingClientRect();
        const scrollable = team.offsetHeight - window.innerHeight;
        const ratio = Math.max(0, Math.min(1, -rect.top / Math.max(1, scrollable)));
        const maxShift = Math.max(0, track.scrollWidth - window.innerWidth + 80);
        track.style.transform = `translate3d(${-ratio * maxShift}px,0,0)`;
      } else if (track) {
        track.style.transform = "none";
      }
      document.querySelectorAll<HTMLElement>(".scroll-reveal").forEach(node => {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) node.classList.add("is-visible");
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.18 },
    );
    document.querySelectorAll(".scroll-reveal").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="top">
      <div className={`loader ${loading ? "" : "loader--done"}`} aria-hidden={!loading}>
        <video autoPlay muted loop playsInline preload="auto" src="/payrollbien-assets/hero.mp4" />
        <div className="loader__shade" />
        <div className="loader__content">
          <div className="loader__number">{progress}%</div>
        </div>
      </div>

      <SiteHeader visible={menuVisible} />

      <section className={`hero ${loading ? "" : "hero--ready"}`}>
        <video autoPlay muted loop playsInline preload="auto" src="/payrollbien-assets/hero.mp4" />
        <div className="hero__veil" />
        <div className="hero__content">
          <div className="reveal">
            <h1>Professional<br />Payroll Services<br />Across the UK</h1>
          </div>
          <div className="hero__support reveal reveal--delay">
            <img className="hero__avatars" src="/payrollbien-assets/hero-avatars.png" alt="PayrollBien clients" />
            <p>With over 1,300 clients, we process more than £7 million in BACS payments each month.</p>
          </div>
          <a className="button reveal reveal--later" href="/payrollbien/contact">Get a Quote</a>
        </div>
      </section>

      <section className="stats" aria-label="Company statistics">
        {[
          ["15,000+", "Clients ranging from 1 to 15,000+ employees"],
          ["1,300+", "Medium and large enterprise clients"],
          ["50,000+", "Payslips produced and distributed every month"],
          ["£7m+", "In BACS payments processed each month"],
        ].map(([value, label]) => (
          <div className="stat" key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="about">
        <Eyebrow>About us</Eyebrow>
        <h2 className="scroll-reveal">We&apos;re an experienced and efficient payroll services provider, with top-class customer satisfaction at the very centre of the business.</h2>
        <div className="about__aside scroll-reveal">
          <p>Our comprehensive payroll process is designed around people, compliance and the needs of every stakeholder in your organisation.</p>
          <a className="button button--dark" href="/payrollbien/about">About us</a>
        </div>
      </section>

      <section className="services-intro" id="services">
        <Eyebrow>Services</Eyebrow>
        <h2 className="scroll-reveal">We offer a range of payroll services</h2>
      </section>

      <section className="services-pin" ref={serviceRef}>
        <div className="services-stage" style={{ "--service-color": services[serviceIndex].color } as React.CSSProperties}>
          <div className="service-copy-stack">
            {services.map((service, index) => (
              <div className={`service-copy ${index === serviceIndex ? "active" : ""}`} key={service.title}>
                <h2>{service.title}</h2>
                <p>{service.body}</p>
                <a className="button" href={service.href}>Learn More</a>
                <div className="service-dots" aria-hidden="true">
                  {services.map((_, dotIndex) => <i className={dotIndex === serviceIndex ? "active" : ""} key={dotIndex} />)}
                </div>
              </div>
            ))}
          </div>
          <div className="service-visual">
            {services.map((service, index) => (
              <img className={index === serviceIndex ? "active" : ""} src={service.image} alt="" key={service.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="services-mobile-pin" ref={mobileServiceRef} aria-label="Payroll services">
        <div className="services-mobile">
          {services.map((service, index) => (
            <article className={`services-mobile__card ${index === mobileServiceIndex ? "active" : ""}`} key={service.title}>
              <div className="services-mobile__copy">
                <h2>{service.title}</h2>
                <p>{service.body}</p>
                <a className="button" href={service.href}>Learn More</a>
              </div>
              <div className="services-mobile__visual" style={{ background: service.color }}>
                <img src={service.image} alt="" />
              </div>
            </article>
          ))}
          <div className="services-mobile__progress" aria-hidden="true">
            {services.map((_, index) => <i className={index === mobileServiceIndex ? "active" : ""} key={index} />)}
          </div>
        </div>
      </section>

      <section className="values" id="values">
        <Eyebrow>Our values</Eyebrow>
        <h2 className="scroll-reveal">Our core values are the foundation of everything we do</h2>
        <div className="values__grid">
          {values.map(value => (
            <article className="value-card scroll-reveal" style={{ "--accent": value.color } as React.CSSProperties} key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
              <img className="value-card__shape" src={value.shape} alt="" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="team-reveal" ref={teamRevealRef}>
        <div className="team-reveal__stage">
          <div className="team-reveal__circle" />
          <div className="team-reveal__content">
            <Eyebrow light>People and partnerships</Eyebrow>
            <h2><span>Great work begins</span><span>with remarkable</span><span>people</span></h2>
            <img src="/payrollbien-assets/team-collage.png" alt="PayrollBien team collage" />
            <p>We bring together trusted specialists, influential thinkers and ambitious partners who believe payroll can be precise, personal and genuinely collaborative.</p>
          </div>
        </div>
      </section>

      <section className="team-scroll" id="team" ref={teamRef}>
        <div className="team-stage">
          <div className="team-heading">
            <Eyebrow light>Our people</Eyebrow>
            <h2>Meet the minds behind PayrollBien</h2>
          </div>
          <div className="team-track" ref={teamTrackRef}>
            {people.map(([name, role, image], index) => (
              <article className="person" key={name}>
                <div className={`person__portrait person__portrait--${(index % 3) + 1}`}>
                  <img src={image} alt={name} />
                </div>
                <h3>{name}</h3>
                <p>{role}</p>
              </article>
            ))}
            <div className="team-next">
              <p>Nine people.<br />One precise team.</p>
            </div>
          </div>
          <div className="team-controls" aria-label="Browse team members">
            <button type="button" onClick={() => moveTeam(-1)} aria-label="Previous team member">←</button>
            <button type="button" onClick={() => moveTeam(1)} aria-label="Next team member">→</button>
          </div>
        </div>
      </section>

      <section className="get-started" id="contact">
        <div>
          <Eyebrow>Let&apos;s talk payroll</Eyebrow>
          <h2>Get started today</h2>
          <p>Learn how our payroll services can give your business the flexibility, scalability and support it needs.</p>
          <a className="button button--dark" href="/payrollbien/contact">Get a Quote</a>
        </div>
        <div className="get-started__art">
          <img src="/payrollbien-assets/get-started.png" alt="PayrollBien specialists working together" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
