import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@clerk/ui/themes/shadcn.css";
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
  title: "GemPrep — Practice Real Technical Interviews",
  description:
    "Practice real technical DSA interviews with other software engineers. Get AI-assisted follow-up questions and actionable feedback.",
  keywords: ["DSA", "interview", "practice", "coding", "technical interview", "mock interview"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ClerkProvider
          appearance={{
            theme: shadcn,
            variables: {
              colorPrimary: "#4ade80",
              colorBackground: "#0d0d12",
              borderRadius: "0.625rem",
            },
          }}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
