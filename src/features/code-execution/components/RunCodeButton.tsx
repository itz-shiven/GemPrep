"use client";

import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { InterviewRoomTheme } from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type RunCodeButtonProps = {
  isRunning: boolean;
  theme?: InterviewRoomTheme;
  onRun: () => void;
};

export function RunCodeButton({
  isRunning,
  theme = "dark",
  onRun,
}: RunCodeButtonProps) {
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        isDark
          ? "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
          : "border-border bg-background text-foreground hover:bg-secondary",
      )}
      onClick={onRun}
      disabled={isRunning}
    >
      {isRunning ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Play className="size-4" aria-hidden="true" />
      )}
      {isRunning ? "Running" : "Run Code"}
    </Button>
  );
}
