"use client";

import { ChevronDown, Clock3, DoorOpen, Sparkles, UserRound } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import {
  INTERVIEW_ROLE_LABELS,
  type InterviewRole,
  type MockInterviewRoom,
} from "@/features/interview-workspace/types/interview";

type InterviewInfoCardProps = {
  userName: string;
  role: InterviewRole;
  room: MockInterviewRoom;
  joinedIntent: boolean;
  onJoin: () => void;
  onOpenDeviceSettings: () => void;
  onOpenAudioSettings: () => void;
};

export function InterviewInfoCard({
  userName,
  role,
  room,
  joinedIntent,
  onJoin,
  onOpenDeviceSettings,
  onOpenAudioSettings,
}: InterviewInfoCardProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold tracking-normal text-foreground">
        Ready to join?
      </h1>
      <p className="mt-8 text-sm font-medium text-muted-foreground">
        No one else is here
      </p>

      <div className="mt-6 flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border bg-background px-5 py-4 text-left shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {INTERVIEW_ROLE_LABELS[role]} preview
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userName} - {room.type}
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="rounded-full bg-primary/10 px-5 text-primary shadow-none hover:bg-primary/15"
          onClick={onOpenDeviceSettings}
        >
          Setup
        </Button>
      </div>

      <Button
        size="lg"
        onClick={onJoin}
        className="mt-4 h-16 w-full max-w-sm rounded-full border-[5px] border-primary bg-primary text-base font-semibold text-primary-foreground shadow-none ring-2 ring-primary ring-offset-2 hover:bg-primary/92"
      >
        Join now
      </Button>

      <Button
        type="button"
        variant="outline"
        className="mt-8 h-12 rounded-full border-border bg-background px-8 text-primary shadow-sm hover:bg-secondary"
        onClick={onOpenAudioSettings}
      >
        Other ways to join
        <ChevronDown className="size-4" aria-hidden="true" />
      </Button>

      <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-2 text-left">
        <InfoPill icon={UserRound} label={INTERVIEW_ROLE_LABELS[role]} />
        <InfoPill icon={Clock3} label={room.duration} />
        <InfoPill icon={DoorOpen} label={room.roomId} />
      </div>

      {joinedIntent ? (
        <p className="mt-4 max-w-sm rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-5 text-primary">
          Opening your interview room...
        </p>
      ) : null}
    </aside>
  );
}

type InfoPillProps = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
};

function InfoPill({ icon: Icon, label }: InfoPillProps) {
  return (
    <div className="min-w-0 rounded-full border bg-background px-3 py-2 text-xs text-muted-foreground shadow-sm">
      <div className="flex min-w-0 items-center justify-center gap-1.5">
        <Icon className="size-3.5 shrink-0" aria-hidden={true} />
        <span className="truncate">{label}</span>
      </div>
    </div>
  );
}
