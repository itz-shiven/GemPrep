"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { dashboardNavigation } from "@/features/dashboard/data/navigation";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
};

export function DashboardSidebar({
  collapsed,
  onToggle,
  mobile = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-background",
        mobile ? "w-72" : collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Logo markOnly={collapsed && !mobile} />
        {!mobile ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {dashboardNavigation.map((section, sectionIndex) => (
          <div key={section.title ?? sectionIndex} className="space-y-1">
            {section.title && (!collapsed || mobile) ? (
              <p className="px-3 pb-2 text-xs font-medium uppercase text-muted-foreground">
                {section.title}
              </p>
            ) : null}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const content = (
                <>
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {!collapsed || mobile ? (
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  ) : (
                    <span className="sr-only">{item.title}</span>
                  )}
                  {item.badge && (!collapsed || mobile) ? (
                    <span className="rounded-md border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              );

              return item.disabled ? (
                <button
                  key={item.title}
                  type="button"
                  disabled
                  className={cn(
                    "flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground opacity-60",
                    collapsed && !mobile && "justify-center px-0",
                  )}
                >
                  {content}
                </button>
              ) : (
                <Link
                  key={item.title}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                    active && "bg-secondary text-foreground",
                    collapsed && !mobile && "justify-center px-0",
                  )}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
