"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { EditorProps, OnMount } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";

import { TestCasePanel } from "@/features/code-execution/components/TestCasePanel";
import { useCollaborativeEditor } from "@/features/collaborative-editor/hooks/useCollaborativeEditor";
import type {
  CollaborativeEditorProps,
  MonacoEditorInstance,
} from "@/features/collaborative-editor/types/editor";
import type { LanguageId } from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic<EditorProps>(
  () => import("@monaco-editor/react").then((module) => module.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-[24rem] place-items-center bg-neutral-950 font-mono text-sm text-neutral-500">
        Loading collaborative editor...
      </div>
    ),
  },
);

export function CollaborativeEditor({
  roomId,
  user,
  language,
  testCases,
  executionError,
  executionResults,
  isRunningCode,
  canModifyTestCases,
  theme,
  onLanguageChange,
  onAddTestCase,
  onRunCode,
  className,
}: CollaborativeEditorProps) {
  const editorBodyRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const lastSharedLanguageRef = useRef<LanguageId>(language.id);
  const [testPaneHeight, setTestPaneHeight] = useState(30);
  const canEdit = user.role === "CANDIDATE";
  const isDark = theme === "dark";
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
    readOnly: !canEdit,
    renderLineHighlight: "all",
    overviewRulerBorder: false,
  };
  const {
    bindEditor,
    destroyBinding,
    setSharedLanguage,
  } = useCollaborativeEditor({
    roomId,
    language,
    canEdit,
    onRemoteLanguageChange: onLanguageChange,
  });

  const handleMount: OnMount = (editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;
    bindEditor(editorInstance, monacoInstance);
  };

  useEffect(() => () => destroyBinding(), [destroyBinding]);

  useEffect(() => {
    if (!canEdit) {
      lastSharedLanguageRef.current = language.id;
      return;
    }

    if (lastSharedLanguageRef.current === language.id) {
      return;
    }

    lastSharedLanguageRef.current = language.id;
    setSharedLanguage(language.id);
  }, [canEdit, language.id, setSharedLanguage]);

  useEffect(() => {
    const editorModel = editorRef.current?.getModel();

    if (editorModel && monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(
        editorModel,
        language.monacoLanguage,
      );
    }
  }, [language.monacoLanguage]);

  function handleRunCode() {
    const sourceCode = editorRef.current?.getValue() ?? "";
    onRunCode(sourceCode);
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
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border shadow-2xl",
        isDark
          ? "border-white/10 bg-black text-white"
          : "border-neutral-300 bg-background text-foreground",
        className,
      )}
    >
      <button
        type="button"
        data-run-code-trigger
        className="pointer-events-none fixed -left-[9999px] -top-[9999px] size-px opacity-0"
        onClick={handleRunCode}
        disabled={isRunningCode}
        tabIndex={-1}
      >
        Run Code
      </button>

      <div ref={editorBodyRef} className="flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "min-h-0 overflow-hidden",
            isDark ? "bg-[#1f1f1f]" : "bg-white",
          )}
          style={{ flex: `1 1 ${100 - testPaneHeight}%` }}
        >
          <MonacoEditor
            height="100%"
            language={language.monacoLanguage}
            path={`gemprep-${roomId}-shared-code`}
            theme={isDark ? "vs-dark" : "vs"}
            options={editorOptions}
            onMount={handleMount}
          />
        </div>

        <div
          aria-label="Resize editor and test case panes"
          aria-orientation="horizontal"
          className={cn(
            "group grid h-2 shrink-0 cursor-row-resize touch-none place-items-center border-y transition-colors",
            isDark
              ? "border-white/10 bg-neutral-900 hover:bg-primary/15"
              : "border-neutral-300 bg-neutral-100 hover:bg-primary/10",
          )}
          onPointerDown={startVerticalResize}
          role="separator"
          tabIndex={0}
        >
          <span
            className={cn(
              "h-0.5 w-12 rounded-full transition-colors group-hover:bg-primary",
              isDark ? "bg-white/15" : "bg-neutral-400",
            )}
          />
        </div>

        <div
          className={cn(
            "min-h-0 shrink-0 overflow-hidden",
            isDark ? "bg-[#1f1f1f]" : "bg-white",
          )}
          style={{ flexBasis: `${testPaneHeight}%` }}
        >
          <div className="h-full min-h-0 p-2.5">
            <TestCasePanel
              testCases={testCases}
              executionError={executionError}
              executionResults={executionResults}
              isRunning={isRunningCode}
              canModifyTestCases={canModifyTestCases}
              theme={theme}
              onAddTestCase={(testCase) => {
                onAddTestCase(testCase);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
