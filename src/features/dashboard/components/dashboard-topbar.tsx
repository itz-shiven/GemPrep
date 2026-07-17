"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { NotificationMenu } from "@/features/dashboard/components/notification-menu";
import { ThemeToggle } from "@/features/dashboard/components/theme-toggle";
import { UserProfileMenu } from "@/features/dashboard/components/user-profile-menu";
import type { DashboardUser } from "@/features/dashboard/types";

type DashboardTopbarProps = {
  user: DashboardUser;
};

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/92 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/78 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open dashboard navigation"
            >
              <Menu className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="left-0 top-0 h-dvh w-72 max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0 data-[state=closed]:scale-100 data-[state=open]:scale-100">
            <DialogTitle className="sr-only">Dashboard navigation</DialogTitle>
            <DashboardSidebar collapsed={false} onToggle={() => undefined} mobile />
          </DialogContent>
        </Dialog>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb}>
                {index > 0 ? (
                  <span className="mr-2" aria-hidden="true">
                    /
                  </span>
                ) : null}
                <span
                  className={
                    index === breadcrumbs.length - 1 ? "text-foreground" : undefined
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-1 truncate text-sm font-medium">
            Interview preparation workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationMenu />
        <ThemeToggle />
        <UserProfileMenu user={user} />
      </div>
    </header>
  );
}

function getBreadcrumbs(pathname: string) {
  if (pathname.startsWith("/workspace/interview")) {
    return ["Workspace", "Interview"];
  }

  return ["Dashboard", "Overview"];
}
