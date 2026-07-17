import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

type SignInShowcaseProps = {
  children: ReactNode;
};

const authSignals = [
  {
    icon: ShieldCheck,
    label: "Secure identity",
    value: "Clerk sessions",
  },
  {
    icon: Clock3,
    label: "Setup state",
    value: "Onboarding aware",
  },
  {
    icon: MessageSquareText,
    label: "Profile sync",
    value: "Supabase ready",
  },
] as const;

export function SignInShowcase({ children }: SignInShowcaseProps) {
  return (
    <main className="min-h-screen bg-secondary/45">
      <div className="site-container grid min-h-screen gap-10 py-8 lg:grid-cols-[1fr_28rem] lg:items-center lg:py-12">
        <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-between lg:min-h-[42rem]">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <Button asChild variant="quiet" size="sm">
              <Link href={ROUTES.home}>
                Back home
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="max-w-2xl py-14 lg:py-0">
            <Badge variant="success">Welcome back</Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              Sign in and continue your interview prep loop.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              GEMPREP keeps identity, onboarding, and profile sync ready before
              the application moves into matching and interview rooms.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {authSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    key={signal.label}
                    className="rounded-lg border bg-background p-4 shadow-sm"
                  >
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                    <p className="mt-4 text-sm font-medium">{signal.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {signal.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <SessionPreview />
        </section>

        <aside className="mx-auto w-full max-w-md lg:mx-0">
          <div className="rounded-lg border bg-background p-2 shadow-soft">
            {children}
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            New accounts are redirected to onboarding when profile setup is
            incomplete.
          </p>
        </aside>
      </div>
    </main>
  );
}

function SessionPreview() {
  return (
    <div
      className="hidden max-w-2xl rounded-lg border bg-background p-4 shadow-sm lg:block"
      aria-label="GEMPREP session preview"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <p className="text-sm font-medium">Technical screen readiness</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Profile, session, and review primitives
          </p>
        </div>
        <Badge variant="outline">Foundation</Badge>
      </div>

      <div className="grid gap-3 pt-4 sm:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
              <Code2 className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium">Next practice path</p>
              <p className="text-xs text-muted-foreground">
                Coding fundamentals
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-2 rounded-full bg-secondary" />
            <div className="h-2 w-4/5 rounded-full bg-secondary" />
            <div className="h-2 w-2/3 rounded-full bg-secondary" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
            Ready state
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Authenticated session</li>
            <li>Profile record synced</li>
            <li>Dashboard shell gated</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
