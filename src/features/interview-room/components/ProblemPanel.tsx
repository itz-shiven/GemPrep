"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import { CheckCircle2, ClipboardCheck, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type {
  InterviewChecklistItem,
  InterviewProblem,
  RoomRole,
} from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type ProblemPanelProps = {
  problem: InterviewProblem;
  role: RoomRole;
  checklist: InterviewChecklistItem[];
  className?: string;
};

export function ProblemPanel({
  problem,
  role,
  checklist,
  className,
}: ProblemPanelProps) {
  const [evaluationNotes, setEvaluationNotes] = useState(
    "Strong initial approach. Watch for duplicate value handling.",
  );
  const [items, setItems] = useState(checklist);

  function toggleChecklistItem(itemId: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-black text-white shadow-2xl",
        className,
      )}
    >
      <div className="border-b border-white/10 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={difficultyClassName(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
          <Badge className="border-white/10 bg-white/[0.08] text-neutral-200">
            Problem Workspace
          </Badge>
        </div>
        <h1 className="mt-3 text-lg font-semibold tracking-normal">
          {problem.title}
        </h1>
        <p className="mt-2 text-sm leading-5 text-neutral-300">
          {problem.description}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <PanelSection title="Examples" icon={FileText}>
          <div className="space-y-3">
            {problem.examples.map((example, index) => (
              <div
                key={`${example.input}-${index}`}
                className="rounded-lg border border-white/10 bg-neutral-950 p-2.5"
              >
                <p className="text-xs font-semibold text-neutral-400">
                  Example {index + 1}
                </p>
                <pre className="mt-2 whitespace-pre-wrap rounded-md bg-black/35 p-2.5 font-mono text-[11px] leading-5 text-neutral-200">
                  Input: {example.input}
                  {"\n"}Output: {example.output}
                </pre>
                <p className="mt-2 text-xs leading-5 text-neutral-400">
                  {example.explanation}
                </p>
              </div>
            ))}
          </div>
        </PanelSection>

        <PanelSection title="Constraints" icon={ClipboardCheck}>
          <ul className="space-y-1.5 text-sm leading-5 text-neutral-300">
            {problem.constraints.map((constraint) => (
              <li key={constraint} className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </PanelSection>

        {role === "INTERVIEWER" ? (
          <>
            <PanelSection title="Evaluation notes" icon={FileText}>
              <Textarea
                value={evaluationNotes}
                onChange={(event) => setEvaluationNotes(event.target.value)}
                className="min-h-24 border-white/10 bg-neutral-950 text-neutral-100 placeholder:text-neutral-500"
                placeholder="Capture signal, follow-ups, and feedback..."
              />
            </PanelSection>

            <PanelSection title="Interview checklist" icon={ClipboardCheck}>
              <div className="space-y-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-neutral-950 p-2.5 text-sm text-neutral-200"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="size-4 accent-emerald-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </PanelSection>
          </>
        ) : (
          <PanelSection title="Notes" icon={FileText}>
            <ul className="space-y-1.5 text-sm leading-5 text-neutral-300">
              {problem.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </PanelSection>
        )}
      </div>
    </section>
  );
}

type PanelSectionProps = {
  title: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: ReactNode;
};

function PanelSection({ title, icon: Icon, children }: PanelSectionProps) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden={true} />
        <h2 className="text-sm font-semibold text-neutral-100">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function difficultyClassName(difficulty: InterviewProblem["difficulty"]) {
  if (difficulty === "Easy") {
    return "border-emerald-400/20 bg-emerald-500/[0.12] text-emerald-200";
  }

  if (difficulty === "Hard") {
    return "border-red-400/20 bg-red-500/[0.12] text-red-200";
  }

  return "border-amber-400/20 bg-amber-500/[0.12] text-amber-200";
}
