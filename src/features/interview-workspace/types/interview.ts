export type InterviewRole = "INTERVIEWER" | "CANDIDATE";

export type InterviewStatus = "CREATED" | "WAITING" | "READY";

export type InterviewType =
  | "Data structures mock"
  | "System design mock"
  | "Frontend fundamentals";

export type MockInterviewRoom = {
  roomId: string;
  link: string;
  role: InterviewRole;
  status: InterviewStatus;
  type: InterviewType;
  duration: string;
};

export type GeneratedInterview = {
  roomId: string;
  link: string;
  role: InterviewRole;
  status: InterviewStatus;
};

export const INTERVIEW_ROLE_LABELS: Record<InterviewRole, string> = {
  INTERVIEWER: "Interviewer",
  CANDIDATE: "Candidate",
};

export const INTERVIEW_ROOM_STORAGE_PREFIX = "gemprep.interview-room";
