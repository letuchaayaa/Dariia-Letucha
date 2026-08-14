export default function SiteFooter() {
  return (
    <footer className="footer">
      <video autoPlay muted loop playsInline preload="metadata" src="/payrollbien-assets/hero.mp4" />
      <div className="footer__veil" />
      <div className="footer__inner">
        <a className="mark" href="/payrollbien/" aria-label="PayrollBien home">
          <img src="/payrollbien-assets/logo.svg" alt="" />
        </a>
        <div className="footer__headline-row">
          <h2>Payroll that works<br />beautifully.</h2>
          <nav className="footer__primary" aria-label="Footer navigation">
            <a href="/payrollbien/about">About</a>
            <a href="/payrollbien/#services">Services</a>
            <a href="/payrollbien/team">Team</a>
          </nav>
        </div>
        <div className="footer__contact">
          <a href="mailto:hello@payrollbien.co.uk">hello@payrollbien.co.uk</a>
          <a href="tel:+442079460281">+44 (0)20 7946 0281</a>
          <span>24 Clerkenwell Road, London EC1M 5PQ</span>
        </div>
        <div className="footer__bottom">
          <span>© 2026 PayrollBien</span>
          <span>Built around people. Driven by precision.</span>
        </div>
      </div>
    </footer>
  );
}
