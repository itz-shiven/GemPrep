import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { InterviewClient } from "./interview-client";

export default async function InterviewPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({ where: { clerkId: user.id } });
  if (!dbUser) {
    redirect("/dashboard");
  }

  const room = await db.interviewRoom.findUnique({
    where: { code },
    include: {
      participants: {
        include: { user: true }
      },
      interview: true
    }
  });

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Room not found</h1>
      </div>
    );
  }

  const participant = room.participants.find(p => p.userId === dbUser.id);
  if (!participant) {
    redirect(`/dashboard/interviews/new?code=${code}`);
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <InterviewClient 
        room={JSON.parse(JSON.stringify(room))}
        currentParticipant={JSON.parse(JSON.stringify(participant))}
        currentUser={JSON.parse(JSON.stringify(dbUser))}
      />
    </div>
  );
}
