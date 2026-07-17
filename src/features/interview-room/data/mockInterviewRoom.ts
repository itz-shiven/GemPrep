import type {
  ChatMessage,
  ConsoleLine,
  InterviewChecklistItem,
  InterviewProblem,
  InterviewRoomMock,
  LanguageId,
  LanguageOption,
  RoomParticipant,
  RoomRole,
  TestCase,
} from "@/features/interview-room/types/interview-room";

const typeScriptStarter = `type Gem = {
  name: string;
  value: number;
};

export function maxGemPairScore(gems: Gem[], target: number): number {
  const seen = new Map<number, number>();
  let bestScore = -1;

  for (const gem of gems) {
    const complement = target - gem.value;

    if (seen.has(complement)) {
      bestScore = Math.max(bestScore, gem.value + complement);
    }

    seen.set(gem.value, gem.value);
  }

  return bestScore;
}
`;

const javaScriptStarter = `function maxGemPairScore(gems, target) {
  const seen = new Map();
  let bestScore = -1;

  for (const gem of gems) {
    const complement = target - gem.value;

    if (seen.has(complement)) {
      bestScore = Math.max(bestScore, gem.value + complement);
    }

    seen.set(gem.value, gem.value);
  }

  return bestScore;
}
`;

const pythonStarter = `def max_gem_pair_score(gems, target):
    seen = set()
    best_score = -1

    for gem in gems:
        complement = target - gem["value"]

        if complement in seen:
            best_score = max(best_score, gem["value"] + complement)

        seen.add(gem["value"])

    return best_score
`;

export const ROOM_LANGUAGES: LanguageOption[] = [
  {
    id: "typescript",
    label: "TypeScript",
    monacoLanguage: "typescript",
    fileName: "solution.ts",
    initialCode: typeScriptStarter,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
    fileName: "solution.js",
    initialCode: javaScriptStarter,
  },
  {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
    fileName: "solution.py",
    initialCode: pythonStarter,
  },
];

export const MOCK_ROOM_PROBLEM: InterviewProblem = {
  title: "Maximum Gem Pair Score",
  difficulty: "Medium",
  description:
    "Given a list of gems and a target score, return the highest score formed by two gem values that add up to the target. Return -1 when no valid pair exists.",
  examples: [
    {
      input:
        'gems = [{ name: "ruby", value: 4 }, { name: "opal", value: 8 }, { name: "jade", value: 6 }], target = 10',
      output: "10",
      explanation: "ruby and jade form a valid pair: 4 + 6 = 10.",
    },
    {
      input:
        'gems = [{ name: "onyx", value: 3 }, { name: "pearl", value: 5 }], target = 12',
      output: "-1",
      explanation: "No two values add up to 12.",
    },
  ],
  constraints: [
    "2 <= gems.length <= 100,000",
    "1 <= gem.value <= 1,000,000",
    "Each gem may be used at most once.",
    "Optimize for time complexity before polishing syntax.",
  ],
  notes: [
    "Talk through tradeoffs before coding.",
    "Call out edge cases around duplicate values.",
    "Aim for O(n) time and O(n) space.",
  ],
};

export const MOCK_TEST_CASES: TestCase[] = [
  {
    id: "case-1",
    label: "Pair exists",
    input: "[4, 8, 6], target 10",
    expectedOutput: "10",
    status: "idle",
  },
  {
    id: "case-2",
    label: "No pair",
    input: "[3, 5], target 12",
    expectedOutput: "-1",
    status: "idle",
  },
  {
    id: "case-3",
    label: "Duplicate values",
    input: "[5, 5, 2], target 10",
    expectedOutput: "10",
    status: "idle",
  },
];

export const MOCK_CONSOLE_LINES: ConsoleLine[] = [
  {
    id: "line-1",
    level: "info",
    text: "Runtime ready. Run tests to inspect output.",
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "message-1",
    author: "Avery Chen",
    role: "INTERVIEWER",
    timestamp: "10:02",
    body: "Start by explaining the data structure you want to use.",
  },
  {
    id: "message-2",
    author: "Maya Patel",
    role: "CANDIDATE",
    timestamp: "10:03",
    body: "I’ll use a hash map to track complements in one pass.",
  },
];

export const MOCK_CHECKLIST: InterviewChecklistItem[] = [
  {
    id: "check-1",
    label: "Clarifies requirements before coding",
    completed: true,
  },
  {
    id: "check-2",
    label: "Explains complexity and edge cases",
    completed: false,
  },
  {
    id: "check-3",
    label: "Runs tests and interprets failures",
    completed: false,
  },
];

export const MOCK_INTERVIEW_ROOM: InterviewRoomMock = {
  title: "Peer Mock: Arrays & Hashing",
  status: "LIVE",
  problem: MOCK_ROOM_PROBLEM,
  testCases: MOCK_TEST_CASES,
  consoleLines: MOCK_CONSOLE_LINES,
  chatMessages: MOCK_CHAT_MESSAGES,
  checklist: MOCK_CHECKLIST,
  languages: ROOM_LANGUAGES,
};

export function getLanguageOption(languageId: LanguageId) {
  return (
    ROOM_LANGUAGES.find((language) => language.id === languageId) ??
    ROOM_LANGUAGES[0]
  );
}

export function getRoomParticipants(
  currentUserName: string,
  currentRole: RoomRole,
): RoomParticipant[] {
  const candidateName =
    currentRole === "CANDIDATE" ? currentUserName : "Maya Patel";
  const interviewerName =
    currentRole === "INTERVIEWER" ? currentUserName : "Avery Chen";

  return [
    {
      id: "candidate",
      name: candidateName,
      role: "CANDIDATE",
      status: "online",
      cameraEnabled: true,
      micEnabled: true,
      isCurrentUser: currentRole === "CANDIDATE",
    },
    {
      id: "interviewer",
      name: interviewerName,
      role: "INTERVIEWER",
      status: "reviewing",
      cameraEnabled: true,
      micEnabled: true,
      isCurrentUser: currentRole === "INTERVIEWER",
    },
  ];
}
