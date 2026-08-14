import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

type Benefit = {
  title: string;
  body: string;
  icon: string;
};

export type ServiceConfig = {
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  visionTitle: string;
  visionBody: string;
  benefitsTitle: string;
  benefitsBody: string;
  benefits: Benefit[];
  detailsEyebrow: string;
  detailsTitle: string;
  details: Array<{ title: string; body: string }>;
};

function Mark() {
  return (
    <a className="mark" href="/payrollbien/" aria-label="PayrollBien home">
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

export default function ServicePage({ config }: { config: ServiceConfig }) {
  return (
    <main className="service-page">
      <SiteHeader />

      <section className="service-hero">
        <video autoPlay muted loop playsInline preload="auto" src="/payrollbien-assets/hero.mp4" />
        <div className="service-hero__veil" />
        <div className="service-hero__content">
          <h1>{config.heroTitle}</h1>
          <p>{config.heroBody}</p>
        </div>
      </section>

      <section className="service-vision">
        <Eyebrow>Our vision</Eyebrow>
        <div className="service-vision__intro">
          <h2>{config.visionTitle}</h2>
          <div>
            <p>{config.visionBody}</p>
            <a className="button button--dark" href="/payrollbien/contact">Get a Quote</a>
          </div>
        </div>
      </section>

      <section className="service-benefits">
        <Eyebrow light>Key benefits</Eyebrow>
        <div className="service-benefits__intro">
          <h2>{config.benefitsTitle}</h2>
          <p>{config.benefitsBody}</p>
        </div>
        <div className="service-benefits__grid">
          {config.benefits.map(benefit => (
            <article key={benefit.title}>
              <div className="service-benefits__icon">
                <img src={benefit.icon} alt="" />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-details">
        <Eyebrow>{config.detailsEyebrow}</Eyebrow>
        <h2>{config.detailsTitle}</h2>
        <div className="service-details__grid">
          {config.details.map(detail => (
            <article key={detail.title}>
              <h3>{detail.title}</h3>
              <p>{detail.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-cta">
        <div>
          <Eyebrow light>Let&apos;s talk payroll</Eyebrow>
          <h2>Get started<br />today</h2>
          <p>Talk to our payroll specialists about a service shaped around your organisation, people and growth plans.</p>
          <a className="button button--dark" href="/payrollbien/contact">Get a Quote</a>
        </div>
        <div className="service-cta__art">
          <img src="/payrollbien-assets/get-started.png" alt="PayrollBien specialists working together" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
