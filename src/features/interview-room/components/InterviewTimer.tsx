"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  InterviewRoomTheme,
  RoomRole,
} from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type InterviewTimerProps = {
  initialSeconds?: number;
  role: RoomRole;
  theme?: InterviewRoomTheme;
};

export function InterviewTimer({
  initialSeconds = 0,
  role,
  theme = "dark",
}: InterviewTimerProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);
  const [state, setState] = useState<"idle" | "running" | "paused">("idle");
  const canControlTimer = role === "INTERVIEWER";
  const isDark = theme === "dark";

  useEffect(() => {
    if (state !== "running") {
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsElapsed((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [state]);

  if (canControlTimer && state === "idle") {
    return (
      <Button
        type="button"
        size="sm"
        className={cn(
          "rounded-full border font-medium shadow-sm",
          isDark
            ? "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.14]"
            : "border-border bg-background text-foreground hover:bg-secondary",
        )}
        onClick={() => setState("running")}
      >
        <Clock3 className="size-4 text-primary" aria-hidden="true" />
        Start Interview
      </Button>
    );
  }

  const timerLabel = formatDuration(secondsElapsed);

  if (canControlTimer) {
    const isPaused = state === "paused";

    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm font-medium shadow-sm transition-colors",
          isPaused
            ? isDark
              ? "border-red-400/25 bg-red-500/[0.14] text-red-100 hover:bg-red-500/[0.2]"
              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            : isDark
              ? "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.14]"
              : "border-border bg-background text-foreground hover:bg-secondary",
        )}
        aria-label={
          state === "running" ? "Pause interview timer" : "Resume interview timer"
        }
        onClick={() =>
          setState((currentState) =>
            currentState === "running" ? "paused" : "running",
          )
        }
      >
        <Clock3
          className={cn(
            "size-4",
            isPaused ? (isDark ? "text-red-300" : "text-red-600") : "text-primary",
          )}
          aria-hidden="true"
        />
        {timerLabel}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm font-medium shadow-sm",
        isDark
          ? "border-white/10 bg-white/[0.08] text-white"
          : "border-border bg-background text-foreground",
      )}
    >
      <Clock3 className="size-4 text-primary" aria-hidden="true" />
      {timerLabel}
    </div>
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}
