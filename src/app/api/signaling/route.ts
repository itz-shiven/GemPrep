import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { roomId, senderId, targetId, type, payload } = await req.json();

    // Trigger signaling event to the room
    await pusherServer.trigger(`room-${roomId}`, "webrtc-signal", {
      senderId,
      targetId,
      type,
      payload
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signaling error:", error);
    return NextResponse.json({ error: "Failed to send signal" }, { status: 500 });
  }
}
