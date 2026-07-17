"use client";

import {
  ArrowUpRight,
  Award,
  CalendarClock,
  CheckCircle2,
  Code2,
  Gem,
  MessageSquareText,
  Plus,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardUser } from "@/features/dashboard/components/dashboard-user-context";
import {
  performanceMetrics,
  recentActivity,
  upcomingInterview,
} from "@/features/dashboard/data/home";
import type { ActivityItem } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

export function DashboardHome() {
  const user = useDashboardUser();
  const firstName = user.fullName.split(" ")[0] || "there";
  const metrics = performanceMetrics.map((metric) =>
    metric.label === "Interviews completed"
      ? {
          ...metric,
          value: String(user.interviewsCompleted),
          detail:
            user.interviewsCompleted > 0
              ? "Total completed sessions"
              : metric.detail,
        }
      : metric,
  );

  return (
    <div className="space-y-6">
      <WelcomeHeader firstName={firstName} />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <UpcomingInterviewsCard />
        <GemsWalletCard gems={user.gems} />
      </div>

      <PerformanceOverview metrics={metrics} />

      <RecentActivity />
    </div>
  );
}

function WelcomeHeader({ firstName }: { firstName: string }) {
  return (
    <section className="rounded-lg border bg-background p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge variant="success">Dashboard foundation</Badge>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-normal sm:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Stay consistent. Every focused mock interview makes the real loop
            feel a little more familiar.
          </p>
        </div>
        <Button size="lg" disabled className="w-full sm:w-auto">
          Find Interview
          <ArrowUpRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function UpcomingInterviewsCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>
            Your next scheduled practice session will be shown here.
          </CardDescription>
        </div>
        <span className="grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
          <CalendarClock className="size-5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-secondary/35 p-4">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-full border bg-background text-sm font-semibold">
                RS
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{upcomingInterview.interviewer}</p>
                  <Badge variant="outline">{upcomingInterview.status}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <span>{upcomingInterview.scheduledFor}</span>
                  <span>{upcomingInterview.type}</span>
                </div>
              </div>
            </div>
            <Button disabled>
              Join
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GemsWalletCard({ gems }: { gems: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Gems Wallet</CardTitle>
            <CardDescription>
              Gems will power future peer interview actions.
            </CardDescription>
          </div>
          <span className="grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
            <WalletCards className="size-5" aria-hidden="true" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-secondary/35 p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current gems</p>
              <div className="mt-2 flex items-center gap-2">
                <Gem className="size-5 text-primary" aria-hidden="true" />
                <span className="text-4xl font-semibold tracking-normal">
                  {gems}
                </span>
              </div>
            </div>
            <Badge variant="muted">Wallet ready</Badge>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button disabled>
              <Plus className="size-4" />
              Buy gems
            </Button>
            <Button variant="outline" disabled>
              Earn gems
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceOverview({
  metrics,
}: {
  metrics: typeof performanceMetrics;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Baseline metrics will update after interview sessions are connected.
          </CardDescription>
        </div>
        <span className="grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
          <TrendingUp className="size-5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border bg-secondary/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    metric.trend === "up" && "bg-primary",
                    metric.trend === "steady" && "bg-muted-foreground/35",
                    metric.trend === "down" && "bg-destructive",
                  )}
                />
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-normal">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Past interviews, feedback, and achievements will collect here.
          </CardDescription>
        </div>
        <span className="grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
          <MessageSquareText className="size-5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="divide-y rounded-lg border bg-secondary/35">
          {recentActivity.map((item) => (
            <ActivityRow key={item.title} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon =
    item.kind === "achievement"
      ? Award
      : item.kind === "feedback"
        ? CheckCircle2
        : Code2;

  return (
    <div className="flex gap-3 p-4">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md border bg-background text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">{item.title}</p>
          <span className="text-xs text-muted-foreground">{item.time}</span>
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {item.description}
        </p>
      </div>
    </div>
  );
}
