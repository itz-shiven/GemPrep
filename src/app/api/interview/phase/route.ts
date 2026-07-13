import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { roomId, nextPhase } = await req.json();

    if (!roomId || !nextPhase) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const interview = await db.interview.update({
      where: { roomId },
      data: {
        currentPhase: nextPhase,
        phaseStartedAt: new Date(),
        ...(nextPhase === "ENDED" ? { endedAt: new Date() } : {})
      }
    });

    if (nextPhase === "ENDED") {
      await db.interviewRoom.update({
        where: { id: roomId },
        data: { status: "COMPLETED" }
      });
    }

    // Broadcast phase change
    await pusherServer.trigger(`room-${roomId}`, "room-status-changed", {
      status: nextPhase === "ENDED" ? "COMPLETED" : "IN_PROGRESS",
      interview
    });

    return NextResponse.json({ success: true, interview });
  } catch (error) {
    console.error("Phase update error:", error);
    return NextResponse.json({ error: "Failed to update phase" }, { status: 500 });
  }
}
