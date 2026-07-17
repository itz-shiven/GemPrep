"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { Loader2, WifiOff } from "lucide-react";
import { toast } from "sonner";

import type { LiveKitCredentials } from "@/features/livekit/types/livekit";
import type { InterviewRole } from "@/features/interview-workspace/types/interview";

type LiveKitProviderProps = {
  roomId: string;
  role: InterviewRole;
  children: ReactNode;
};

export function LiveKitProvider({
  roomId,
  role,
  children,
}: LiveKitProviderProps) {
  const [credentials, setCredentials] = useState<LiveKitCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadToken() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId, role }),
          signal: controller.signal,
        });

        const body = (await response.json()) as
          | LiveKitCredentials
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in body && body.error
              ? body.error
              : "Unable to connect to the LiveKit room.",
          );
        }

        setCredentials(body as LiveKitCredentials);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to connect to the LiveKit room.";

        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadToken();

    return () => controller.abort();
  }, [role, roomId]);

  if (loading) {
    return (
      <ConnectionStateShell
        icon={<Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        title="Preparing secure video room"
        description="Generating a LiveKit access token and connecting your media session."
      />
    );
  }

  if (error || !credentials) {
    return (
      <ConnectionStateShell
        icon={<WifiOff className="size-4" aria-hidden="true" />}
        title="Could not connect video"
        description={
          error ??
          "Check LiveKit environment variables and try joining the room again."
        }
      />
    );
  }

  return (
    <LiveKitRoom
      token={credentials.token}
      serverUrl={credentials.serverUrl}
      connect
      audio
      video
      options={{
        adaptiveStream: true,
        dynacast: true,
      }}
      onConnected={() => toast.success("Connected to LiveKit room.")}
      onDisconnected={() => toast.info("Disconnected from LiveKit room.")}
      onError={(roomError) => setError(roomError.message)}
      onMediaDeviceFailure={(_, kind) => {
        toast.error(
          kind
            ? `Unable to access ${kind}. Check browser permissions.`
            : "Unable to access media devices.",
        );
      }}
      className="contents"
    >
      <RoomAudioRenderer />
      {children}
    </LiveKitRoom>
  );
}

type ConnectionStateShellProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function ConnectionStateShell({
  icon,
  title,
  description,
}: ConnectionStateShellProps) {
  return (
    <div className="grid h-full min-h-0 place-items-center rounded-lg border border-white/10 bg-black p-6 text-center text-white">
      <div>
        <span className="mx-auto grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-primary">
          {icon}
        </span>
        <p className="mt-4 text-sm font-semibold">{title}</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
          {description}
        </p>
      </div>
    </div>
  );
}
