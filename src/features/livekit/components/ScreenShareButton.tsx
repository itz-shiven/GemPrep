"use client";

import { MonitorUp, MonitorX } from "lucide-react";
import { useLocalParticipant } from "@livekit/components-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ScreenShareButton() {
  const { isScreenShareEnabled, localParticipant } = useLocalParticipant();

  async function toggleScreenShare() {
    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to toggle screen sharing.",
      );
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
      onClick={() => {
        void toggleScreenShare();
      }}
    >
      {isScreenShareEnabled ? (
        <MonitorX className="size-4" />
      ) : (
        <MonitorUp className="size-4" />
      )}
      {isScreenShareEnabled ? "Stop Share" : "Share Screen"}
    </Button>
  );
}
