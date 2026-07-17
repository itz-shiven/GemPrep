"use client";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";

import type { RoomParticipant } from "@/features/interview-room/types/interview-room";
import { INTERVIEW_ROLE_LABELS } from "@/features/interview-workspace/types/interview";
import { cn } from "@/lib/utils";

type ParticipantsPanelProps = {
  participants: RoomParticipant[];
};

export function ParticipantsPanel({ participants }: ParticipantsPanelProps) {
  return (
    <div className="space-y-3">
      {participants.map((participant) => (
        <article
          key={participant.id}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-neutral-950 text-xs font-semibold text-white">
              {getInitials(participant.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-sm font-semibold text-white">
                  {participant.name}
                </p>
                {participant.isCurrentUser ? (
                  <span className="rounded-md border border-primary/30 bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-primary">
                    You
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                {INTERVIEW_ROLE_LABELS[participant.role]}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                participant.status === "online"
                  ? "bg-emerald-500/[0.12] text-emerald-200"
                  : "bg-amber-500/[0.12] text-amber-200",
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {participant.status}
            </span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              {participant.micEnabled ? (
                <Mic className="size-4" aria-hidden="true" />
              ) : (
                <MicOff className="size-4 text-red-300" aria-hidden="true" />
              )}
              {participant.cameraEnabled ? (
                <Video className="size-4" aria-hidden="true" />
              ) : (
                <VideoOff className="size-4 text-red-300" aria-hidden="true" />
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
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
