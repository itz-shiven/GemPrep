"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Video, FileText, Settings, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Interviews",
    icon: Video,
    href: "/dashboard/interviews",
  },
  {
    label: "Resume",
    icon: FileText,
    href: "/dashboard/resume",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-64 border-r border-border bg-card/50 px-3 py-4">
      <div className="px-3 py-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">GemPrep</h2>
      </div>
      <div className="flex-1 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === route.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="mt-auto px-3 py-2">
        <SignOutButton>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
