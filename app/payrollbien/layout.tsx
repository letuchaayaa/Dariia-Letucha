import type { Metadata } from "next";
import "./payrollbien.css";
import RevealOnScroll from "./components/RevealOnScroll";

export const metadata: Metadata = {
  title: "PayrollBien — Professional Payroll Services",
  description: "Flexible, reliable payroll services for accountants, growing businesses and large enterprises across the UK.",
  icons: {
    icon: "/payrollbien-assets/logo.svg",
    shortcut: "/payrollbien-assets/logo.svg",
  },
};

export default function PayrollBienLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="payrollbien-site">
      <RevealOnScroll />
      {children}
    </div>
  );
}
