import type { InterviewRole } from "@/features/interview-workspace/types/interview";

export type LiveKitCredentials = {
  token: string;
  serverUrl: string;
  roomName: string;
  identity: string;
};

export type LiveKitTokenRequest = {
  roomId: string;
  role: InterviewRole;
};
