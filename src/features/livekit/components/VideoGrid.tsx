"use client";

import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Video } from "lucide-react";

import { ParticipantTile } from "@/features/livekit/components/ParticipantTile";
import { cn } from "@/lib/utils";

type VideoGridProps = {
  compact?: boolean;
  remoteOnly?: boolean;
  maxTiles?: number;
  className?: string;
};

export function VideoGrid({
  compact = false,
  remoteOnly = false,
  maxTiles = 2,
  className,
}: VideoGridProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Camera, withPlaceholder: true },
    ],
    { onlySubscribed: false },
  );

  const visibleTracks = tracks
    .filter((trackRef) => !remoteOnly || !trackRef.participant.isLocal)
    .sort((first, second) => {
      if (first.source === Track.Source.ScreenShare) {
        return -1;
      }

      if (second.source === Track.Source.ScreenShare) {
        return 1;
      }

      return Number(first.participant.isLocal) - Number(second.participant.isLocal);
    })
    .slice(0, maxTiles);

  if (visibleTracks.length === 0) {
    return (
      <div
        className={cn(
          "grid rounded-md border border-white/10 bg-black text-center text-neutral-400",
          compact ? "h-14 w-32 place-items-center" : "h-40 w-64 p-4",
          className,
        )}
      >
        <div className="grid place-items-center gap-1">
          <Video className="size-4" aria-hidden="true" />
          <span className="text-[11px]">Waiting for peer</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {visibleTracks.map((trackRef) => (
        <ParticipantTile
          key={`${trackRef.participant.identity}-${trackRef.source}`}
          trackRef={trackRef}
          compact={compact}
        />
      ))}
    </div>
  );
}
