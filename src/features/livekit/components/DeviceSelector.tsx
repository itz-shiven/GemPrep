"use client";

import {
  ChevronDown,
  Mic,
  MonitorUp,
  Sparkles,
  Video,
  Volume2,
} from "lucide-react";

import { cn } from "@/lib/utils";

type DeviceSelectorProps = {
  label: string;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onChange: (deviceId: string) => void;
  disabled?: boolean;
  className?: string;
};

export function DeviceSelector({
  label,
  devices,
  selectedDeviceId,
  onChange,
  disabled = false,
  className,
}: DeviceSelectorProps) {
  return (
    <label className={cn("group relative min-w-0 text-sm", className)}>
      <span className="sr-only">{label}</span>
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
        {renderDeviceIcon(label)}
      </span>
      <select
        value={selectedDeviceId}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || devices.length === 0}
        className="focus-ring h-10 w-full appearance-none truncate rounded-full border bg-background py-2 pl-10 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/60 disabled:cursor-not-allowed disabled:bg-background disabled:text-muted-foreground disabled:opacity-70"
      >
        {devices.length === 0 ? (
          <option value="">{label} not ready</option>
        ) : (
          devices.map((device, index) => (
            <option key={device.deviceId || index} value={device.deviceId}>
              {device.label || `${label} ${index + 1}`}
            </option>
          ))
        )}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
        <ChevronDown className="size-4" aria-hidden="true" />
      </span>
    </label>
  );
}

function renderDeviceIcon(label: string) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("microphone")) {
    return <Mic className="size-4" aria-hidden={true} />;
  }

  if (normalizedLabel.includes("speaker")) {
    return <Volume2 className="size-4" aria-hidden={true} />;
  }

  if (normalizedLabel.includes("camera")) {
    return <Video className="size-4" aria-hidden={true} />;
  }

  if (normalizedLabel.includes("background")) {
    return <Sparkles className="size-4" aria-hidden={true} />;
  }

  return <MonitorUp className="size-4" aria-hidden={true} />;
}
