"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

type InterviewTimerProps = {
  initialSeconds?: number;
};

export function InterviewTimer({ initialSeconds = 0 }: InterviewTimerProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSecondsElapsed((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 font-mono text-sm font-medium text-white shadow-sm">
      <Clock3 className="size-4 text-primary" aria-hidden="true" />
      {formatDuration(secondsElapsed)}
    </div>
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}
