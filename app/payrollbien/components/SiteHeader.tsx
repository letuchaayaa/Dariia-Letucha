"use client";

import { useState } from "react";

const serviceLinks = [
  { href: "/payrollbien/services/accountants", label: "Payroll for Accountants" },
  { href: "/payrollbien/services/sme", label: "Payroll for SMEs" },
  { href: "/payrollbien/services/enterprise", label: "Payroll for Large Enterprises" },
];

export default function SiteHeader({ visible = true }: { visible?: boolean }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className={`header ${visible ? "header--visible" : ""} ${open ? "header--open" : ""}`}>
      <a className="mark" href="/payrollbien/" aria-label="PayrollBien home">
        <img src="/payrollbien-assets/logo.svg" alt="" />
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/payrollbien/about">About</a>
        <div className="services-menu">
          <a href="/payrollbien/#services" aria-haspopup="true">Services</a>
          <div className="services-menu__panel">
            {serviceLinks.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}
          </div>
        </div>
        <a href="/payrollbien/team">Team</a>
      </nav>

      <a className="header__cta" href="/payrollbien/contact">Get a quote</a>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(value => !value)}
      >
        <span />
        <span />
      </button>

      <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
        <a href="/payrollbien/" onClick={() => setOpen(false)}>Home</a>
        <a href="/payrollbien/about" onClick={() => setOpen(false)}>About</a>
        <button
          className="mobile-menu__services-toggle"
          type="button"
          aria-expanded={servicesOpen}
          aria-controls="mobile-services-list"
          onClick={() => setServicesOpen(value => !value)}
        >
          <span>Services</span>
          <span aria-hidden="true">{servicesOpen ? "−" : "+"}</span>
        </button>
        <div className={`mobile-menu__services ${servicesOpen ? "mobile-menu__services--open" : ""}`} id="mobile-services-list">
          {serviceLinks.map(link => (
            <a className="mobile-menu__service" href={link.href} onClick={() => setOpen(false)} key={link.href}>{link.label}</a>
          ))}
        </div>
        <a href="/payrollbien/team" onClick={() => setOpen(false)}>Team</a>
        <a className="mobile-menu__cta" href="/payrollbien/contact" onClick={() => setOpen(false)}>Get a quote</a>
      </nav>
    </header>
  );
}
