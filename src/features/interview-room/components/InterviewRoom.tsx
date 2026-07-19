"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { RunCodeButton } from "@/features/code-execution/components/RunCodeButton";
import { useCodeExecution } from "@/features/code-execution/hooks/useCodeExecution";
import { CollaborativeEditor } from "@/features/collaborative-editor/components/CollaborativeEditor";
import type { CollaborativeEditorUser } from "@/features/collaborative-editor/types/editor";
import type { NewCodeExecutionTestCase } from "@/features/code-execution/types/execution";
import { LanguageSelector } from "@/features/collaborative-editor/components/LanguageSelector";
import { ProblemPanel } from "@/features/interview-room/components/ProblemPanel";
import { RoomHeader } from "@/features/interview-room/components/RoomHeader";
import {
  MOCK_INTERVIEW_ROOM,
  getLanguageOption,
} from "@/features/interview-room/data/mockInterviewRoom";
import type {
  InterviewRoomTheme,
  LanguageId,
  TestCase,
} from "@/features/interview-room/types/interview-room";
import { LiveKitProvider } from "@/features/livekit/components/LiveKitProvider";
import { VideoGrid } from "@/features/livekit/components/VideoGrid";
import { getMockInterviewByRoomId } from "@/features/interview-workspace/data/mockInterviews";
import { useStoredInterviewRole } from "@/features/interview-workspace/hooks/use-stored-interview-role";
import type { InterviewRole } from "@/features/interview-workspace/types/interview";
import { cn } from "@/lib/utils";

type InterviewRoomProps = {
  roomId: string;
  currentUser: Omit<CollaborativeEditorUser, "role">;
};

export function InterviewRoom({ roomId, currentUser }: InterviewRoomProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const mockWorkspaceRoom = useMemo(
    () => getMockInterviewByRoomId(roomId),
    [roomId],
  );
  const fallbackRole: InterviewRole = mockWorkspaceRoom?.role ?? "CANDIDATE";
  const role = useStoredInterviewRole(roomId, fallbackRole);
  const collaborativeUser: CollaborativeEditorUser = {
    ...currentUser,
    role,
  };

  const [problemPaneWidth, setProblemPaneWidth] = useState(42);
  const [languageId, setLanguageId] = useState<LanguageId>("cpp");
  const [theme, setTheme] = useState<InterviewRoomTheme>("dark");
  const selectedLanguage = getLanguageOption(languageId);
  const [testCases, setTestCases] = useState<TestCase[]>(() =>
    MOCK_INTERVIEW_ROOM.testCases.map((testCase) => ({ ...testCase })),
  );
  const { error, isRunning, resetResults, results, runCode } =
    useCodeExecution();
  const isDark = theme === "dark";

  function handleLanguageChange(nextLanguageId: LanguageId) {
    setLanguageId(nextLanguageId);
    resetResults();
  }

  function handleRunCode(sourceCode: string) {
    void runCode({
      language: selectedLanguage.id,
      sourceCode,
      testCases: testCases.map((testCase) => ({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
      })),
    });
  }

  function handleAddTestCase(testCase: NewCodeExecutionTestCase) {
    if (role !== "INTERVIEWER") {
      return;
    }

    resetResults();
    setTestCases((currentTestCases) => [
      ...currentTestCases,
      {
        id: createTestCaseId(),
        label: `Test Case ${currentTestCases.length + 1}`,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        status: "idle",
      },
    ]);
    toast.success("Test case added for this interview session.");
  }

  function startHorizontalResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const container = workspaceRef.current;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();

    function handlePointerMove(moveEvent: PointerEvent) {
      const nextWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      setProblemPaneWidth(clamp(nextWidth, 28, 64));
    }

    function stopResize() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize, { once: true });
  }

  return (
    <main
      className={cn(
        "flex h-dvh flex-col overflow-hidden",
        isDark ? "bg-neutral-800 text-white" : "bg-neutral-200 text-foreground",
      )}
    >
      <LiveKitProvider roomId={roomId} role={role}>
        <RoomHeader
          role={role}
          theme={theme}
          onToggleTheme={() =>
            setTheme((currentTheme) =>
              currentTheme === "dark" ? "light" : "dark",
            )
          }
          interviewerVideo={
            <VideoGrid compact remoteOnly maxTiles={1} />
          }
          runCodeAction={
            <RunCodeButton
              isRunning={isRunning}
              theme={theme}
              onRun={() => {
                const trigger = document.querySelector<HTMLButtonElement>(
                  "[data-run-code-trigger]",
                );
                trigger?.click();
              }}
            />
          }
        />

        <div
          className={cn(
            "relative min-h-0 flex-1 overflow-hidden p-3",
            isDark ? "bg-neutral-800" : "bg-neutral-200",
          )}
        >
          <motion.div
            ref={workspaceRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "flex h-full min-h-0 overflow-hidden rounded-lg border",
              isDark
                ? "border-neutral-700 bg-neutral-800"
                : "border-neutral-300 bg-neutral-200",
            )}
          >
            <div
              className="min-w-0"
              style={{ flex: `0 0 ${problemPaneWidth}%` }}
            >
              <ProblemPanel
                problem={MOCK_INTERVIEW_ROOM.problem}
                role={role}
                checklist={MOCK_INTERVIEW_ROOM.checklist}
                languageSelector={
                  <LanguageSelector
                    value={selectedLanguage.id}
                    languages={MOCK_INTERVIEW_ROOM.languages}
                    disabled={role !== "CANDIDATE"}
                    theme={theme}
                    onChange={handleLanguageChange}
                  />
                }
                theme={theme}
                className={cn(
                  "rounded-none border-0 border-r shadow-none",
                  isDark ? "border-white/10" : "border-neutral-300",
                )}
              />
            </div>

            <div
              aria-label="Resize problem and compiler panes"
              aria-orientation="vertical"
              className={cn(
                "group grid w-2 shrink-0 cursor-col-resize touch-none place-items-center transition-colors",
                isDark
                  ? "bg-neutral-800 hover:bg-primary/15"
                  : "bg-neutral-200 hover:bg-primary/10",
              )}
              onPointerDown={startHorizontalResize}
              role="separator"
              tabIndex={0}
            >
              <span
                className={cn(
                  "h-12 w-0.5 rounded-full transition-colors group-hover:bg-primary",
                  isDark ? "bg-white/15" : "bg-neutral-400",
                )}
              />
            </div>

            <div className="min-w-0 flex-1">
              <CollaborativeEditor
                roomId={roomId}
                user={collaborativeUser}
                language={selectedLanguage}
                testCases={testCases}
                executionError={error}
                executionResults={results}
                isRunningCode={isRunning}
                canModifyTestCases={role === "INTERVIEWER"}
                theme={theme}
                onLanguageChange={handleLanguageChange}
                onAddTestCase={handleAddTestCase}
                onRunCode={handleRunCode}
                className="rounded-none border-0 shadow-none"
              />
            </div>
          </motion.div>
        </div>
      </LiveKitProvider>
    </main>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createTestCaseId() {
  return globalThis.crypto?.randomUUID() ?? `case-${Date.now()}`;
}
