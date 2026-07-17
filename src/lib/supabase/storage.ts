import "server-only";

import { AVATAR_ACCEPTED_TYPES, AVATAR_MAX_SIZE_BYTES } from "@/lib/constants";
import { getRequiredServerEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function uploadAvatar({
  file,
  userId,
}: {
  file: File;
  userId: string;
}) {
  if (!AVATAR_ACCEPTED_TYPES.includes(file.type as (typeof AVATAR_ACCEPTED_TYPES)[number])) {
    throw new Error("Avatar must be a JPG, PNG, or WebP image.");
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    throw new Error("Avatar must be 2MB or smaller.");
  }

  const supabase = createSupabaseAdminClient();
  const bucket = getRequiredServerEnv("SUPABASE_AVATAR_BUCKET");
  const extension = extensionFromMimeType(file.type);
  const filePath = `${userId}/${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

function extensionFromMimeType(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}
