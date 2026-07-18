"use client";

import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

type RunCodeButtonProps = {
  isRunning: boolean;
  onRun: () => void;
};

export function RunCodeButton({ isRunning, onRun }: RunCodeButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
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
