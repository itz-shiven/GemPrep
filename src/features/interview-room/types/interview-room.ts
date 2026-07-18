import type { InterviewRole } from "@/features/interview-workspace/types/interview";

export type RoomRole = InterviewRole;

export type RoomStatus = "LIVE" | "PAUSED";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type LanguageId = "cpp" | "java" | "python" | "javascript";

export type LanguageOption = {
  id: LanguageId;
  label: string;
  monacoLanguage: string;
  fileName: string;
  initialCode: string;
};

export type ProblemExample = {
  input: string;
  output: string;
  explanation: string;
};

export type InterviewProblem = {
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  notes: string[];
};

export type TestCaseStatus = "idle" | "passed" | "failed";

export type TestCase = {
  id: string;
  label: string;
  input: string;
  expectedOutput: string;
  status: TestCaseStatus;
};

export type RoomParticipant = {
  id: string;
  name: string;
  role: RoomRole;
  status: "online" | "reviewing";
  cameraEnabled: boolean;
  micEnabled: boolean;
  isCurrentUser?: boolean;
};

export type ChatMessage = {
  id: string;
  author: string;
  role: RoomRole;
  timestamp: string;
  body: string;
};

export type InterviewChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type InterviewRoomMock = {
  title: string;
  status: RoomStatus;
  problem: InterviewProblem;
  testCases: TestCase[];
  chatMessages: ChatMessage[];
  checklist: InterviewChecklistItem[];
  languages: LanguageOption[];
};
