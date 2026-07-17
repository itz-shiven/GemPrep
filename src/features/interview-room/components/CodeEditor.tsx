"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";
import { Play, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OutputConsole } from "@/features/interview-room/components/OutputConsole";
import { TestCasePanel } from "@/features/interview-room/components/TestCasePanel";
import type {
  ConsoleLine,
  LanguageId,
  LanguageOption,
  RoomRole,
  TestCase,
} from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic<EditorProps>(
  () => import("@monaco-editor/react").then((module) => module.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-[24rem] place-items-center bg-neutral-950 font-mono text-sm text-neutral-500">
        Loading Monaco editor...
      </div>
    ),
  },
);

type CodeEditorProps = {
  role: RoomRole;
  code: string;
  language: LanguageOption;
  languages: LanguageOption[];
  testCases: TestCase[];
  consoleLines: ConsoleLine[];
  onCodeChange: (code: string) => void;
  onLanguageChange: (languageId: LanguageId) => void;
  onRun: () => void;
  onSubmit: () => void;
  className?: string;
};

export function CodeEditor({
  role,
  code,
  language,
  languages,
  testCases,
  consoleLines,
  onCodeChange,
  onLanguageChange,
  onRun,
  onSubmit,
  className,
}: CodeEditorProps) {
  const editorBodyRef = useRef<HTMLDivElement>(null);
  const [testPaneHeight, setTestPaneHeight] = useState(30);
  const readOnly = role === "INTERVIEWER";
  const editorOptions: EditorProps["options"] = {
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 13,
    fontFamily:
      '"Cascadia Code", "SFMono-Regular", "Roboto Mono", Consolas, monospace',
    lineHeight: 22,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    tabSize: 2,
    padding: { top: 16, bottom: 16 },
    readOnly,
    renderLineHighlight: "all",
    overviewRulerBorder: false,
  };

  function handleLanguageChange(value: string) {
    const nextLanguage = languages.find((option) => option.id === value);

    if (nextLanguage) {
      onLanguageChange(nextLanguage.id);
    }
  }

  function startVerticalResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const container = editorBodyRef.current;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();

    function handlePointerMove(moveEvent: PointerEvent) {
      const distanceFromBottom = rect.bottom - moveEvent.clientY;
      const nextHeight = (distanceFromBottom / rect.height) * 100;
      setTestPaneHeight(clamp(nextHeight, 20, 54));
    }

    function stopResize() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize, { once: true });
  }

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-black text-white shadow-2xl",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {readOnly ? "Candidate code view" : language.fileName}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {readOnly ? "Read-only interview review mode" : "Live coding workspace"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={language.id}
            onChange={(event) => handleLanguageChange(event.target.value)}
            disabled={readOnly}
            aria-label="Select coding language"
            className="focus-ring h-9 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-neutral-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {languages.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
            onClick={onRun}
          >
            <Play className="size-4" />
            {readOnly ? "Run snapshot" : "Run"}
          </Button>
          {role === "CANDIDATE" ? (
            <Button type="button" onClick={onSubmit}>
              <SendHorizontal className="size-4" />
              Submit
            </Button>
          ) : null}
        </div>
      </div>

      <div ref={editorBodyRef} className="flex min-h-0 flex-1 flex-col">
        <div
          className="min-h-0 overflow-hidden bg-black"
          style={{ flex: `1 1 ${100 - testPaneHeight}%` }}
        >
          <MonacoEditor
            height="100%"
            language={language.monacoLanguage}
            path={language.fileName}
            value={code}
            theme="vs-dark"
            options={editorOptions}
            onChange={(value) => onCodeChange(value ?? "")}
          />
        </div>

        <div
          aria-label="Resize editor and test case panes"
          aria-orientation="horizontal"
          className="group grid h-2 shrink-0 cursor-row-resize touch-none place-items-center border-y border-white/10 bg-neutral-900 transition-colors hover:bg-primary/15"
          onPointerDown={startVerticalResize}
          role="separator"
          tabIndex={0}
        >
          <span className="h-0.5 w-12 rounded-full bg-white/15 transition-colors group-hover:bg-primary" />
        </div>

        <div
          className="min-h-0 shrink-0 overflow-hidden bg-black"
          style={{ flexBasis: `${testPaneHeight}%` }}
        >
          <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2 p-2.5">
            <TestCasePanel testCases={testCases} />
            <OutputConsole lines={consoleLines} />
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
