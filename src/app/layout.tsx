import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { GlobalTopBar } from "@/components/ui/GlobalTopBar";
import { GlobalNavbar } from "@/components/ui/GlobalNavbar";
import ClickSparkProvider from "@/components/ui/ClickSparkProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mint — Modern Service Platform",
  description: "The cyber-tech service delivery platform for modern teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClickSparkProvider
          sparkColor="#62e8a0"
          sparkSize={12}
          sparkRadius={22}
          sparkCount={8}
          duration={500}
          easing="ease-out"
          extraScale={1.3}
        >
          <ToastProvider>
            <Suspense fallback={null}>
              <GlobalNavbar />
            </Suspense>
            <Suspense fallback={null}>
              <GlobalTopBar />
            </Suspense>
            {children}
          </ToastProvider>
        </ClickSparkProvider>
      </body>
    </html>
  );
}
