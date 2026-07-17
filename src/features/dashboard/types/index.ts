import type { LucideIcon } from "lucide-react";

export type DashboardUser = {
  id: string;
  fullName: string;
  email: string;
  username: string | null;
  avatar: string | null;
  gems: number;
  interviewsCompleted: number;
};

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
};

export type DashboardNavSection = {
  title?: string;
  items: DashboardNavItem[];
};

export type UpcomingInterview = {
  interviewer: string;
  scheduledFor: string;
  type: string;
  status: "Scheduled" | "Starting soon" | "Needs confirmation";
};

export type PerformanceMetric = {
  label: string;
  value: string;
  detail: string;
  trend: "up" | "steady" | "down";
};

export type ActivityItem = {
  title: string;
  description: string;
  time: string;
  kind: "interview" | "feedback" | "achievement";
};

export type NotificationItem = {
  title: string;
  description: string;
  time: string;
  unread?: boolean;
};
