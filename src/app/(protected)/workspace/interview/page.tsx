import type { Metadata } from "next";

import { InterviewWorkspace } from "@/features/interview-workspace/components/InterviewWorkspace";

export const metadata: Metadata = {
  title: "Interview Workspace",
  description: "Create or join a GEMPREP interview room.",
};

export default function InterviewWorkspacePage() {
  return <InterviewWorkspace />;
}
