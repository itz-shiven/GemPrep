"use client";

import { CheckCircle2, Circle, XCircle } from "lucide-react";

import type {
  TestCase,
  TestCaseStatus,
} from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type TestCasePanelProps = {
  testCases: TestCase[];
};

export function TestCasePanel({ testCases }: TestCasePanelProps) {
  return (
    <section className="min-h-0 overflow-hidden rounded-lg border border-white/10 bg-black">
      <div className="border-b border-white/10 px-3 py-2">
        <h2 className="text-sm font-semibold text-white">Test cases</h2>
      </div>
      <div className="grid gap-2 overflow-hidden p-2 md:grid-cols-3">
        {testCases.map((testCase) => (
          <article
            key={testCase.id}
            className="rounded-md border border-white/10 bg-white/[0.04] p-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-semibold text-neutral-100">
                {testCase.label}
              </p>
              <StatusIcon status={testCase.status} />
            </div>
            <p className="mt-2 truncate font-mono text-[11px] text-neutral-400">
              {testCase.input}
            </p>
            <p className="mt-1 font-mono text-[11px] text-neutral-500">
              Expected: {testCase.expectedOutput}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatusIcon({ status }: { status: TestCaseStatus }) {
  if (status === "passed") {
    return <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />;
  }

  if (status === "failed") {
    return <XCircle className="size-4 text-red-400" aria-hidden="true" />;
  }

  return (
    <Circle
      className={cn("size-4 text-neutral-600")}
      aria-hidden="true"
    />
  );
}
