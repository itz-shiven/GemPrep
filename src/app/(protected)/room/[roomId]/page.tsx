import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { InterviewRoom } from "@/features/interview-room/components/InterviewRoom";
import { isProfileComplete, requireSyncedUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

type InterviewRoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Interview Room",
  description: "Live GEMPREP technical interview workspace.",
};

export default async function InterviewRoomPage({ params }: InterviewRoomPageProps) {
  const { roomId } = await params;
  const user = await requireSyncedUser();

  if (!isProfileComplete(user)) {
    redirect(ROUTES.onboarding);
  }

  return (
    <InterviewRoom
      roomId={roomId}
      currentUser={{
        id: user.id,
        name: user.fullName ?? user.username ?? user.email,
      }}
    />
  );
}
