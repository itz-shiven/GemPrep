"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Moon, PhoneOff, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InterviewTimer } from "@/features/interview-room/components/InterviewTimer";
import type {
  InterviewRoomTheme,
  RoomRole,
} from "@/features/interview-room/types/interview-room";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type RoomHeaderProps = {
  interviewerVideo?: ReactNode;
  runCodeAction?: ReactNode;
  role: RoomRole;
  theme: InterviewRoomTheme;
  onToggleTheme: () => void;
};

export function RoomHeader({
  interviewerVideo,
  runCodeAction,
  role,
  theme,
  onToggleTheme,
}: RoomHeaderProps) {
  const router = useRouter();
  const isDark = theme === "dark";

  function leaveRoom() {
    router.push(ROUTES.interviewWorkspace);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b px-4 py-2 backdrop-blur",
        isDark
          ? "border-black/30 bg-neutral-900/95 text-white supports-[backdrop-filter]:bg-neutral-900/85"
          : "border-neutral-300 bg-neutral-100/95 text-foreground supports-[backdrop-filter]:bg-neutral-100/85",
      )}
    >
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="inline-flex shrink-0 items-center rounded-md font-semibold tracking-normal text-white"
            aria-label="GEMPREP interview room"
          >
            <span
              className="grid size-7 place-items-center rounded-md border border-primary/20 bg-primary text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              <span className="size-2.5 rotate-45 rounded-[2px] border border-current" />
            </span>
          </div>

          {interviewerVideo ? (
            <div className="hidden shrink-0 md:block">{interviewerVideo}</div>
          ) : null}
        </div>

        <div className="flex justify-start lg:justify-center">
          {runCodeAction}
        </div>

        <div className="flex shrink-0 items-center justify-start gap-2 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "size-9 rounded-full",
              isDark
                ? "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.14]"
                : "border-border bg-background text-foreground hover:bg-secondary",
            )}
            aria-label={
              isDark
                ? "Switch to light interview room theme"
                : "Switch to dark interview room theme"
            }
            onClick={onToggleTheme}
          >
            {isDark ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </Button>
          <InterviewTimer role={role} theme={theme} />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="bg-red-600 text-white hover:bg-red-600/92"
            onClick={leaveRoom}
          >
            <PhoneOff className="size-4" />
            Leave
          </Button>
        </div>
      </div>
    </header>
  );
}
