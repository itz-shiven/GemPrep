"use client";

import { Loader2, Wifi, WifiOff } from "lucide-react";

import type {
  CollaborationStatus,
  EditorPresenceUser,
} from "@/features/collaborative-editor/types/editor";
import { cn } from "@/lib/utils";

type PresenceIndicatorProps = {
  status: CollaborationStatus;
  participants: EditorPresenceUser[];
};

export function PresenceIndicator({
  status,
  participants,
}: PresenceIndicatorProps) {
  const leadParticipant =
    participants.find((participant) => participant.status === "editing") ??
    participants[0];

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5">
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-md",
          status === "connected"
            ? "bg-emerald-500/15 text-emerald-300"
            : "bg-amber-500/15 text-amber-300",
        )}
        aria-hidden="true"
      >
        <StatusIcon status={status} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-100">
          {statusLabel(status)}
        </p>
        <p className="max-w-44 truncate text-[11px] text-neutral-400">
          {presenceLabel(leadParticipant)}
        </p>
      </div>
      {participants.length > 0 ? (
        <div className="hidden -space-x-1 md:flex" aria-label="Active users">
          {participants.slice(0, 3).map((participant) => (
            <span
              key={`${participant.clientId}-${participant.id}`}
              className="grid size-5 place-items-center rounded-full border border-black text-[10px] font-semibold text-black"
              style={{ backgroundColor: participant.color }}
              title={`${participant.name} is ${participant.status}`}
            >
              {participant.name.charAt(0).toUpperCase()}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StatusIcon({ status }: { status: CollaborationStatus }) {
  if (status === "connected") {
    return <Wifi className="size-3.5" />;
  }

  if (status === "disconnected") {
    return <WifiOff className="size-3.5" />;
  }

  return <Loader2 className="size-3.5 animate-spin" />;
}

function statusLabel(status: CollaborationStatus) {
  if (status === "connected") {
    return "Synced";
  }

  if (status === "reconnecting") {
    return "Reconnecting...";
  }

  if (status === "disconnected") {
    return "Sync disconnected";
  }

  return "Connecting...";
}

function presenceLabel(participant?: EditorPresenceUser) {
  if (!participant) {
    return "Waiting for peer";
  }

  return `${participant.name} is ${participant.status}`;
}
