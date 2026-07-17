import { CalendarX2, Inbox, MessageSquareOff } from "lucide-react";

import { EmptyState } from "@/features/dashboard/components/empty-state";

export function NoUpcomingInterviewsEmptyState() {
  return (
    <EmptyState
      icon={CalendarX2}
      title="No upcoming interviews"
      description="Scheduled peer interviews will appear here once matching and scheduling are enabled."
      actionLabel="Find Interview"
    />
  );
}

export function NoFeedbackEmptyState() {
  return (
    <EmptyState
      icon={MessageSquareOff}
      title="No feedback yet"
      description="Feedback summaries and rubric notes will appear after completed interview sessions."
    />
  );
}

export function NoActivityEmptyState() {
  return (
    <EmptyState
      icon={Inbox}
      title="No activity yet"
      description="Your interviews, achievements, and account updates will collect here over time."
    />
  );
}
