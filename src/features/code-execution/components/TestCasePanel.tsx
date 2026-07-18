"use client";

import { FlaskConical } from "lucide-react";

import { AddTestCaseModal } from "@/features/code-execution/components/AddTestCaseModal";
import type {
  CodeExecutionTestCase,
  NewCodeExecutionTestCase,
} from "@/features/code-execution/types/execution";

type TestCasePanelProps = {
  testCases: CodeExecutionTestCase[];
  onAddTestCase: (testCase: NewCodeExecutionTestCase) => void;
};

export function TestCasePanel({
  testCases,
  onAddTestCase,
}: TestCasePanelProps) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-black">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Test cases</h2>
        </div>
        <AddTestCaseModal onAddTestCase={onAddTestCase} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="grid gap-2 lg:grid-cols-3">
          {testCases.map((testCase) => (
            <article
              key={testCase.id}
              className="rounded-md border border-white/10 bg-white/[0.04] p-2.5"
            >
              <p className="truncate text-xs font-semibold text-neutral-100">
                {testCase.label}
              </p>
              <div className="mt-2 space-y-1.5 text-[11px] text-neutral-400">
                <div>
                  <p className="font-medium text-neutral-500">Input</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words rounded bg-black/35 p-1.5 font-mono text-neutral-200">
                    {testCase.input}
                  </pre>
                </div>
                <div>
                  <p className="font-medium text-neutral-500">Expected</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words rounded bg-black/35 p-1.5 font-mono text-neutral-200">
                    {testCase.expectedOutput}
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
