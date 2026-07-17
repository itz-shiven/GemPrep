import type { MockInterviewRoom } from "@/features/interview-workspace/types/interview";

export const MOCK_INTERVIEW_ROOMS: MockInterviewRoom[] = [
  {
    roomId: "abc123",
    link: "https://gemprep.com/room/abc123",
    role: "CANDIDATE",
    status: "WAITING",
    type: "Data structures mock",
    duration: "45 minutes",
  },
  {
    roomId: "sys789",
    link: "https://gemprep.com/room/sys789",
    role: "INTERVIEWER",
    status: "WAITING",
    type: "System design mock",
    duration: "60 minutes",
  },
  {
    roomId: "web456",
    link: "https://gemprep.com/room/web456",
    role: "CANDIDATE",
    status: "WAITING",
    type: "Frontend fundamentals",
    duration: "40 minutes",
  },
];

export function getMockInterviewByRoomId(roomId: string) {
  return MOCK_INTERVIEW_ROOMS.find((room) => room.roomId === roomId);
}

export function getMockInterviewByLink(link: string) {
  const roomId = parseRoomIdFromLink(link);

  if (!roomId) {
    return null;
  }

  return getMockInterviewByRoomId(roomId) ?? {
    roomId,
    link: `https://gemprep.com/room/${roomId}`,
    role: "CANDIDATE" as const,
    status: "WAITING" as const,
    type: "Data structures mock" as const,
    duration: "45 minutes",
  };
}

export function parseRoomIdFromLink(link: string) {
  const trimmed = link.trim();

  if (!trimmed) {
    return null;
  }

  const directMatch = trimmed.match(/\/room\/([a-zA-Z0-9-]+)/);

  if (directMatch?.[1]) {
    return directMatch[1];
  }

  if (/^[a-zA-Z0-9-]{4,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}
