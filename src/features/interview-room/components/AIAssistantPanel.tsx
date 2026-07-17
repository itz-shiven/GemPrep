"use client";

import { Bot, Sparkles } from "lucide-react";

export function AIAssistantPanel() {
  return (
    <div className="grid min-h-[24rem] place-items-center rounded-lg border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Bot className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-sm font-semibold text-white">AI Assistant</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Prompting, hints, rubric support, and feedback summaries will connect
          here in a later phase.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-neutral-300">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          Placeholder mode
        </div>
      </div>
    </div>
  );
}
