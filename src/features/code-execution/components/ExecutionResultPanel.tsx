"use client";

import { TerminalSquare } from "lucide-react";

import { TestCaseResult } from "@/features/code-execution/components/TestCaseResult";
import type { CodeExecutionResult } from "@/features/code-execution/types/execution";

type ExecutionResultPanelProps = {
  error: string | null;
  isRunning: boolean;
  results: CodeExecutionResult[];
};

export function ExecutionResultPanel({
  error,
  isRunning,
  results,
}: ExecutionResultPanelProps) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-black">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <TerminalSquare className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-white">Execution results</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {isRunning ? (
          <EmptyResultState text="Running code against current test cases..." />
        ) : null}

        {!isRunning && error ? (
          <div className="rounded-md border border-red-400/20 bg-red-500/[0.08] p-3 text-sm leading-6 text-red-200">
            {error}
          </div>
        ) : null}

        {!isRunning && !error && results.length === 0 ? (
          <EmptyResultState text="Run code to see expected and received output." />
        ) : null}

        {!isRunning && !error && results.length > 0 ? (
          <div className="space-y-2">
            {results.map((result) => (
              <TestCaseResult key={result.id} result={result} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EmptyResultState({ text }: { text: string }) {
  return (
    <div className="grid h-full min-h-24 place-items-center rounded-md border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-neutral-500">
      {text}
    </div>
  );
}
