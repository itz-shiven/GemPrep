// Supported programming languages for the code editor
export const SUPPORTED_LANGUAGES = [
  { id: "python", label: "Python", monaco: "python", piston: "python", version: "3.10.0" },
  { id: "javascript", label: "JavaScript", monaco: "javascript", piston: "javascript", version: "18.15.0" },
  { id: "cpp", label: "C++", monaco: "cpp", piston: "c++", version: "10.2.0" },
  { id: "java", label: "Java", monaco: "java", piston: "java", version: "15.0.2" },
  { id: "c", label: "C", monaco: "c", piston: "c", version: "10.2.0" },
] as const;

export type SupportedLanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

// Interview phase configuration
export const INTERVIEW_PHASES = {
  INTRO: { label: "Introduction", duration: 5 * 60 },
  CODING: { label: "DSA Coding Round", duration: 40 * 60 },
  DISCUSSION: { label: "Discussion", duration: 15 * 60 },
  ENDED: { label: "Ended", duration: 0 },
} as const;

export type InterviewPhase = keyof typeof INTERVIEW_PHASES;

// Question difficulty levels
export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

// Routes
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/dashboard",
  INTERVIEW: (roomId: string) => `/interview/${roomId}`,
  WAITING_ROOM: (roomId: string) => `/interview/${roomId}/waiting`,
  SESSION: (roomId: string) => `/interview/${roomId}/session`,
  FEEDBACK: (roomId: string) => `/interview/${roomId}/feedback`,
} as const;

// Feedback categories
export const INTERVIEWER_FEEDBACK_CATEGORIES = [
  { key: "technicalSkills", label: "Technical Skills", description: "DSA knowledge and coding ability" },
  { key: "communication", label: "Communication", description: "Clarity of thought and explanation" },
  { key: "problemSolving", label: "Problem Solving", description: "Approach and methodology" },
  { key: "confidence", label: "Confidence", description: "Composure and self-assurance" },
] as const;

export const CANDIDATE_FEEDBACK_CATEGORIES = [
  { key: "professionalism", label: "Professionalism", description: "Conduct and demeanor" },
  { key: "helpfulness", label: "Helpfulness", description: "Guidance and support quality" },
  { key: "communication", label: "Communication", description: "Clarity and effectiveness" },
  { key: "overallExperience", label: "Overall Experience", description: "Overall interview quality" },
] as const;

// Piston API
export const PISTON_API_URL = "https://emkc.org/api/v2/piston";

// WebRTC
export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];
