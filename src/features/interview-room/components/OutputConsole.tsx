"use client";

import { TerminalSquare } from "lucide-react";

import type { ConsoleLine } from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type OutputConsoleProps = {
  lines: ConsoleLine[];
};

export function OutputConsole({ lines }: OutputConsoleProps) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-black">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <TerminalSquare className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-white">Output console</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 font-mono text-xs leading-5">
        {lines.map((line) => (
          <p key={line.id} className={cn(lineColorClassName(line.level))}>
            <span className="text-neutral-600">$ </span>
            {line.text}
          </p>
        ))}
      </div>
    </section>
  );
}

function lineColorClassName(level: ConsoleLine["level"]) {
  if (level === "success") {
    return "text-emerald-300";
  }

  if (level === "error") {
    return "text-red-300";
  }

  return "text-neutral-300";
}
