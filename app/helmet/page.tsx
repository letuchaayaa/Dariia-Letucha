import type { Metadata } from "next";
import { HelmetExperience } from "./HelmetExperience";

export const metadata: Metadata = {
  title: "Шлем — Dariia Letucha",
  description: "Interactive project archive by Dariia Letucha.",
};

export default function HelmetPage() {
  return <HelmetExperience />;
}
