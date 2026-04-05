import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Requests — Mint Dashboard",
  description: "Manage and track all your active projects in real-time.",
};

export default function RequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
