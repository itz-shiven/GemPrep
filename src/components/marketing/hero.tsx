import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { heroStats, productSignals } from "@/lib/content/landing";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b bg-background">
      <HeroWorkspacePreview />
      <div className="site-container relative z-10 grid min-h-[calc(100svh-8rem)] content-center py-14 sm:py-20">
        <FadeIn className="max-w-3xl">
          <Badge variant="success">Private preview opening soon</Badge>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-normal text-foreground sm:text-7xl">
            GEMPREP
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            AI-powered peer-to-peer technical interview practice for software
            engineers who want sharper reps, better feedback, and calmer loops.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={ROUTES.signIn}>
                Login
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="#how-it-works">See workflow</Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x rounded-lg border bg-background/84 text-sm shadow-sm backdrop-blur">
            {heroStats.map((stat) => (
              <div key={stat.label} className="min-w-0 px-4 py-3">
                <p className="font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function HeroWorkspacePreview() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-secondary/45" />
      <div className="absolute left-1/2 top-10 hidden w-[940px] -translate-x-[18%] rounded-lg border bg-background/76 shadow-soft backdrop-blur-sm lg:block">
        <div className="flex h-12 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
            Live peer room
          </div>
        </div>
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-0">
          <div className="border-r p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">System design interview</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Design a low-latency code review queue
                </p>
              </div>
              <div className="rounded-md border bg-secondary px-2 py-1 text-xs">
                28:14
              </div>
            </div>
            <div className="mt-5 rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  SC
                </div>
                <div>
                  <p className="text-sm font-medium">Candidate explaining tradeoffs</p>
                  <p className="text-xs text-muted-foreground">
                    Consistency, throughput, failure modes
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 rounded-full bg-secondary" />
                <div className="h-2 w-4/5 rounded-full bg-secondary" />
                <div className="h-2 w-2/3 rounded-full bg-secondary" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["Clarify", "Design", "Review"].map((label, index) => (
                <div key={label} className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Phase {index + 1}</p>
                  <p className="mt-1 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm font-medium">AI review signals</p>
            <div className="mt-4 space-y-3">
              {productSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    key={signal.label}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {signal.label}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{signal.value}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="size-4 text-primary" />
                Next focused drill
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Practice concise requirement gathering before choosing storage
                and queueing primitives.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-5 rounded-lg border bg-background/82 p-4 shadow-soft backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Guided peer session</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Rubrics, timing, feedback, review
            </p>
          </div>
          <span className="rounded-md border bg-secondary px-2 py-1 text-xs">
            28:14
          </span>
        </div>
      </div>
    </div>
  );
}
