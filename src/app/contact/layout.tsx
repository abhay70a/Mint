import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Mint SaaS",
  description: "Get in touch with our team for your next digital project.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
