import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Mint SaaS",
  description: "Our mission to elevate service standards through cutting-edge technology.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
