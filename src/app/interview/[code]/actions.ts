"use server";

import { db } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function updateReadyStatus(roomId: string, participantId: string, isReady: boolean) {
  try {
    // 1. Update participant status
    const updatedParticipant = await db.participant.update({
      where: { id: participantId },
      data: { isReady }
    });

    // 2. Broadcast via Pusher
    await pusherServer.trigger(`room-${roomId}`, "participant-ready", {
      participantId,
      isReady
    });

    // 3. Check if all participants (2) are ready
    const room = await db.interviewRoom.findUnique({
      where: { id: roomId },
      include: { participants: true }
    });

    if (room && room.participants.length === 2 && room.participants.every(p => p.isReady)) {
      // Create Interview record and set room to IN_PROGRESS
      const interview = await db.interview.create({
        data: {
          roomId: room.id,
          currentPhase: "INTRO",
          phaseStartedAt: new Date(),
        }
      });

      const updatedRoom = await db.interviewRoom.update({
        where: { id: roomId },
        data: { status: "IN_PROGRESS" }
      });

      // Broadcast room status change
      await pusherServer.trigger(`room-${roomId}`, "room-status-changed", {
        status: "IN_PROGRESS",
        interview
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Update ready status error:", error);
    return { error: "Failed to update ready status" };
  }
}
