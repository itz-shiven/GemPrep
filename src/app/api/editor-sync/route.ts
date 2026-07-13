import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { roomId, senderId, code, language } = await req.json();

    // Trigger editor sync event to the room
    await pusherServer.trigger(`room-${roomId}`, "editor-sync", {
      senderId,
      code,
      language
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Editor sync error:", error);
    return NextResponse.json({ error: "Failed to sync editor" }, { status: 500 });
  }
}
