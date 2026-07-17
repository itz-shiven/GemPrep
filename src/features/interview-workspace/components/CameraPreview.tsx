"use client";

import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type CameraPreviewProps = {
  userName: string;
  cameraEnabled: boolean;
  micEnabled: boolean;
  mediaStream?: MediaStream | null;
  audioLevel?: number;
  permissionError?: string | null;
  className?: string;
};

export function CameraPreview({
  userName,
  cameraEnabled,
  micEnabled,
  mediaStream,
  audioLevel = 0,
  permissionError,
  className,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const initials = getInitials(userName);
  const hasCameraTrack = Boolean(mediaStream?.getVideoTracks().length);

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
        "relative min-h-[26rem] overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-2xl",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-300",
          cameraEnabled && hasCameraTrack
            ? "bg-neutral-950"
            : "bg-neutral-950",
        )}
      />

      {cameraEnabled && hasCameraTrack ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        {cameraEnabled && hasCameraTrack ? (
          <Video className="size-3.5" aria-hidden="true" />
        ) : (
          <VideoOff className="size-3.5" aria-hidden="true" />
        )}
        {cameraEnabled && hasCameraTrack ? "Camera on" : "Camera off"}
      </div>

      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        {cameraEnabled && hasCameraTrack ? null : cameraEnabled ? (
          <div className="grid place-items-center gap-4">
            <div className="grid size-28 place-items-center rounded-full border border-white/15 bg-white/10 text-3xl font-semibold text-white shadow-2xl">
              {initials}
            </div>
            <p className="max-w-sm text-sm leading-6 text-neutral-300">
              {permissionError ??
                "Allow camera access to preview your video before joining."}
            </p>
          </div>
        ) : (
          <div className="grid place-items-center gap-4">
            <div className="grid size-24 place-items-center rounded-full border border-white/10 bg-white/5 text-neutral-300">
              <VideoOff className="size-8" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Camera is off</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">
                You can join with camera off and turn it on once the interview
                room is ready.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
        <span className="max-w-[14rem] truncate">{userName}</span>
      </div>

      <div
        className={cn(
          "absolute bottom-4 right-4 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur",
          micEnabled
            ? "border-white/10 bg-black/35 text-white"
            : "border-red-400/20 bg-red-500/[0.18] text-red-100",
        )}
      >
        {micEnabled ? (
          <Mic className="size-3.5" aria-hidden="true" />
        ) : (
          <MicOff className="size-3.5" aria-hidden="true" />
        )}
        {micEnabled ? "Mic on" : "Muted"}
        {micEnabled ? (
          <span className="ml-1 h-1.5 w-12 overflow-hidden rounded-full bg-white/20">
            <span
              className="block h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(Math.max(audioLevel, 0), 100)}%` }}
            />
          </span>
        ) : null}
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
