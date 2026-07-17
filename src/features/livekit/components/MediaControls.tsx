"use client";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import {
  useConnectionState,
  useLocalParticipant,
} from "@livekit/components-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScreenShareButton } from "@/features/livekit/components/ScreenShareButton";
import { cn } from "@/lib/utils";

type MediaControlsProps = {
  className?: string;
};

export function MediaControls({ className }: MediaControlsProps) {
  const connectionState = useConnectionState();
  const {
    isCameraEnabled,
    isMicrophoneEnabled,
    localParticipant,
    lastCameraError,
    lastMicrophoneError,
  } = useLocalParticipant();

  async function toggleMicrophone() {
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to toggle microphone.",
      );
    }
  }

  async function toggleCamera() {
    try {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to toggle camera.",
      );
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="inline-flex h-9 items-center rounded-md border border-white/10 bg-white/[0.08] px-3 text-xs font-medium capitalize text-white">
        {connectionState}
      </span>
      <Button
        type="button"
        variant="outline"
        className="border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
        onClick={() => {
          void toggleMicrophone();
        }}
      >
        {isMicrophoneEnabled ? (
          <Mic className="size-4" />
        ) : (
          <MicOff className="size-4" />
        )}
        {isMicrophoneEnabled ? "Mute" : "Unmute"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
        onClick={() => {
          void toggleCamera();
        }}
      >
        {isCameraEnabled ? (
          <Video className="size-4" />
        ) : (
          <VideoOff className="size-4" />
        )}
        {isCameraEnabled ? "Camera Off" : "Camera On"}
      </Button>
      <ScreenShareButton />
      {lastCameraError || lastMicrophoneError ? (
        <p className="text-xs text-red-300">
          {lastCameraError?.message ?? lastMicrophoneError?.message}
        </p>
      ) : null}
    </div>
  );
}
