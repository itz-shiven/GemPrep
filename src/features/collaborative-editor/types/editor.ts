import type { editor } from "monaco-editor";

import type {
  CodeExecutionTestCase,
  CodeExecutionResult,
  NewCodeExecutionTestCase,
} from "@/features/code-execution/types/execution";
import type {
  InterviewRoomTheme,
  LanguageId,
  LanguageOption,
  RoomRole,
} from "@/features/interview-room/types/interview-room";

export type CollaborativeEditorUser = {
  id: string;
  name: string;
  role: RoomRole;
};

export type CollaborationStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

export type CollaborativeEditorProps = {
  roomId: string;
  user: CollaborativeEditorUser;
  language: LanguageOption;
  testCases: CodeExecutionTestCase[];
  executionError: string | null;
  executionResults: CodeExecutionResult[];
  isRunningCode: boolean;
  canModifyTestCases: boolean;
  theme: InterviewRoomTheme;
  onLanguageChange: (languageId: LanguageId) => void;
  onAddTestCase: (testCase: NewCodeExecutionTestCase) => void;
  onRunCode: (sourceCode: string) => void;
  className?: string;
};

export type MonacoEditorInstance = editor.IStandaloneCodeEditor;
