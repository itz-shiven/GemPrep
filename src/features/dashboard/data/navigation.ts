import {
  BarChart3,
  CalendarClock,
  Home,
  MessageSquareText,
  Settings,
  UserRound,
  Video,
  WalletCards,
} from "lucide-react";

import { ROUTES } from "@/lib/constants";
import type { DashboardNavSection } from "@/features/dashboard/types";

export const dashboardNavigation: DashboardNavSection[] = [
  {
    items: [
      {
        title: "Overview",
        href: ROUTES.dashboard,
        icon: Home,
        active: true,
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        title: "Interview Workspace",
        href: ROUTES.interviewWorkspace,
        icon: Video,
      },
      {
        title: "Schedule",
        href: ROUTES.dashboard,
        icon: CalendarClock,
        disabled: true,
      },
      {
        title: "Feedback",
        href: ROUTES.dashboard,
        icon: MessageSquareText,
        disabled: true,
      },
      {
        title: "Performance",
        href: ROUTES.dashboard,
        icon: BarChart3,
        disabled: true,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Wallet",
        href: ROUTES.dashboard,
        icon: WalletCards,
        disabled: true,
      },
      {
        title: "Profile",
        href: ROUTES.dashboard,
        icon: UserRound,
        disabled: true,
      },
      {
        title: "Settings",
        href: ROUTES.dashboard,
        icon: Settings,
        disabled: true,
      },
    ],
  },
];
