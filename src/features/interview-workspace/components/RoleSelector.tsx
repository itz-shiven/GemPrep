"use client";

import { BriefcaseBusiness, Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { InterviewRole } from "@/features/interview-workspace/types/interview";
import { cn } from "@/lib/utils";

type RoleSelectorProps = {
  value: InterviewRole | null;
  onChange: (role: InterviewRole) => void;
};

const roleOptions = [
  {
    role: "INTERVIEWER" as const,
    title: "Interviewer",
    description: "Guide the session, ask follow-ups, and review the candidate.",
    icon: BriefcaseBusiness,
  },
  {
    role: "CANDIDATE" as const,
    title: "Candidate",
    description: "Join the session as the person solving and explaining.",
    icon: Code2,
  },
] as const;

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roleOptions.map((option) => {
        const Icon = option.icon;
        const selected = value === option.role;

        return (
          <button
            key={option.role}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.role)}
            className={cn(
              "focus-ring rounded-lg border bg-background p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/50",
              selected && "border-primary bg-primary/5",
            )}
          >
            <span className="grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold">{option.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {option.description}
            </p>
          </button>
        );
      })}
      <Button className="sr-only" type="button">
        Select role
      </Button>
    </div>
  );
}
