import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { isProfileComplete, requireSyncedUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

type ProtectedDashboardShellProps = {
  children: ReactNode;
};

export async function ProtectedDashboardShell({
  children,
}: ProtectedDashboardShellProps) {
  const user = await requireSyncedUser();

  if (!isProfileComplete(user)) {
    redirect(ROUTES.onboarding);
  }

  return (
    <DashboardShell
      user={{
        id: user.id,
        fullName: user.fullName ?? "GEMPREP user",
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        gems: user.gems,
        interviewsCompleted: user.interviewsCompleted,
      }}
    >
      {children}
    </DashboardShell>
  );
}
