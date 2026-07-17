"use client";

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
    <label className={cn("grid gap-2 text-sm", className)}>
      <span className="text-xs font-medium text-neutral-300">{label}</span>
      <select
        value={selectedDeviceId}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || devices.length === 0}
        className="focus-ring h-10 rounded-md border border-white/10 bg-black px-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {devices.length === 0 ? (
          <option value="">No device detected</option>
        ) : (
          devices.map((device, index) => (
            <option key={device.deviceId || index} value={device.deviceId}>
              {device.label || `${label} ${index + 1}`}
            </option>
          ))
        )}
      </select>
    </label>
  );
}
