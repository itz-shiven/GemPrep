"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { DashboardUserProvider } from "@/features/dashboard/components/dashboard-user-context";
import type { DashboardUser } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  user: DashboardUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen bg-secondary/45 lg:grid",
        collapsed ? "lg:grid-cols-[4.5rem_1fr]" : "lg:grid-cols-[16rem_1fr]",
      )}
    >
      <div className="hidden lg:block">
        <DashboardSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      </div>
      <div className="min-w-0">
        <DashboardTopbar user={user} />
        <DashboardUserProvider user={user}>
          <main className="p-4 lg:p-6">{children}</main>
        </DashboardUserProvider>
      </div>
    </div>
  );
}
