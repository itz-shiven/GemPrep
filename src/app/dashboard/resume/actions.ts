"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function uploadResume(formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    if (file.type !== "application/pdf") {
      return { error: "Only PDF files are allowed" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size exceeds 5MB limit" };
    }

    const supabase = getSupabaseAdmin();
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(fileName, file, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return { error: "Failed to upload resume to storage" };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    // Save to DB
    const dbUser = await db.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) return { error: "User not found in database" };

    await db.resume.upsert({
      where: { userId: dbUser.id },
      update: {
        fileUrl: publicUrl,
        fileName: file.name,
      },
      create: {
        userId: dbUser.id,
        fileUrl: publicUrl,
        fileName: file.name,
      },
    });

    revalidatePath("/dashboard/resume");
    return { success: true };
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
