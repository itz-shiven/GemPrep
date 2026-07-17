"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PhoneOff, Settings, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InterviewTimer } from "@/features/interview-room/components/InterviewTimer";
import type {
  RoomRole,
  RoomStatus,
} from "@/features/interview-room/types/interview-room";
import { INTERVIEW_ROLE_LABELS } from "@/features/interview-workspace/types/interview";
import { ROUTES } from "@/lib/constants";

type RoomHeaderProps = {
  title: string;
  status: RoomStatus;
  role: RoomRole;
  roomId: string;
  interviewerVideo?: ReactNode;
  mediaControls?: ReactNode;
};

export function RoomHeader({
  title,
  status,
  role,
  roomId,
  interviewerVideo,
  mediaControls,
}: RoomHeaderProps) {
  const router = useRouter();

  function leaveRoom() {
    router.push(ROUTES.interviewWorkspace);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/30 bg-neutral-900/95 px-4 py-3 text-white backdrop-blur supports-[backdrop-filter]:bg-neutral-900/85">
      <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-md font-semibold tracking-normal text-white"
            aria-label="GEMPREP interview room"
          >
            <span
              className="grid size-7 place-items-center rounded-md border border-primary/20 bg-primary text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              <span className="size-2.5 rotate-45 rounded-[2px] border border-current" />
            </span>
            <span>GEMPREP</span>
          </div>
          <div className="min-w-0 border-l border-white/10 pl-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold">{title}</p>
              <Badge className="border-primary/30 bg-primary/15 text-primary">
                {status}
              </Badge>
            </div>
            <p className="mt-1 truncate text-xs text-neutral-400">
              Room {roomId}
            </p>
          </div>
        </div>

        <div className="flex justify-start lg:justify-center">
          <InterviewTimer />
        </div>

        <div className="flex min-w-0 items-center justify-start gap-2 lg:justify-end">
          {interviewerVideo ? (
            <div className="hidden shrink-0 xl:block">{interviewerVideo}</div>
          ) : null}

          {mediaControls ? (
            <div className="hidden min-w-0 shrink items-center gap-2 2xl:flex">
              {mediaControls}
            </div>
          ) : null}

          <Badge className="hidden border-white/10 bg-white/[0.08] text-white sm:inline-flex">
            <UsersRound className="mr-1 size-3" aria-hidden="true" />
            {INTERVIEW_ROLE_LABELS[role]}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
                aria-label="Open room settings"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Room settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Settings className="size-4" />
                Device preferences
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <UsersRound className="size-4" />
                Participant permissions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="destructive"
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
