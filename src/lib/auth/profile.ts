import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import type { User as ClerkUser } from "@clerk/backend";
import type { UserModel } from "@/generated/prisma/models";
import { upsertUserFromClerk } from "@/lib/db/users";

export async function requireSyncedUser() {
  await auth.protect();

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unable to resolve the current Clerk user.");
  }

  return syncClerkUser(clerkUser);
}

export function isProfileComplete(user: UserModel) {
  return Boolean(user.fullName && user.preferredLanguage);
}

async function syncClerkUser(clerkUser: ClerkUser) {
  const primaryEmail =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error("A verified email address is required to use GEMPREP.");
  }

  return upsertUserFromClerk({
    clerkId: clerkUser.id,
    email: primaryEmail,
    username: clerkUser.username,
    fullName: clerkUser.fullName,
    avatar: clerkUser.imageUrl,
  });
}
