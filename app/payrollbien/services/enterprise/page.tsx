import ServicePage, { type ServiceConfig } from "../ServicePage";

const config: ServiceConfig = {
  eyebrow: "Enterprise",
  heroTitle: "Payroll Services for Large Enterprises",
  heroBody: "Robust, compliant payroll infrastructure for complex workforces, multiple entities and demanding reporting requirements.",
  visionTitle: "Enterprise Payroll Built for Complexity",
  visionBody: "We combine experienced payroll teams, rigorous controls and responsive account management to deliver accurate payroll at scale. Our model supports complex pay structures, multiple sites and evolving organisational needs.",
  benefitsTitle: "Control, Visibility and Confidence at Scale",
  benefitsBody: "A resilient payroll partnership that protects accuracy, governance and the employee experience across your organisation.",
  benefits: [
    { title: "Scalable delivery", body: "A service model capable of supporting large and changing employee populations.", icon: "/payrollbien-assets/value-quality.svg" },
    { title: "Strong governance", body: "Documented controls, audit trails and review stages support confident oversight.", icon: "/payrollbien-assets/value-reliability.svg" },
    { title: "Detailed reporting", body: "Clear management information for finance, HR and operational stakeholders.", icon: "/payrollbien-assets/value-transparency.svg" },
    { title: "Business continuity", body: "Specialist team coverage reduces key-person risk and protects every payroll cycle.", icon: "/payrollbien-assets/value-quality.svg" },
  ],
  detailsEyebrow: "Large organisations",
  detailsTitle: "Payroll Infrastructure You Can Depend On",
  details: [
    { title: "Complex payroll processing", body: "Multiple pay groups, entities, benefits, deductions and variable pay handled accurately." },
    { title: "Implementation support", body: "Structured discovery, data validation and parallel runs create a controlled transition." },
    { title: "Strategic account management", body: "Regular service reviews, reporting and continuous improvement aligned to your goals." },
  ],
};

export default function EnterprisePage() {
  return <ServicePage config={config} />;
}
