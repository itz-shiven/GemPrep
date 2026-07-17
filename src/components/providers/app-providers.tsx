"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toaster } from "sonner";

import { ROUTES } from "@/lib/constants";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ClerkProvider
      signInUrl={ROUTES.signIn}
      signUpUrl={ROUTES.signUp}
      signInFallbackRedirectUrl={ROUTES.dashboard}
      signUpFallbackRedirectUrl={ROUTES.onboarding}
      appearance={{
        variables: {
          colorPrimary: "hsl(162 72% 32%)",
          colorPrimaryForeground: "hsl(0 0% 100%)",
          colorBackground: "hsl(0 0% 100%)",
          borderRadius: "0.5rem",
        },
        elements: {
          cardBox: "shadow-none border border-border rounded-lg",
          formButtonPrimary:
            "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton richColors position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
