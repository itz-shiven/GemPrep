"use client";

import type { ReactNode } from "react";
import { Expand, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { motion } from "framer-motion";

import type { RoomParticipant } from "@/features/interview-room/types/interview-room";
import {
  INTERVIEW_ROLE_LABELS,
} from "@/features/interview-workspace/types/interview";
import { cn } from "@/lib/utils";

type VideoTileProps = {
  participant: RoomParticipant;
  compact?: boolean;
  className?: string;
};

export function VideoTile({
  participant,
  compact = false,
  className,
}: VideoTileProps) {
  const initials = getInitials(participant.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-2xl",
        compact ? "h-24 w-40" : "h-36 w-56",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 grid place-items-center",
          participant.cameraEnabled
            ? "bg-[radial-gradient(circle_at_center,_#3f3f46_0%,_#18181b_62%,_#09090b_100%)]"
            : "bg-neutral-950",
        )}
      >
        {participant.cameraEnabled ? (
          <span className="grid size-14 place-items-center rounded-full border border-white/10 bg-white/10 text-lg font-semibold text-white">
            {initials}
          </span>
        ) : (
          <VideoOff className="size-7 text-neutral-500" aria-hidden="true" />
        )}
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-1">
        <StatusPill active={participant.micEnabled}>
          {participant.micEnabled ? (
            <Mic className="size-3" aria-hidden="true" />
          ) : (
            <MicOff className="size-3" aria-hidden="true" />
          )}
        </StatusPill>
        <StatusPill active={participant.cameraEnabled}>
          {participant.cameraEnabled ? (
            <Video className="size-3" aria-hidden="true" />
          ) : (
            <VideoOff className="size-3" aria-hidden="true" />
          )}
        </StatusPill>
      </div>

      <button
        type="button"
        aria-label={`Expand ${participant.name} video`}
        className="absolute left-2 top-2 grid size-7 place-items-center rounded-md border border-white/10 bg-black/35 text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <Expand className="size-3.5" aria-hidden="true" />
      </button>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5">
        <p className="truncate text-xs font-semibold text-white">
          {participant.name}
        </p>
        <p className="mt-0.5 text-[11px] text-neutral-300">
          {INTERVIEW_ROLE_LABELS[participant.role]}
        </p>
      </div>
    </motion.div>
  );
}

type StatusPillProps = {
  active: boolean;
  children: ReactNode;
};

function StatusPill({ active, children }: StatusPillProps) {
  return (
    <span
      className={cn(
        "grid size-6 place-items-center rounded-full border backdrop-blur",
        active
          ? "border-white/10 bg-black/35 text-white"
          : "border-red-400/20 bg-red-500 text-white",
      )}
    >
      {children}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
