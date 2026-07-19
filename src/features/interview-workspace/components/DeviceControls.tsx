"use client";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";

type DeviceControlsProps = {
  micEnabled: boolean;
  cameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  showPermissionWarning?: boolean;
};

export function DeviceControls({
  micEnabled,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  showPermissionWarning = false,
}: DeviceControlsProps) {
  return (
    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-5">
      <button
        type="button"
        aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
        aria-pressed={!micEnabled}
        onClick={onToggleMic}
        className={cn(
          "relative grid size-14 place-items-center rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/70",
          micEnabled
            ? "bg-primary text-primary-foreground hover:bg-primary/92"
            : "bg-red-500 text-white hover:bg-red-500/92",
        )}
      >
        {micEnabled ? (
          <Mic className="size-5" aria-hidden="true" />
        ) : (
          <MicOff className="size-5" aria-hidden="true" />
        )}
        {showPermissionWarning ? <WarningDot /> : null}
      </button>

      <button
        type="button"
        aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"}
        aria-pressed={!cameraEnabled}
        onClick={onToggleCamera}
        className={cn(
          "relative grid size-14 place-items-center rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/70",
          cameraEnabled
            ? "bg-primary text-primary-foreground hover:bg-primary/92"
            : "bg-red-500 text-white hover:bg-red-500/92",
        )}
      >
        {cameraEnabled ? (
          <Video className="size-5" aria-hidden="true" />
        ) : (
          <VideoOff className="size-5" aria-hidden="true" />
        )}
        {showPermissionWarning ? <WarningDot /> : null}
      </button>
    </div>
  );
}

function WarningDot() {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-amber-400 text-[10px] font-bold leading-none text-neutral-950">
      !
    </span>
  );
}
