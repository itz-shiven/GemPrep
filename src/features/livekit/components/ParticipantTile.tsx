"use client";

import { ParticipantTile as LiveKitParticipantTile } from "@livekit/components-react";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { Mic, MicOff, VideoOff } from "lucide-react";
import { Track } from "livekit-client";

import { cn } from "@/lib/utils";

type ParticipantTileProps = {
  trackRef: TrackReferenceOrPlaceholder;
  compact?: boolean;
  className?: string;
};

export function ParticipantTile({
  trackRef,
  compact = false,
  className,
}: ParticipantTileProps) {
  const participantName =
    trackRef.participant.name || trackRef.participant.identity || "Participant";
  const isScreenShare = trackRef.source === Track.Source.ScreenShare;
  const isMuted = trackRef.publication?.isMuted ?? true;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-white/10 bg-black text-white shadow-sm",
        compact ? "h-14 w-32" : "h-40 w-64",
        className,
      )}
    >
      {trackRef.publication ? (
        <LiveKitParticipantTile
          trackRef={trackRef}
          disableSpeakingIndicator
          className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center bg-neutral-950 text-neutral-500">
          <VideoOff className="size-5" aria-hidden="true" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2">
        <p className="truncate text-[11px] font-semibold">{participantName}</p>
        <p className="mt-0.5 text-[10px] text-neutral-300">
          {isScreenShare ? "Screen share" : "Live video"}
        </p>
      </div>

      <span
        className={cn(
          "absolute right-2 top-2 grid size-6 place-items-center rounded-full border backdrop-blur",
          isMuted
            ? "border-red-400/20 bg-red-500 text-white"
            : "border-white/10 bg-black/35 text-white",
        )}
      >
        {isMuted ? (
          <MicOff className="size-3" aria-hidden="true" />
        ) : (
          <Mic className="size-3" aria-hidden="true" />
        )}
      </span>
    </div>
  );
}
