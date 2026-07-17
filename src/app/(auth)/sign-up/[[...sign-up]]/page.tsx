import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { ROUTES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(ROUTES.dashboard);
  }

  return (
    <AuthShell
      title="Create your GEMPREP account"
      description="Start with email or Google. Profile setup happens right after signup."
    >
      <SignUp
        routing="path"
        path={ROUTES.signUp}
        signInUrl={ROUTES.signIn}
        fallbackRedirectUrl={ROUTES.onboarding}
        oauthFlow="redirect"
      />
    </AuthShell>
  );
}
