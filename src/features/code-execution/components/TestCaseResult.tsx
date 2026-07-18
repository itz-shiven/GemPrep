"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import type { CodeExecutionResult } from "@/features/code-execution/types/execution";
import { cn } from "@/lib/utils";

type TestCaseResultProps = {
  result: CodeExecutionResult;
};

export function TestCaseResult({ result }: TestCaseResultProps) {
  return (
    <article
      className={cn(
        "rounded-md border p-2.5",
        result.passed
          ? "border-emerald-400/20 bg-emerald-500/[0.08]"
          : "border-red-400/20 bg-red-500/[0.08]",
      )}
    >
      <div className="flex items-center gap-2">
        {result.passed ? (
          <CheckCircle2 className="size-4 text-emerald-300" aria-hidden="true" />
        ) : (
          <XCircle className="size-4 text-red-300" aria-hidden="true" />
        )}
        <p className="text-xs font-semibold text-neutral-100">
          {result.label} {result.passed ? "Passed" : "Failed"}
        </p>
        <span className="ml-auto text-[11px] text-neutral-500">
          {result.status}
        </span>
      </div>

      <div className="mt-2 grid gap-2 text-[11px] sm:grid-cols-2">
        <ResultBlock label="Expected" value={result.expectedOutput} />
        <ResultBlock
          label="Received"
          value={result.actualOutput || "(no output)"}
        />
      </div>

      {result.compile_output || result.stderr ? (
        <div className="mt-2 grid gap-2 text-[11px]">
          {result.compile_output ? (
            <ResultBlock label="Compiler output" value={result.compile_output} />
          ) : null}
          {result.stderr ? (
            <ResultBlock label="Runtime stderr" value={result.stderr} />
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ResultBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-neutral-500">{label}</p>
      <pre className="mt-1 whitespace-pre-wrap break-words rounded bg-black/45 p-2 font-mono text-neutral-200">
        {value}
      </pre>
    </div>
  );
}
