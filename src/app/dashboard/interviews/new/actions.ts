"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function createPrivateInterview() {
  try {
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return { error: "User not found" };

    const room = await db.interviewRoom.create({
      data: {
        type: "PRIVATE",
        status: "WAITING",
        participants: {
          create: {
            userId: dbUser.id,
            role: "INTERVIEWER", // First person to create is interviewer by default, though we can make it dynamic later
          }
        }
      }
    });

    return { code: room.code };
  } catch (error: any) {
    console.error("Create room error:", error);
    return { error: "Failed to create room" };
  }
}

export async function joinInterview(code: string) {
  try {
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    const dbUser = await db.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return { error: "User not found" };

    const room = await db.interviewRoom.findUnique({
      where: { code },
      include: { participants: true }
    });

    if (!room) return { error: "Room not found" };
    if (room.status !== "WAITING") return { error: "Room is no longer accepting participants" };
    
    const existingParticipant = room.participants.find((p: any) => p.userId === dbUser.id);
    if (existingParticipant) {
      return { success: true }; // Already joined
    }

    if (room.participants.length >= 2) {
      return { error: "Room is full" };
    }

    // Determine role (if creator is INTERVIEWER, joiner is CANDIDATE)
    const existingRole = room.participants[0]?.role;
    const newRole = existingRole === "INTERVIEWER" ? "CANDIDATE" : "INTERVIEWER";

    await db.participant.create({
      data: {
        roomId: room.id,
        userId: dbUser.id,
        role: newRole,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Join room error:", error);
    return { error: "Failed to join room" };
  }
}
