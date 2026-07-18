import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  CalendarClock,
  Code2,
  FileCheck2,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Video,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Step = {
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const navigationItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const featureHighlights: Feature[] = [
  {
    title: "Peer matching that respects level",
    description:
      "Match by role, target company band, language, topic focus, timezone, and practice intensity.",
    icon: UsersRound,
  },
  {
    title: "AI-calibrated interview loops",
    description:
      "Rubrics guide every session so feedback is consistent, specific, and comparable over time.",
    icon: BrainCircuit,
  },
  {
    title: "Real coding environments",
    description:
      "Practice algorithms, system design, debugging, and communication with shared prompts and notes.",
    icon: Code2,
  },
  {
    title: "Live rooms with structured flow",
    description:
      "Timed phases, interviewer cues, candidate prompts, and post-round review keep practice focused.",
    icon: Video,
  },
  {
    title: "Actionable review history",
    description:
      "Track strengths, misses, rubric trends, and next drills without turning prep into admin work.",
    icon: FileCheck2,
  },
  {
    title: "Trust and accountability",
    description:
      "Availability signals, completion records, peer ratings, and moderation tools keep sessions reliable.",
    icon: ShieldCheck,
  },
];

export const workflowSteps: Step[] = [
  {
    title: "Set your target",
    description:
      "Choose role level, interview type, company style, topics, and schedule preferences.",
  },
  {
    title: "Match with the right peer",
    description:
      "GEMPREP pairs you with someone who can challenge your current edge and learn from yours.",
  },
  {
    title: "Run a guided session",
    description:
      "The room keeps both sides on track with timing, prompts, scoring, and feedback checkpoints.",
  },
  {
    title: "Review the signal",
    description:
      "AI summarizes patterns, peer notes, rubric scores, and focused drills for the next round.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The rubric made feedback feel concrete. I knew exactly which communication habits to practice before my onsite loop.",
    name: "Maya Chen",
    role: "Backend engineer",
    initials: "MC",
  },
  {
    quote:
      "It feels like a serious practice room, not a chat app with a timer. The structure changed how my study group runs interviews.",
    name: "Arjun Patel",
    role: "Staff candidate",
    initials: "AP",
  },
  {
    quote:
      "The matching quality mattered most. I stopped wasting sessions on mismatched levels and started getting usable signal.",
    name: "Nora Williams",
    role: "Frontend engineer",
    initials: "NW",
  },
];

export const pricingPlans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    description: "For building a weekly interview habit.",
    cta: "Join free",
    features: ["2 peer sessions per month", "Core rubrics", "Session notes", "Community matching"],
  },
  {
    name: "Pro",
    price: "$19",
    description: "For candidates actively preparing for loops.",
    cta: "Join waitlist",
    highlighted: true,
    features: [
      "Unlimited peer sessions",
      "AI review summaries",
      "Advanced topic targeting",
      "Progress history",
    ],
  },
  {
    name: "Teams",
    price: "Custom",
    description: "For bootcamps, universities, and engineering teams.",
    cta: "Talk to us",
    features: ["Private cohorts", "Admin insights", "Custom rubrics", "Priority support"],
  },
];

export const faqs = [
  {
    question: "How does GEMPREP match me with a peer?",
    answer:
      "Matching is designed around role, seniority, target interview type, preferred language, topic focus, availability, and completion history so sessions feel relevant instead of random.",
  },
  {
    question: "What happens inside a live interview room?",
    answer:
      "You get a structured room with video, a LeetCode-style problem and code workspace, test cases, timer, role-specific controls, and a guided flow for candidate and interviewer.",
  },
  {
    question: "Does the AI interview me directly?",
    answer:
      "The core session is peer-to-peer. AI supports the loop by organizing rubrics, highlighting feedback themes, and suggesting focused drills after the conversation.",
  },
  {
    question: "Can I practice system design and behavioral rounds too?",
    answer:
      "Yes. GEMPREP is built to support coding, system design, behavioral, debugging, and role-specific technical screens with different prompts and evaluation rubrics.",
  },
  {
    question: "What are gems used for?",
    answer:
      "Gems are planned as the platform credit system for creating, joining, and rewarding interview sessions. The goal is to encourage reliable participation and balanced give-and-take.",
  },
  {
    question: "How is feedback kept useful and fair?",
    answer:
      "Sessions are anchored to shared rubrics, required examples, and calibrated scoring so feedback is easier to compare across rounds.",
  },
  {
    question: "What if my peer misses the session?",
    answer:
      "Reliability signals, completion history, and session status are designed to help reduce no-shows. Missed-session handling can be layered into gems, ratings, and rematching flows.",
  },
  {
    question: "Is my interview data private?",
    answer:
      "The product is structured so identity, room access, and session records can be protected by authenticated routes and scoped permissions. Private rooms and data controls are part of the SaaS foundation.",
  },
] as const;

export const heroStats = [
  { label: "Rubric categories", value: "12" },
  { label: "Practice modes", value: "5" },
  { label: "Review loop", value: "< 2m" },
] as const;

export const productSignals = [
  { label: "Peer match", value: "96%", icon: Sparkles },
  { label: "Next session", value: "Today 6:30 PM", icon: CalendarClock },
  { label: "Feedback depth", value: "Strong", icon: MessagesSquare },
] as const;
