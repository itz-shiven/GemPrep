"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Play, MessageSquareText } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create an Account",
    description: "Sign up with Google or email. Upload your resume to get started.",
  },
  {
    icon: Search,
    step: "02",
    title: "Find a Partner",
    description: "Join a public queue or create a private room and invite a friend.",
  },
  {
    icon: Play,
    step: "03",
    title: "Start the Interview",
    description:
      "Go through a structured 60-minute session: introduction, coding, discussion.",
  },
  {
    icon: MessageSquareText,
    step: "04",
    title: "Get Feedback",
    description: "Receive detailed ratings on technical skills, communication, and more.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Four steps to your{" "}
            <span className="gradient-text">best interview prep</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-12 bottom-12 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

          <div className="space-y-12">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-6 md:gap-8"
                >
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="pt-2">
                    <span className="text-xs font-mono text-primary/60 tracking-wider">
                      STEP {step.step}
                    </span>
                    <h3 className="text-xl font-semibold mt-1">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground max-w-md">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
