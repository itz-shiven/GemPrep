"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import type { CodeExecutionResult } from "@/features/code-execution/types/execution";
import type { InterviewRoomTheme } from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type TestCaseResultProps = {
  result: CodeExecutionResult;
  theme?: InterviewRoomTheme;
};

export function TestCaseResult({ result, theme = "dark" }: TestCaseResultProps) {
  const isDark = theme === "dark";

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
        <p
          className={cn(
            "text-xs font-semibold",
            isDark ? "text-neutral-100" : "text-foreground",
          )}
        >
          {result.label} {result.passed ? "Passed" : "Failed"}
        </p>
        <span
          className={cn(
            "ml-auto text-[11px]",
            isDark ? "text-neutral-500" : "text-muted-foreground",
          )}
        >
          {result.status}
        </span>
      </div>

      <div className="mt-2 grid gap-2 text-[11px] sm:grid-cols-2">
        <ResultBlock
          label="Expected"
          value={result.expectedOutput}
          theme={theme}
        />
        <ResultBlock
          label="Received"
          value={result.actualOutput || "(no output)"}
          theme={theme}
        />
      </div>

      {result.compile_output || result.stderr ? (
        <div className="mt-2 grid gap-2 text-[11px]">
          {result.compile_output ? (
            <ResultBlock
              label="Compiler output"
              value={result.compile_output}
              theme={theme}
            />
          ) : null}
          {result.stderr ? (
            <ResultBlock
              label="Runtime stderr"
              value={result.stderr}
              theme={theme}
            />
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ResultBlock({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: InterviewRoomTheme;
}) {
  const isDark = theme === "dark";

  return (
    <div>
      <p
        className={cn(
          "font-medium",
          isDark ? "text-neutral-500" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <pre
        className={cn(
          "mt-1 whitespace-pre-wrap break-words rounded p-2 font-mono",
          isDark ? "bg-black/45 text-neutral-200" : "bg-background text-foreground",
        )}
      >
        {value}
      </pre>
    </div>
  );
}
