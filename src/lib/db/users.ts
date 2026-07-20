import "server-only";

import type { UserModel } from "@/generated/prisma/models";
import { getPrisma } from "@/lib/prisma";

export type ClerkProfileInput = {
  clerkId: string;
  email: string;
  username: string | null;
  fullName: string | null;
  avatar: string | null;
};

export type OnboardingProfileInput = {
  fullName: string;
  college: string | null;
  graduationYear: number | null;
  preferredLanguage: string;
  experienceLevel: UserModel["experienceLevel"];
  bio: string | null;
  avatar?: string | null;
};

export async function getUserByClerkId(clerkId: string) {
  const prisma = getPrisma();

  return prisma.user.findUnique({
    where: { clerkId },
  });
}

export async function upsertUserFromClerk(input: ClerkProfileInput) {
  const prisma = getPrisma();
  const existingUserByClerkId = await prisma.user.findUnique({
    where: {
      clerkId: input.clerkId,
    },
  });

  if (existingUserByClerkId) {
    return prisma.user.update({
      where: {
        clerkId: input.clerkId,
      },
      data: {
        email: input.email,
        fullName: input.fullName,
        avatar: input.avatar,
      },
    });
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUserByEmail) {
    return prisma.user.update({
      where: {
        id: existingUserByEmail.id,
      },
      data: {
        clerkId: input.clerkId,
        email: input.email,
        fullName: input.fullName,
        avatar: input.avatar,
        username:
          existingUserByEmail.username ??
          (await resolveUniqueUsername(
            input.username ?? input.email.split("@")[0] ?? "user",
            input.clerkId,
          )),
      },
    });
  }

  const username = await resolveUniqueUsername(
    input.username ?? input.email.split("@")[0] ?? "user",
    input.clerkId,
  );

  return prisma.user.create({
    data: {
      clerkId: input.clerkId,
      email: input.email,
      username,
      fullName: input.fullName,
      avatar: input.avatar,
    },
  });
}

export async function updateUserOnboardingProfile(
  clerkId: string,
  input: OnboardingProfileInput,
) {
  const prisma = getPrisma();

  return prisma.user.update({
    where: {
      clerkId,
    },
    data: {
      fullName: input.fullName,
      college: input.college,
      graduationYear: input.graduationYear,
      preferredLanguage: input.preferredLanguage,
      experienceLevel: input.experienceLevel,
      bio: input.bio,
      ...(input.avatar ? { avatar: input.avatar } : {}),
    },
  });
}

async function resolveUniqueUsername(rawUsername: string, clerkId: string) {
  const prisma = getPrisma();
  const baseUsername = normalizeUsername(rawUsername);
  const existingUser = await prisma.user.findUnique({
    where: {
      username: baseUsername,
    },
    select: {
      clerkId: true,
    },
  });

  if (!existingUser || existingUser.clerkId === clerkId) {
    return baseUsername;
  }

  const suffix = clerkId.slice(-6).toLowerCase();
  return `${baseUsername.slice(0, 23)}-${suffix}`;
}

function normalizeUsername(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);

  return normalized || "user";
}
