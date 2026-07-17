import type { ReactNode } from "react";

import { ProtectedDashboardShell } from "@/features/dashboard/components/protected-dashboard-shell";

export const dynamic = "force-dynamic";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <ProtectedDashboardShell>{children}</ProtectedDashboardShell>;
}
