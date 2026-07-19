"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import { CheckCircle2, ClipboardCheck, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  InterviewRoomTheme,
  InterviewChecklistItem,
  InterviewProblem,
  ProblemExample,
  RoomRole,
} from "@/features/interview-room/types/interview-room";
import { cn } from "@/lib/utils";

type ProblemPanelProps = {
  problem: InterviewProblem;
  role: RoomRole;
  checklist: InterviewChecklistItem[];
  languageSelector?: ReactNode;
  theme: InterviewRoomTheme;
  className?: string;
};

export function ProblemPanel({
  problem,
  role,
  checklist,
  languageSelector,
  theme,
  className,
}: ProblemPanelProps) {
  const [evaluationNotes, setEvaluationNotes] = useState(
    "Strong initial approach. Watch for duplicate value handling.",
  );
  const [draftProblem, setDraftProblem] = useState(problem);
  const [items, setItems] = useState(checklist);
  const canEditProblem = role === "INTERVIEWER";
  const isDark = theme === "dark";

  function toggleChecklistItem(itemId: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  function updateProblemField(
    field: "title" | "description",
    value: string,
  ) {
    setDraftProblem((currentProblem) => ({
      ...currentProblem,
      [field]: value,
    }));
  }

  function updateExample(
    index: number,
    field: keyof ProblemExample,
    value: string,
  ) {
    setDraftProblem((currentProblem) => ({
      ...currentProblem,
      examples: currentProblem.examples.map((example, exampleIndex) =>
        exampleIndex === index ? { ...example, [field]: value } : example,
      ),
    }));
  }

  function updateConstraint(index: number, value: string) {
    setDraftProblem((currentProblem) => ({
      ...currentProblem,
      constraints: currentProblem.constraints.map((constraint, constraintIndex) =>
        constraintIndex === index ? value : constraint,
      ),
    }));
  }

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border shadow-2xl",
        isDark
          ? "border-white/10 bg-[#1f1f1f] text-white"
          : "border-neutral-300 bg-background text-foreground",
        className,
      )}
    >
      <div
        className={cn(
          "border-b p-3",
          isDark ? "border-white/10 bg-black/20" : "border-border bg-background",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={difficultyClassName(draftProblem.difficulty, theme)}>
            {draftProblem.difficulty}
          </Badge>
          {languageSelector}
        </div>
        {canEditProblem ? (
          <>
            <Input
              value={draftProblem.title}
              onChange={(event) =>
                updateProblemField("title", event.target.value)
              }
              aria-label="Edit problem title"
              className={cn(
                "mt-3 h-auto px-2 py-1.5 text-lg font-semibold tracking-normal shadow-none",
                isDark
                  ? "border-white/10 bg-neutral-950 text-white"
                  : "border-border bg-background text-foreground",
              )}
            />
            <Textarea
              value={draftProblem.description}
              onChange={(event) =>
                updateProblemField("description", event.target.value)
              }
              aria-label="Edit problem description"
              className={cn(
                "mt-2 min-h-20 text-sm leading-5 shadow-none",
                isDark
                  ? "border-white/10 bg-neutral-950 text-neutral-100"
                  : "border-border bg-background text-foreground",
              )}
            />
          </>
        ) : (
          <>
            <h1 className="mt-3 text-lg font-semibold tracking-normal">
              {draftProblem.title}
            </h1>
            <p
              className={cn(
                "mt-2 text-sm leading-5",
                isDark ? "text-neutral-300" : "text-muted-foreground",
              )}
            >
              {draftProblem.description}
            </p>
          </>
        )}
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 space-y-3 overflow-y-auto p-3",
          isDark ? "bg-[#1f1f1f]" : "bg-background",
        )}
      >
        <PanelSection title="Examples" icon={FileText} theme={theme}>
          <div className="space-y-3">
            {draftProblem.examples.map((example, index) => (
              <div
                key={`example-${index}`}
                className={cn(
                  "rounded-lg border p-2.5",
                  isDark
                    ? "border-white/10 bg-neutral-950"
                    : "border-border bg-secondary/30",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-semibold",
                    isDark ? "text-neutral-400" : "text-muted-foreground",
                  )}
                >
                  Example {index + 1}
                </p>
                {canEditProblem ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={example.input}
                      onChange={(event) =>
                        updateExample(index, "input", event.target.value)
                      }
                      aria-label={`Edit example ${index + 1} input`}
                      className={cn(
                        "min-h-16 font-mono text-[11px] leading-5",
                        isDark
                          ? "border-white/10 bg-black/35 text-neutral-100"
                          : "border-border bg-background text-foreground",
                      )}
                    />
                    <Textarea
                      value={example.output}
                      onChange={(event) =>
                        updateExample(index, "output", event.target.value)
                      }
                      aria-label={`Edit example ${index + 1} output`}
                      className={cn(
                        "min-h-14 font-mono text-[11px] leading-5",
                        isDark
                          ? "border-white/10 bg-black/35 text-neutral-100"
                          : "border-border bg-background text-foreground",
                      )}
                    />
                    <Textarea
                      value={example.explanation}
                      onChange={(event) =>
                        updateExample(index, "explanation", event.target.value)
                      }
                      aria-label={`Edit example ${index + 1} explanation`}
                      className={cn(
                        "min-h-16 text-xs leading-5",
                        isDark
                          ? "border-white/10 bg-black/35 text-neutral-100"
                          : "border-border bg-background text-foreground",
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <pre
                      className={cn(
                        "mt-2 whitespace-pre-wrap rounded-md p-2.5 font-mono text-[11px] leading-5",
                        isDark
                          ? "bg-black/35 text-neutral-200"
                          : "bg-background text-foreground",
                      )}
                    >
                      Input: {example.input}
                      {"\n"}Output: {example.output}
                    </pre>
                    <p
                      className={cn(
                        "mt-2 text-xs leading-5",
                        isDark ? "text-neutral-400" : "text-muted-foreground",
                      )}
                    >
                      {example.explanation}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </PanelSection>

        <PanelSection title="Constraints" icon={ClipboardCheck} theme={theme}>
          <ul
            className={cn(
              "space-y-1.5 text-sm leading-5",
              isDark ? "text-neutral-300" : "text-muted-foreground",
            )}
          >
            {draftProblem.constraints.map((constraint, index) => (
              <li key={`constraint-${index}`} className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {canEditProblem ? (
                  <Textarea
                    value={constraint}
                    onChange={(event) =>
                      updateConstraint(index, event.target.value)
                    }
                    aria-label={`Edit constraint ${index + 1}`}
                    className={cn(
                      "min-h-10 text-sm leading-5",
                      isDark
                        ? "border-white/10 bg-neutral-950 text-neutral-100"
                        : "border-border bg-background text-foreground",
                    )}
                  />
                ) : (
                  <span>{constraint}</span>
                )}
              </li>
            ))}
          </ul>
        </PanelSection>

        {role === "INTERVIEWER" ? (
          <>
            <PanelSection title="Evaluation notes" icon={FileText} theme={theme}>
              <Textarea
                value={evaluationNotes}
                onChange={(event) => setEvaluationNotes(event.target.value)}
                className={cn(
                  "min-h-24",
                  isDark
                    ? "border-white/10 bg-neutral-950 text-neutral-100 placeholder:text-neutral-500"
                    : "border-border bg-background text-foreground placeholder:text-muted-foreground",
                )}
                placeholder="Capture signal, follow-ups, and feedback..."
              />
            </PanelSection>

            <PanelSection title="Interview checklist" icon={ClipboardCheck} theme={theme}>
              <div className="space-y-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 text-sm",
                      isDark
                        ? "border-white/10 bg-neutral-950 text-neutral-200"
                        : "border-border bg-secondary/30 text-foreground",
                    )}
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
          <PanelSection title="Notes" icon={FileText} theme={theme}>
            <ul
              className={cn(
                "space-y-1.5 text-sm leading-5",
                isDark ? "text-neutral-300" : "text-muted-foreground",
              )}
            >
              {draftProblem.notes.map((note) => (
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
  theme: InterviewRoomTheme;
};

function PanelSection({ title, icon: Icon, children, theme }: PanelSectionProps) {
  const isDark = theme === "dark";

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden={true} />
        <h2
          className={cn(
            "text-sm font-semibold",
            isDark ? "text-neutral-100" : "text-foreground",
          )}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function difficultyClassName(
  difficulty: InterviewProblem["difficulty"],
  theme: InterviewRoomTheme,
) {
  const isDark = theme === "dark";

  if (difficulty === "Easy") {
    return isDark
      ? "border-emerald-400/20 bg-emerald-500/[0.12] text-emerald-200"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (difficulty === "Hard") {
    return isDark
      ? "border-red-400/20 bg-red-500/[0.12] text-red-200"
      : "border-red-200 bg-red-50 text-red-700";
  }

  return isDark
    ? "border-amber-400/20 bg-amber-500/[0.12] text-amber-200"
    : "border-amber-200 bg-amber-50 text-amber-700";
}
