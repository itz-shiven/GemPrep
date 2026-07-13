// Application-wide configuration
export const APP_CONFIG = {
  name: "GemPrep",
  description: "Practice real technical DSA interviews with other people",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

// Pusher configuration (client-safe)
export const PUSHER_CONFIG = {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
} as const;

// Channel naming conventions for Pusher
export const CHANNELS = {
  room: (roomId: string) => `presence-room-${roomId}`,
  editor: (roomId: string) => `private-editor-${roomId}`,
  signaling: (roomId: string) => `private-signaling-${roomId}`,
  matchmaking: "private-matchmaking",
} as const;

// Pusher event names
export const EVENTS = {
  // Room events 
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",
  USER_READY: "user-ready",
  PHASE_CHANGE: "phase-change",
  INTERVIEW_START: "interview-start",

  // Editor events
  CODE_UPDATE: "code-update",
  LANGUAGE_CHANGE: "language-change",

  // WebRTC signaling events
  SIGNAL_OFFER: "signal-offer",
  SIGNAL_ANSWER: "signal-answer",
  SIGNAL_ICE_CANDIDATE: "signal-ice-candidate",

  // Matchmaking events
  QUEUE_JOINED: "queue-joined",
  MATCHED: "matched",
} as const;
