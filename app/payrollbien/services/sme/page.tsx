import ServicePage, { type ServiceConfig } from "../ServicePage";

const config: ServiceConfig = {
  eyebrow: "SMEs",
  heroTitle: "Payroll Services for SMEs",
  heroBody: "Flexible, scalable payroll support designed for growing businesses.",
  visionTitle: "Outsourced Payroll Services Built for SMEs",
  visionBody: "Our fully outsourced payroll service gives growing companies the expertise and flexibility they need without the overheads of an in-house function. Whether you have a handful of employees or a growing workforce, our service adapts with your business.",
  benefitsTitle: "Practical Payroll Support for Growing Teams",
  benefitsBody: "A dependable service that frees your people to focus on customers, operations and sustainable growth.",
  benefits: [
    { title: "Cost-effective solutions", body: "Access professional payroll expertise without the expense of hiring internally.", icon: "/payrollbien-assets/value-quality.svg" },
    { title: "Flexible and scalable pricing", body: "Only pay for what you need, with packages that grow as your business expands.", icon: "/payrollbien-assets/value-reliability.svg" },
    { title: "Time savings", body: "Free up internal staff to focus on running and growing the business.", icon: "/payrollbien-assets/value-transparency.svg" },
    { title: "Peace of mind", body: "Stay compliant with HMRC regulations, with payroll managed by dedicated specialists.", icon: "/payrollbien-assets/value-quality.svg" },
  ],
  detailsEyebrow: "Growing businesses",
  detailsTitle: "A Smarter Alternative to In-House Payroll",
  details: [
    { title: "Dedicated account manager", body: "One payroll contact for your business, providing responsive and personal support." },
    { title: "Compliant payroll processing", body: "RTI submissions, pension contributions, statutory payments and HMRC updates handled." },
    { title: "Secure online portal", body: "Employees can access payslips, P60s, P45s and payroll records securely at any time." },
  ],
};

export default function SmePage() {
  return <ServicePage config={config} />;
}
