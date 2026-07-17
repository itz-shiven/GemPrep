"use client";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications } from "@/features/dashboard/data/home";

export function NotificationMenu() {
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm text-foreground">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 ? <Badge variant="success">{unreadCount} new</Badge> : null}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-80 overflow-y-auto p-2">
          {notifications.map((notification) => (
            <div
              key={notification.title}
              className="rounded-md px-2 py-2 transition-colors hover:bg-secondary"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{notification.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {notification.description}
              </p>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
