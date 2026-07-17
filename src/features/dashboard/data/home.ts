import type {
  ActivityItem,
  NotificationItem,
  PerformanceMetric,
  UpcomingInterview,
} from "@/features/dashboard/types";

export const upcomingInterview: UpcomingInterview = {
  interviewer: "Riya Sharma",
  scheduledFor: "Today, 6:30 PM",
  type: "Data structures mock",
  status: "Scheduled",
};

export const performanceMetrics: PerformanceMetric[] = [
  {
    label: "Interviews completed",
    value: "0",
    detail: "Ready to begin",
    trend: "steady",
  },
  {
    label: "Average score",
    value: "-",
    detail: "No scored sessions yet",
    trend: "steady",
  },
  {
    label: "Coding accuracy",
    value: "-",
    detail: "Starts after first interview",
    trend: "steady",
  },
  {
    label: "Improvement trend",
    value: "New",
    detail: "Baseline pending",
    trend: "up",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    title: "Profile setup completed",
    description: "Your GEMPREP identity is ready for dashboard workflows.",
    time: "Just now",
    kind: "achievement",
  },
  {
    title: "Feedback pipeline prepared",
    description: "Future peer review summaries will appear here.",
    time: "Today",
    kind: "feedback",
  },
  {
    title: "Interview workspace initialized",
    description: "Upcoming sessions and room access will be connected later.",
    time: "Today",
    kind: "interview",
  },
];

export const notifications: NotificationItem[] = [
  {
    title: "Dashboard foundation is ready",
    description: "Navigation, profile, wallet, and overview surfaces are live.",
    time: "Now",
    unread: true,
  },
  {
    title: "Onboarding sync enabled",
    description: "Clerk profile data is synced to the user record.",
    time: "Today",
  },
  {
    title: "Interview features pending",
    description: "Matching and room workflows are intentionally not connected.",
    time: "Phase 4",
  },
];
