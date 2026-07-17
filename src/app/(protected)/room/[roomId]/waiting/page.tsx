import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { WaitingRoom } from "@/features/interview-workspace/components/WaitingRoom";
import { isProfileComplete, requireSyncedUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

type WaitingRoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Waiting Room",
  description: "Preview your GEMPREP interview setup before joining.",
};

export default async function WaitingRoomPage({ params }: WaitingRoomPageProps) {
  const { roomId } = await params;
  const user = await requireSyncedUser();

  if (!isProfileComplete(user)) {
    redirect(ROUTES.onboarding);
  }

  return (
    <WaitingRoom
      roomId={roomId}
      user={{ fullName: user.fullName ?? "GEMPREP user" }}
    />
  );
}
