import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { z } from "zod";

import { isProfileComplete, requireSyncedUser } from "@/lib/auth";
import { getRequiredServerEnv } from "@/lib/env";

const liveKitTokenRequestSchema = z.object({
  roomId: z
    .string()
    .trim()
    .min(4)
    .max(64)
    .regex(/^[a-zA-Z0-9-]+$/),
  role: z.enum(["INTERVIEWER", "CANDIDATE"]),
});

export async function POST(request: Request) {
  const user = await requireSyncedUser();

  if (!isProfileComplete(user)) {
    return NextResponse.json(
      { error: "Complete onboarding before joining an interview room." },
      { status: 403 },
    );
  }

  const parsedBody = liveKitTokenRequestSchema.safeParse(await request.json());

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid LiveKit token request." },
      { status: 400 },
    );
  }

  const { roomId, role } = parsedBody.data;
  const roomName = `gemprep-${roomId}`;
  const identity = `${user.clerkId}:${roomId}`;
  const participantName = user.fullName ?? user.username ?? user.email;

  try {
    const token = new AccessToken(
      getRequiredServerEnv("LIVEKIT_API_KEY"),
      getRequiredServerEnv("LIVEKIT_API_SECRET"),
      {
        identity,
        name: participantName,
        ttl: "2h",
        metadata: JSON.stringify({
          role,
          userId: user.id,
          roomId,
        }),
        attributes: {
          role,
          roomId,
        },
      },
    );

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({
      token: await token.toJwt(),
      serverUrl: getRequiredServerEnv("LIVEKIT_URL"),
      roomName,
      identity,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate LiveKit token.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
