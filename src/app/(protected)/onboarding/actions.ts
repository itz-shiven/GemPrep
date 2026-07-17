"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSyncedUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { updateUserOnboardingProfile } from "@/lib/db/users";
import { uploadAvatar } from "@/lib/supabase";
import {
  type OnboardingFormState,
  onboardingSchema,
} from "@/lib/validators";

export async function completeOnboarding(
  _previousState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const user = await requireSyncedUser();
  const parsed = onboardingSchema.safeParse({
    fullName: formData.get("fullName"),
    college: formData.get("college"),
    graduationYear: formData.get("graduationYear"),
    preferredLanguage: formData.get("preferredLanguage"),
    experienceLevel: formData.get("experienceLevel"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const avatar = await resolveAvatarUpload({
      formData,
      userId: user.id,
      currentAvatar: user.avatar,
    });

    await updateUserOnboardingProfile(user.clerkId, {
      ...parsed.data,
      avatar,
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to save onboarding details.",
    };
  }

  revalidatePath(ROUTES.dashboard);
  redirect(ROUTES.dashboard);
}

async function resolveAvatarUpload({
  formData,
  userId,
  currentAvatar,
}: {
  formData: FormData;
  userId: string;
  currentAvatar: string | null;
}) {
  const avatar = formData.get("avatar");

  if (!(avatar instanceof File) || avatar.size === 0) {
    return currentAvatar;
  }

  return uploadAvatar({
    file: avatar,
    userId,
  });
}
