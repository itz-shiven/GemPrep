import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Logo } from "@/components/shared/logo";
import { isProfileComplete, requireSyncedUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireSyncedUser();

  if (isProfileComplete(user)) {
    redirect(ROUTES.dashboard);
  }

  return (
    <main className="min-h-screen bg-secondary/45 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <Logo />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">Onboarding</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">
              Set up your interview profile.
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              This information helps GEMPREP prepare the application foundation
              for future matching, interview rooms, and progress workflows.
            </p>
          </div>
          <OnboardingForm
            defaults={{
              fullName: user.fullName ?? "",
              college: user.college ?? "",
              graduationYear: user.graduationYear ?? "",
              preferredLanguage: user.preferredLanguage ?? "",
              experienceLevel: user.experienceLevel ?? "",
              bio: user.bio ?? "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
