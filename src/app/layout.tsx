import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { CookieConsent } from "@/components/cookie-consent";
import { AccountProvider } from '@/components/account-provider';
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "HackCulture — Accelerate Innovation",
    template: "%s | HackCulture",
  },
  description:
    "Corporate innovation programs, hackathons, hiring challenges, and AI capability building.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="__variable_c22fe1 __variable_8b3a0b">
      <head>
        <link rel="stylesheet" href="/reference.css" />
      </head>
      <body className="font-sans antialiased">
        <a href="#page-content" className="skip-link">
          Skip to content
        </a>
        <AccountProvider><SiteHeader />
        {children}
        <CookieConsent />
        </AccountProvider>
      </body>
    </html>
  );
}
