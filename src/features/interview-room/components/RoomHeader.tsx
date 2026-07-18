"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PhoneOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InterviewTimer } from "@/features/interview-room/components/InterviewTimer";
import { ROUTES } from "@/lib/constants";

type RoomHeaderProps = {
  interviewerVideo?: ReactNode;
  runCodeAction?: ReactNode;
};

export function RoomHeader({ interviewerVideo, runCodeAction }: RoomHeaderProps) {
  const router = useRouter();

  function leaveRoom() {
    router.push(ROUTES.interviewWorkspace);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/30 bg-neutral-900/95 px-4 py-2 text-white backdrop-blur supports-[backdrop-filter]:bg-neutral-900/85">
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="inline-flex shrink-0 items-center rounded-md font-semibold tracking-normal text-white"
            aria-label="GEMPREP interview room"
          >
            <span
              className="grid size-7 place-items-center rounded-md border border-primary/20 bg-primary text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              <span className="size-2.5 rotate-45 rounded-[2px] border border-current" />
            </span>
          </div>

          {interviewerVideo ? (
            <div className="hidden shrink-0 md:block">{interviewerVideo}</div>
          ) : null}
        </div>

        <div className="flex justify-start lg:justify-center">
          {runCodeAction}
        </div>

        <div className="flex shrink-0 items-center justify-start gap-2 lg:justify-end">
          <InterviewTimer />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="bg-red-600 text-white hover:bg-red-600/92"
            onClick={leaveRoom}
          >
            <PhoneOff className="size-4" />
            Leave
          </Button>
        </div>
      </div>
    </header>
  );
}
