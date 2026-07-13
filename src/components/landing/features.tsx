"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Video,
  Brain,
  MessageSquare,
  Users,
  Shield,
  Timer,
  FileText,
} from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Real Human Interviews",
    description:
      "Practice with real engineers, not chatbots. Get genuine interview pressure and natural conversation flow.",
  },
  {
    icon: Code2,
    title: "Collaborative Code Editor",
    description:
      "Monaco-powered editor with real-time sync. Support for C++, Java, Python, JavaScript, and C.",
  },
  {
    icon: Video,
    title: "HD Video Calling",
    description:
      "Built-in peer-to-peer video calls. Camera, mic controls, and seamless connectivity throughout the session.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "AI silently generates follow-up questions for interviewers based on candidate responses. Never interrupts.",
  },
  {
    icon: Timer,
    title: "Structured Phases",
    description:
      "Every interview follows a clear timeline: Introduction, Coding Round, Discussion, and Feedback.",
  },
  {
    icon: MessageSquare,
    title: "Actionable Feedback",
    description:
      "Rate technical skills, communication, problem solving, and more. Grow with every session.",
  },
  {
    icon: FileText,
    title: "Resume Integration",
    description:
      "Upload your resume and have it visible during interviews. Interviewers can reference it in real time.",
  },
  {
    icon: Shield,
    title: "Private Rooms",
    description:
      "Create private interview rooms with unique codes. Practice with friends or study groups.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="gradient-text">prepare and succeed</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            A complete interview preparation platform built for software engineers
            who want real practice with real people.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative rounded-xl border border-border/50 bg-card/50 p-6 hover:bg-card/80 hover:border-primary/20 transition-all duration-300"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
