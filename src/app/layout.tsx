import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gemprep.dev"),
  title: {
    default: "GEMPREP - AI Peer Technical Interviews",
    template: "%s | GEMPREP",
  },
  description:
    "GEMPREP is an AI-powered peer-to-peer technical interview platform for structured practice, calibration, and review.",
  applicationName: "GEMPREP",
  keywords: [
    "technical interviews",
    "peer interviews",
    "coding practice",
    "AI interview prep",
    "software engineering interviews",
  ],
  authors: [{ name: "GEMPREP" }],
  openGraph: {
    title: "GEMPREP - AI Peer Technical Interviews",
    description:
      "Practice technical interviews with matched peers, AI-guided rubrics, and actionable review loops.",
    url: "https://gemprep.dev",
    siteName: "GEMPREP",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
