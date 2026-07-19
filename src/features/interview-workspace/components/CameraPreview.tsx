"use client";

import { motion } from "framer-motion";
import { MoreVertical, VideoOff } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CameraPreviewProps = {
  userName: string;
  cameraEnabled: boolean;
  micEnabled: boolean;
  mediaStream?: MediaStream | null;
  audioLevel?: number;
  permissionError?: string | null;
  onRequestPermissions?: () => void;
  onOpenSettings?: () => void;
  className?: string;
};

export function CameraPreview({
  userName,
  cameraEnabled,
  micEnabled,
  mediaStream,
  permissionError,
  onRequestPermissions,
  onOpenSettings,
  className,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const initials = getInitials(userName);
  const hasCameraTrack = Boolean(mediaStream?.getVideoTracks().length);
  const needsPermission = !mediaStream && (cameraEnabled || micEnabled);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    videoElement.srcObject = mediaStream ?? null;

    return () => {
      videoElement.srcObject = null;
    };
  }, [mediaStream]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border/70 bg-[#202124] shadow-soft",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.05),transparent_42%),#202124]" />

      {cameraEnabled && hasCameraTrack ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}

      <div className="absolute left-5 top-5 z-10 max-w-[70%] truncate text-sm font-semibold uppercase tracking-normal text-white">
        {userName}
      </div>

      <button
        type="button"
        aria-label="Open device settings"
        onClick={onOpenSettings}
        className="absolute right-5 top-5 z-10 grid size-8 place-items-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <MoreVertical className="size-5" aria-hidden="true" />
      </button>

      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        {cameraEnabled && hasCameraTrack ? null : needsPermission ? (
          <div className="grid place-items-center gap-5">
            <p className="max-w-3xl text-balance text-2xl font-medium tracking-normal text-white sm:text-3xl">
              Do you want people to see and hear you in the meeting?
            </p>
            <Button
              type="button"
              className="h-11 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/92"
              onClick={onRequestPermissions}
            >
              Allow microphone and camera
            </Button>
            {permissionError ? (
              <p className="max-w-md text-xs leading-5 text-neutral-300">
                {permissionError}
              </p>
            ) : null}
          </div>
        ) : cameraEnabled ? (
          <div className="grid place-items-center gap-4">
            <div className="grid size-28 place-items-center rounded-full bg-white/10 text-3xl font-semibold text-white shadow-2xl">
              {initials}
            </div>
            <p className="max-w-sm text-sm leading-6 text-neutral-300">
              {permissionError ??
                "Camera preview is not available. You can still join when ready."}
            </p>
          </div>
        ) : (
          <div className="grid place-items-center gap-4">
            <div className="grid size-24 place-items-center rounded-full bg-white/10 text-neutral-200">
              <VideoOff className="size-8" aria-hidden="true" />
            </div>
            <p className="text-lg font-medium text-white">Camera is off</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "GP";
  }

  return parts.map((part) => part[0]?.toUpperCase()).join("");
}
