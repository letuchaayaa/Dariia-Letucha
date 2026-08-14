import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const people = [
  { name: "Amelia Hart", role: "Managing Director", image: "/payrollbien-assets/team-amelia.jpeg" },
  { name: "Sofia Malik", role: "Client Services Director", image: "/payrollbien-assets/team-sofia.jpeg" },
  { name: "Theo Bennett", role: "Head of Payroll", image: "/payrollbien-assets/team-theo.jpeg" },
  { name: "Oliver Reed", role: "Compliance Lead", image: "/payrollbien-assets/team-oliver.jpeg" },
  { name: "Maya Collins", role: "Payroll Operations Manager", image: "/payrollbien-assets/team-maya.jpeg" },
  { name: "Isla Thompson", role: "Senior Payroll Specialist", image: "/payrollbien-assets/team-isla.jpeg" },
  { name: "Noah Williams", role: "Implementation Lead", image: "/payrollbien-assets/team-noah.jpeg" },
  { name: "Leo Morgan", role: "Customer Success Manager", image: "/payrollbien-assets/team-leo.jpeg" },
  { name: "Eva Patel", role: "Payroll Analyst", image: "/payrollbien-assets/team-eva.jpeg" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow eyebrow--logo">
      <img src="/payrollbien-assets/brand-mark.svg" alt="" />
      {children}
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="team-page">
      <SiteHeader />

      <section className="team-page__hero">
        <video autoPlay muted loop playsInline preload="auto" src="/payrollbien-assets/hero.mp4" />
        <div className="team-page__veil" />
        <div className="team-page__hero-content">
          <Eyebrow>Our team</Eyebrow>
          <h1>People who make payroll work beautifully</h1>
          <p>Experienced specialists, clear thinkers and thoughtful collaborators — working together to give every client a dependable payroll experience.</p>
        </div>
      </section>

      <section className="team-page__people">
        <Eyebrow>Meet the team</Eyebrow>
        <div className="team-page__intro">
          <h2>Expertise with a human point of view</h2>
          <p>Our people combine technical payroll knowledge with a genuine commitment to service, communication and long-term partnership.</p>
        </div>
        <div className="team-page__grid">
          {people.map(person => (
            <article className="team-card" key={person.name}>
              <div className="team-card__photo">
                <img src={person.image} alt={person.name} />
              </div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="team-page__cta">
        <Eyebrow>Work with us</Eyebrow>
        <h2>Let&apos;s build better payroll together</h2>
        <a className="button button--dark" href="/payrollbien/contact">Get a Quote</a>
      </section>

      <SiteFooter />
    </main>
  );
}
