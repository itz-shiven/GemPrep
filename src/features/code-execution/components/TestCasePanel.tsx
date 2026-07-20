"use client";

import { CheckSquare, Plus, TerminalSquare } from "lucide-react";
import { useMemo, useState } from "react";

import { AddTestCaseModal } from "@/features/code-execution/components/AddTestCaseModal";
import { TestCaseResult } from "@/features/code-execution/components/TestCaseResult";
import type {
  CodeExecutionResult,
  CodeExecutionTestCase,
  NewCodeExecutionTestCase,
} from "@/features/code-execution/types/execution";
import type { InterviewRoomTheme } from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type TestCasePanelProps = {
  testCases: CodeExecutionTestCase[];
  executionError: string | null;
  executionResults: CodeExecutionResult[];
  isRunning: boolean;
  canModifyTestCases: boolean;
  theme: InterviewRoomTheme;
  onAddTestCase: (testCase: NewCodeExecutionTestCase) => void;
};

export function TestCasePanel({
  testCases,
  executionError,
  executionResults,
  isRunning,
  canModifyTestCases,
  theme,
  onAddTestCase,
}: TestCasePanelProps) {
  const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const isDark = theme === "dark";
  const activeTestCase = testCases[activeCaseIndex] ?? testCases[0];
  const activeResult = useMemo(
    () =>
      activeTestCase
        ? executionResults.find((result) => result.input === activeTestCase.input)
        : undefined,
    [activeTestCase, executionResults],
  );

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border shadow-2xl",
        isDark
          ? "border-white/10 bg-[#262626]"
          : "border-neutral-300 bg-background",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-8 border-b px-5 py-3",
          isDark ? "border-white/5 bg-[#303030]" : "border-border bg-neutral-100",
        )}
      >
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 text-base font-semibold transition-colors",
            activeTab === "testcase"
              ? isDark
                ? "text-white"
                : "text-foreground"
              : "text-muted-foreground",
          )}
          onClick={() => setActiveTab("testcase")}
        >
          <CheckSquare
            className={cn(
              "size-5",
              activeTab === "testcase" ? "text-emerald-500" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
          Testcase
        </button>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 text-base font-semibold transition-colors",
            activeTab === "result"
              ? isDark
                ? "text-white"
                : "text-foreground"
              : "text-muted-foreground",
          )}
          onClick={() => setActiveTab("result")}
        >
          <TerminalSquare
            className={cn(
              "size-5",
              activeTab === "result" ? "text-emerald-500" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
          Test Result
        </button>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden p-5",
          isDark ? "bg-[#262626]" : "bg-background",
        )}
      >
        <div className="flex shrink-0 items-center gap-4">
          {testCases.map((testCase, index) => (
            <button
              key={testCase.id}
              type="button"
              className={cn(
                "h-11 rounded-xl px-5 text-sm font-semibold transition-colors",
                index === activeCaseIndex
                  ? isDark
                    ? "bg-white/10 text-white"
                    : "bg-secondary text-foreground"
                  : isDark
                    ? "text-neutral-300 hover:bg-white/[0.06] hover:text-white"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              onClick={() => setActiveCaseIndex(index)}
            >
              Case {index + 1}
            </button>
          ))}
          {canModifyTestCases ? (
            <AddTestCaseModal
              onAddTestCase={(testCase) => {
                onAddTestCase(testCase);
                setActiveCaseIndex(testCases.length);
                setActiveTab("testcase");
              }}
              trigger={
                <button
                  type="button"
                  className={cn(
                    "grid size-10 place-items-center rounded-xl transition-colors",
                    isDark
                      ? "text-neutral-500 hover:bg-white/[0.06] hover:text-white"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                  aria-label="Add test case"
                >
                  <Plus className="size-5" aria-hidden="true" />
                </button>
              }
            />
          ) : null}
        </div>

        <div className="interview-scrollbar mt-5 min-h-0 flex-1 basis-0 overflow-y-scroll overflow-x-hidden pr-2 [scrollbar-gutter:stable]">
          {activeTab === "testcase" ? (
            activeTestCase ? (
              <TestCaseView testCase={activeTestCase} theme={theme} />
            ) : (
              <EmptyPanel text="No test cases are available." theme={theme} />
            )
          ) : (
            <ResultView
              error={executionError}
              isRunning={isRunning}
              result={activeResult}
              hasResults={executionResults.length > 0}
              theme={theme}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function TestCaseView({
  testCase,
  theme,
}: {
  testCase: CodeExecutionTestCase;
  theme: InterviewRoomTheme;
}) {
  const isDark = theme === "dark";

  return (
    <div className="space-y-5 pb-5">
      <div>
        <p
          className={cn(
            "text-sm font-semibold",
            isDark ? "text-neutral-300" : "text-muted-foreground",
          )}
        >
          Input
        </p>
        <pre
          className={cn(
            "mt-3 min-h-16 whitespace-pre-wrap rounded-lg px-5 py-4 font-mono text-base leading-6",
            isDark ? "bg-white/10 text-white" : "bg-secondary text-foreground",
          )}
        >
          {testCase.input}
        </pre>
      </div>
      <div>
        <p
          className={cn(
            "text-sm font-semibold",
            isDark ? "text-neutral-300" : "text-muted-foreground",
          )}
        >
          Expected
        </p>
        <pre
          className={cn(
            "mt-3 min-h-14 whitespace-pre-wrap rounded-lg px-5 py-4 font-mono text-base leading-6",
            isDark ? "bg-white/10 text-white" : "bg-secondary text-foreground",
          )}
        >
          {testCase.expectedOutput}
        </pre>
      </div>
    </div>
  );
}

function ResultView({
  error,
  isRunning,
  result,
  hasResults,
  theme,
}: {
  error: string | null;
  isRunning: boolean;
  result?: CodeExecutionResult;
  hasResults: boolean;
  theme: InterviewRoomTheme;
}) {
  const isDark = theme === "dark";

  if (isRunning) {
    return (
      <EmptyPanel text="Running code against current test cases..." theme={theme} />
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border p-4 text-sm leading-6",
          isDark
            ? "border-red-400/20 bg-red-500/[0.08] text-red-200"
            : "border-red-200 bg-red-50 text-red-700",
        )}
      >
        {error}
      </div>
    );
  }

  if (!hasResults) {
    return (
      <EmptyPanel text="Run code to see expected and received output." theme={theme} />
    );
  }

  if (!result) {
    return <EmptyPanel text="No result is available for this case." theme={theme} />;
  }

  return <TestCaseResult result={result} theme={theme} />;
}

function EmptyPanel({
  text,
  theme,
}: {
  text: string;
  theme: InterviewRoomTheme;
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "grid h-full min-h-24 place-items-center rounded-lg border p-4 text-center text-sm",
        isDark
          ? "border-white/10 bg-white/[0.03] text-neutral-500"
          : "border-border bg-secondary/50 text-muted-foreground",
      )}
    >
      {text}
    </div>
  );
}
