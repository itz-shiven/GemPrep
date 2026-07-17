import "server-only";

type ServerEnvKey =
  | "DATABASE_URL"
  | "LIVEKIT_API_KEY"
  | "LIVEKIT_API_SECRET"
  | "LIVEKIT_URL"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "SUPABASE_AVATAR_BUCKET";

export function getRequiredServerEnv(key: ServerEnvKey) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getOptionalServerEnv(key: ServerEnvKey) {
  return process.env[key];
}
