import type {
  ChatMessage,
  InterviewChecklistItem,
  InterviewProblem,
  InterviewRoomMock,
  LanguageId,
  LanguageOption,
  RoomParticipant,
  RoomRole,
  TestCase,
} from "@/features/interview-room/types/interview-room";

const cppStarter = `#include <bits/stdc++.h>
using namespace std;

int maxGemPairScore(vector<int>& gems, int target) {
    unordered_set<int> seen;
    int bestScore = -1;

    for (int value : gems) {
        int complement = target - value;

        if (seen.count(complement)) {
            bestScore = max(bestScore, value + complement);
        }

        seen.insert(value);
    }

    return bestScore;
}

int main() {
    int n;
    cin >> n;

    vector<int> gems(n);
    for (int i = 0; i < n; i++) {
        cin >> gems[i];
    }

    int target;
    cin >> target;

    cout << maxGemPairScore(gems, target) << "\\n";
    return 0;
}
`;

const javaStarter = `import java.util.*;

class Main {
    static int maxGemPairScore(int[] gems, int target) {
        Set<Integer> seen = new HashSet<>();
        int bestScore = -1;

        for (int value : gems) {
            int complement = target - value;

            if (seen.contains(complement)) {
                bestScore = Math.max(bestScore, value + complement);
            }

            seen.add(value);
        }

        return bestScore;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] gems = new int[n];

        for (int i = 0; i < n; i++) {
            gems[i] = scanner.nextInt();
        }

        int target = scanner.nextInt();
        System.out.println(maxGemPairScore(gems, target));
    }
}
`;

const javaScriptStarter = `const input = require("fs").readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
const n = input[0] ?? 0;
const gems = input.slice(1, 1 + n);
const target = input[1 + n] ?? 0;

function maxGemPairScore(gems, target) {
  const seen = new Set();
  let bestScore = -1;

  for (const value of gems) {
    const complement = target - value;

    if (seen.has(complement)) {
      bestScore = Math.max(bestScore, value + complement);
    }

    seen.add(value);
  }

  return bestScore;
}

console.log(maxGemPairScore(gems, target));
`;

const pythonStarter = `import sys


def max_gem_pair_score(gems, target):
    seen = set()
    best_score = -1

    for value in gems:
        complement = target - value

        if complement in seen:
            best_score = max(best_score, value + complement)

        seen.add(value)

    return best_score


values = list(map(int, sys.stdin.read().strip().split()))
n = values[0] if values else 0
gems = values[1:1 + n]
target = values[1 + n] if len(values) > 1 + n else 0

print(max_gem_pair_score(gems, target))
`;

export const ROOM_LANGUAGES: LanguageOption[] = [
  {
    id: "cpp",
    label: "C++",
    monacoLanguage: "cpp",
    fileName: "solution.cpp",
    initialCode: cppStarter,
  },
  {
    id: "java",
    label: "Java",
    monacoLanguage: "java",
    fileName: "Solution.java",
    initialCode: javaStarter,
  },
  {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
    fileName: "solution.py",
    initialCode: pythonStarter,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
    fileName: "solution.js",
    initialCode: javaScriptStarter,
  },
];

export const MOCK_ROOM_PROBLEM: InterviewProblem = {
  title: "Maximum Gem Pair Score",
  difficulty: "Medium",
  description:
    "Given a list of gem values and a target score, return the highest score formed by two values that add up to the target. Return -1 when no valid pair exists.",
  examples: [
    {
      input: "n = 3, gems = [4, 8, 6], target = 10",
      output: "10",
      explanation: "ruby and jade form a valid pair: 4 + 6 = 10.",
    },
    {
      input: "n = 2, gems = [3, 5], target = 12",
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
    input: "3\n4 8 6\n10",
    expectedOutput: "10",
    status: "idle",
  },
  {
    id: "case-2",
    label: "No pair",
    input: "2\n3 5\n12",
    expectedOutput: "-1",
    status: "idle",
  },
  {
    id: "case-3",
    label: "Duplicate values",
    input: "3\n5 5 2\n10",
    expectedOutput: "10",
    status: "idle",
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
