"use client";

import type { ComponentType } from "react";
import {
  AudioLines,
  Clock3,
  DoorOpen,
  MonitorCog,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  const roleDestination =
    role === "CANDIDATE"
      ? "Will enter coding environment after joining."
      : "Will enter interviewer workspace after joining.";

  return (
    <aside className="flex h-full flex-col rounded-xl border border-white/10 bg-background p-5 text-foreground shadow-2xl lg:p-6">
      <div>
        <Badge variant="success">Waiting room</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal">
          Ready to join?
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Check your role and device state before entering the interview.
        </p>
      </div>

      <div className="mt-7 space-y-3 rounded-lg border bg-secondary/40 p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border bg-background text-muted-foreground">
            <UserRound className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="text-xs text-muted-foreground">
              Role: {INTERVIEW_ROLE_LABELS[role]}
            </p>
          </div>
        </div>
        <p className="rounded-md border bg-background px-3 py-2 text-xs leading-5 text-muted-foreground">
          {roleDestination}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <InfoRow icon={ShieldCheck} label="Interview type" value={room.type} />
        <InfoRow icon={Clock3} label="Duration" value={room.duration} />
        <InfoRow icon={DoorOpen} label="Room ID" value={room.roomId} />
      </div>

      <div className="mt-6 grid gap-3">
        <Button size="lg" onClick={onJoin}>
          Join Interview
        </Button>
        {joinedIntent ? (
          <p className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-5 text-primary">
            Mock join confirmed. The role-specific room will be implemented in
            the next product phase.
          </p>
        ) : null}
      </div>

      <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Button variant="outline" onClick={onOpenDeviceSettings}>
          <MonitorCog className="size-4" />
          Device settings
        </Button>
        <Button variant="outline" onClick={onOpenAudioSettings}>
          <AudioLines className="size-4" />
          Audio settings
        </Button>
      </div>
    </aside>
  );
}

type InfoRowProps = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
      <span className="grid size-9 place-items-center rounded-md bg-secondary text-muted-foreground">
        <Icon className="size-4" aria-hidden={true} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
