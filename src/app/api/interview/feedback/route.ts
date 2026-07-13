import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { interviewId, reviewerId, revieweeId, role, ratings, comments } = await req.json();

    if (!interviewId || !reviewerId || !revieweeId || !role || !ratings) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feedback = await db.feedback.create({
      data: {
        interviewId,
        reviewerId,
        revieweeId,
        role,
        ratings,
        comments,
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Feedback creation error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
