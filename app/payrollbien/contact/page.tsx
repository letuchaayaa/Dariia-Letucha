"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

function Mark() {
  return (
    <a className="mark" href="/payrollbien/" aria-label="PayrollBien home">
      <img src="/payrollbien-assets/logo.svg" alt="" />
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow eyebrow--logo">
      <img src="/payrollbien-assets/brand-mark.svg" alt="" />
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main>
      <SiteHeader />

      <section className="contact-hero">
        <video autoPlay muted loop playsInline preload="auto" src="/payrollbien-assets/hero.mp4" />
        <div className="service-hero__veil" />
        <div className="contact-hero__content">
          <div className="contact-hero__copy">
            <Eyebrow>Contact</Eyebrow>
            <h1>Let&apos;s talk payroll</h1>
            <p>Tell us what your organisation needs and one of our payroll specialists will get back to you.</p>
          </div>
          <form className="contact-form" onSubmit={event => { event.preventDefault(); setSent(true); }}>
            <div className="contact-form__row">
              <label>First name<input name="firstName" autoComplete="given-name" required /></label>
              <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
            </div>
            <label>Work email<input type="email" name="email" autoComplete="email" required /></label>
            <label>Company<input name="company" autoComplete="organization" /></label>
            <label>
              Service
              <select name="service" defaultValue="">
                <option value="" disabled>Select a service</option>
                <option>Payroll for Accountants</option>
                <option>Payroll for SMEs</option>
                <option>Payroll for Large Enterprises</option>
              </select>
            </label>
            <label>How can we help?<textarea name="message" rows={4} /></label>
            <button className="button button--dark" type="submit">Send enquiry</button>
            {sent && <p className="contact-form__success">Thank you — we&apos;ll be in touch shortly.</p>}
          </form>
          <div className="contact-details">
            <a href="mailto:hello@payrollbien.co.uk">hello@payrollbien.co.uk</a>
            <a href="tel:+442079460281">+44 (0)20 7946 0281</a>
            <span>24 Clerkenwell Road, London EC1M 5PQ</span>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
