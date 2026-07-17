import type { ReactNode } from "react";

import { ProtectedDashboardShell } from "@/features/dashboard/components/protected-dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedDashboardShell>{children}</ProtectedDashboardShell>;
}
