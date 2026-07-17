import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SidebarItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  active?: boolean;
};

export type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

type SidebarProps = {
  sections: SidebarSection[];
  footer?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function Sidebar({
  sections,
  footer,
  className,
  "aria-label": ariaLabel = "Primary",
}: SidebarProps) {
  return (
    <aside
      aria-label={ariaLabel}
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r bg-background",
        className,
      )}
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {sections.map((section, sectionIndex) => (
          <nav
            key={section.title ?? sectionIndex}
            aria-label={section.title}
            className="space-y-1"
          >
            {section.title ? (
              <p className="px-3 pb-2 text-xs font-medium uppercase text-muted-foreground">
                {section.title}
              </p>
            ) : null}
            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    "focus-ring flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                    item.active && "bg-secondary text-foreground",
                  )}
                >
                  {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  {item.badge ? (
                    <span className="rounded-md border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        ))}
      </div>
      {footer ? <div className="border-t p-3">{footer}</div> : null}
    </aside>
  );
}
