import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { coachCoreConfig } from "@/config/coachcore";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${coachCoreConfig.appName} — ${coachCoreConfig.hook}`,
  description: coachCoreConfig.accountabilityDefinition,
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--ms-bg)] text-[var(--ms-ink)]">
        {/* Netlify form detection — must be in server-rendered HTML at build time */}
        <form name="coachcore-beta" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
          <input type="hidden" name="form-name" value="coachcore-beta" />
          <input name="bot-field" />
          <input name="name" />
          <input name="email" />
          <input name="organization" />
          <input name="lane" />
          <textarea name="message" />
        </form>
        {children}
      </body>
    </html>
  );
}
