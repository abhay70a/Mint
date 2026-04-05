import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Mint SaaS",
  description: "Explore our premium digital services, from full-stack development to AI integration.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
