import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignInShowcase } from "@/components/auth/sign-in-showcase";
import { ROUTES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to GEMPREP with email or Google.",
};

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(ROUTES.dashboard);
  }

  return (
    <SignInShowcase>
      <SignIn
        routing="path"
        path={ROUTES.signIn}
        signUpUrl={ROUTES.signUp}
        fallbackRedirectUrl={ROUTES.dashboard}
        oauthFlow="redirect"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "w-full border-0 shadow-none",
            headerTitle:
              "text-2xl font-semibold tracking-normal text-foreground",
            headerSubtitle: "text-sm text-muted-foreground",
            socialButtonsBlockButton:
              "h-10 rounded-md border border-border bg-background text-sm font-medium text-foreground shadow-sm hover:bg-secondary",
            formFieldInput:
              "h-10 rounded-md border border-input bg-background text-sm text-foreground shadow-sm",
            formButtonPrimary:
              "h-10 rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90",
            footerActionLink: "font-medium text-primary hover:text-primary",
          },
        }}
      />
    </SignInShowcase>
  );
}
