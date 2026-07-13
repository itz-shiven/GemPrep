export type { InterviewPhase, SupportedLanguageId, Difficulty } from "@/constants";

// User types
export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

// Resume types
export interface ResumeData {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: Date;
}

// Room types
export type RoomStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type RoomType = "PUBLIC" | "PRIVATE";
export type ParticipantRole = "INTERVIEWER" | "CANDIDATE";

export interface InterviewRoomData {
  id: string;
  code: string;
  type: RoomType;
  status: RoomStatus;
  interviewType: string;
  createdAt: Date;
  participants: ParticipantData[];
  interview?: InterviewData | null;
}

export interface ParticipantData {
  id: string;
  roomId: string;
  userId: string;
  role: ParticipantRole;
  isReady: boolean;
  joinedAt: Date;
  user: UserProfile;
}

export interface InterviewData {
  id: string;
  roomId: string;
  currentPhase: "INTRO" | "CODING" | "DISCUSSION" | "ENDED";
  phaseStartedAt: Date | null;
  startedAt: Date;
  endedAt: Date | null;
  code: string | null;
  language: string;
  questionId: string | null;
  question?: InterviewQuestionData | null;
}

export interface InterviewQuestionData {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  starterCode: string | null;
  tags: string[];
}

// Feedback types
export interface FeedbackRatings {
  [key: string]: number;
}

export interface FeedbackData {
  id: string;
  interviewId: string;
  reviewerId: string;
  revieweeId: string;
  role: ParticipantRole;
  ratings: FeedbackRatings;
  comments: string | null;
  createdAt: Date;
}

// AI types
export interface AISuggestionData {
  id: string;
  interviewId: string;
  content: string;
  createdAt: Date;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// WebRTC types
export interface SignalData {
  type: "offer" | "answer" | "ice-candidate";
  payload: RTCSessionDescriptionInit | RTCIceCandidateInit;
  from: string;
}

// Device status for Waiting Room
export interface DeviceStatus {
  camera: boolean;
  microphone: boolean;
  internet: boolean;
}
