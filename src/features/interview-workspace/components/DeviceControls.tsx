"use client";

import { Mic, MicOff, Settings, Video, VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";

type DeviceControlsProps = {
  micEnabled: boolean;
  cameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onOpenSettings: () => void;
};

export function DeviceControls({
  micEnabled,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  onOpenSettings,
}: DeviceControlsProps) {
  return (
    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/[0.42] p-2 shadow-2xl backdrop-blur">
      <button
        type="button"
        aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
        aria-pressed={!micEnabled}
        onClick={onToggleMic}
        className={cn(
          "grid size-12 place-items-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/[0.14] focus:outline-none focus:ring-2 focus:ring-white/70",
          micEnabled ? "bg-white/10" : "bg-red-500 text-white hover:bg-red-500/92",
        )}
      >
        {micEnabled ? (
          <Mic className="size-5" aria-hidden="true" />
        ) : (
          <MicOff className="size-5" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"}
        aria-pressed={!cameraEnabled}
        onClick={onToggleCamera}
        className={cn(
          "grid size-12 place-items-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/[0.14] focus:outline-none focus:ring-2 focus:ring-white/70",
          cameraEnabled
            ? "bg-white/10"
            : "bg-red-500 text-white hover:bg-red-500/92",
        )}
      >
        {cameraEnabled ? (
          <Video className="size-5" aria-hidden="true" />
        ) : (
          <VideoOff className="size-5" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        aria-label="Open device settings"
        onClick={onOpenSettings}
        className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/[0.14] focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <Settings className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
