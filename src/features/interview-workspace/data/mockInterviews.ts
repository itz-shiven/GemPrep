import {
  INTERVIEW_INVITE_ROLE_PARAM,
  type InterviewRole,
  type MockInterviewRoom,
} from "@/features/interview-workspace/types/interview";

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

  const inviteRole = parseInviteRoleFromLink(link);
  const mockRoom = getMockInterviewByRoomId(roomId);

  if (mockRoom) {
    return inviteRole
      ? {
          ...mockRoom,
          role: inviteRole,
          inviteRole,
        }
      : mockRoom;
  }

  return {
    roomId,
    link: createInterviewInviteLink(roomId, inviteRole ?? "CANDIDATE"),
    role: inviteRole ?? "CANDIDATE",
    inviteRole: inviteRole ?? "CANDIDATE",
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

export function createInterviewInviteLink(
  roomId: string,
  inviteRole: InterviewRole,
  baseUrl = "https://gemprep.com",
) {
  const url = new URL(`/room/${roomId}/waiting`, baseUrl);
  url.searchParams.set(INTERVIEW_INVITE_ROLE_PARAM, inviteRole);

  return url.toString();
}

export function parseInviteRoleFromLink(link: string): InterviewRole | null {
  const trimmed = link.trim();

  if (!trimmed) {
    return null;
  }

  const queryMatch = trimmed.match(/[?&]joinRole=(INTERVIEWER|CANDIDATE)\b/i);
  const hashMatch = trimmed.match(/[#&]joinRole=(INTERVIEWER|CANDIDATE)\b/i);
  const role = queryMatch?.[1] ?? hashMatch?.[1];

  if (!role) {
    return null;
  }

  return role.toUpperCase() as InterviewRole;
}

export function getCounterpartRole(role: InterviewRole): InterviewRole {
  return role === "CANDIDATE" ? "INTERVIEWER" : "CANDIDATE";
}
