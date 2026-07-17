"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { CodeEditor } from "@/features/interview-room/components/CodeEditor";
import { ProblemPanel } from "@/features/interview-room/components/ProblemPanel";
import { RoomHeader } from "@/features/interview-room/components/RoomHeader";
import {
  MOCK_INTERVIEW_ROOM,
  getLanguageOption,
} from "@/features/interview-room/data/mockInterviewRoom";
import type {
  ConsoleLine,
  LanguageId,
  TestCase,
} from "@/features/interview-room/types/interview-room";
import { LiveKitProvider } from "@/features/livekit/components/LiveKitProvider";
import { MediaControls } from "@/features/livekit/components/MediaControls";
import { VideoGrid } from "@/features/livekit/components/VideoGrid";
import { getMockInterviewByRoomId } from "@/features/interview-workspace/data/mockInterviews";
import { useStoredInterviewRole } from "@/features/interview-workspace/hooks/use-stored-interview-role";
import type { InterviewRole } from "@/features/interview-workspace/types/interview";

type InterviewRoomProps = {
  roomId: string;
};

export function InterviewRoom({ roomId }: InterviewRoomProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const mockWorkspaceRoom = useMemo(
    () => getMockInterviewByRoomId(roomId),
    [roomId],
  );
  const fallbackRole: InterviewRole = mockWorkspaceRoom?.role ?? "CANDIDATE";
  const role = useStoredInterviewRole(roomId, fallbackRole);

  const [problemPaneWidth, setProblemPaneWidth] = useState(42);
  const [languageId, setLanguageId] = useState<LanguageId>("typescript");
  const selectedLanguage = getLanguageOption(languageId);
  const [code, setCode] = useState(selectedLanguage.initialCode);
  const [testCases, setTestCases] = useState<TestCase[]>(() =>
    MOCK_INTERVIEW_ROOM.testCases.map((testCase) => ({ ...testCase })),
  );
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>(() =>
    MOCK_INTERVIEW_ROOM.consoleLines.map((line) => ({ ...line })),
  );

  function handleLanguageChange(nextLanguageId: LanguageId) {
    const nextLanguage = getLanguageOption(nextLanguageId);

    setLanguageId(nextLanguageId);
    setCode(nextLanguage.initialCode);
    setTestCases(
      MOCK_INTERVIEW_ROOM.testCases.map((testCase) => ({ ...testCase })),
    );
    setConsoleLines([
      {
        id: `line-language-${nextLanguageId}`,
        level: "info",
        text: `${nextLanguage.label} starter loaded.`,
      },
    ]);
  }

  function handleRunCode() {
    setTestCases((currentCases) =>
      currentCases.map((testCase) => ({ ...testCase, status: "passed" })),
    );
    setConsoleLines([
      {
        id: "line-run-1",
        level: "info",
        text: `Running ${selectedLanguage.fileName} against 3 mock test cases...`,
      },
      {
        id: "line-run-2",
        level: "success",
        text: "All visible test cases passed in 42ms.",
      },
    ]);
    toast.success("Mock test run completed.");
  }

  function handleSubmit() {
    toast.success("Mock submission captured for interviewer review.");
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
    <main className="flex h-dvh flex-col overflow-hidden bg-neutral-900 text-white">
      <LiveKitProvider roomId={roomId} role={role}>
        <RoomHeader
          title={MOCK_INTERVIEW_ROOM.title}
          status={MOCK_INTERVIEW_ROOM.status}
          role={role}
          roomId={roomId}
          interviewerVideo={
            <VideoGrid compact remoteOnly maxTiles={1} className="justify-end" />
          }
          mediaControls={<MediaControls />}
        />

        <div className="relative min-h-0 flex-1 overflow-hidden p-3">
          <motion.div
            ref={workspaceRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full min-h-0 overflow-hidden rounded-lg border border-black/35 bg-neutral-900"
          >
            <div
              className="min-w-0"
              style={{ flex: `0 0 ${problemPaneWidth}%` }}
            >
              <ProblemPanel
                problem={MOCK_INTERVIEW_ROOM.problem}
                role={role}
                checklist={MOCK_INTERVIEW_ROOM.checklist}
                className="rounded-none border-0 border-r border-white/10 shadow-none"
              />
            </div>

            <div
              aria-label="Resize problem and compiler panes"
              aria-orientation="vertical"
              className="group grid w-2 shrink-0 cursor-col-resize touch-none place-items-center bg-neutral-900 transition-colors hover:bg-primary/15"
              onPointerDown={startHorizontalResize}
              role="separator"
              tabIndex={0}
            >
              <span className="h-12 w-0.5 rounded-full bg-white/15 transition-colors group-hover:bg-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <CodeEditor
                role={role}
                code={code}
                language={selectedLanguage}
                languages={MOCK_INTERVIEW_ROOM.languages}
                testCases={testCases}
                consoleLines={consoleLines}
                onCodeChange={setCode}
                onLanguageChange={handleLanguageChange}
                onRun={handleRunCode}
                onSubmit={handleSubmit}
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
