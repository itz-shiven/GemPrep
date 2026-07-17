"use client";

import { motion } from "framer-motion";
import { ArrowRight, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateInterview } from "@/features/interview-workspace/components/CreateInterview";
import { JoinInterview } from "@/features/interview-workspace/components/JoinInterview";

export function InterviewWorkspace() {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-lg border bg-background p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="success">Interview Workspace</Badge>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-normal sm:text-4xl">
              Create or join a peer interview room.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Generate a mock interview link, share it with a peer, or enter a
              room link to preview the waiting-room flow.
            </p>
          </div>
          <CreateInterview />
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <span className="mb-3 grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
              <Video className="size-5" aria-hidden="true" />
            </span>
            <CardTitle>Create interview link</CardTitle>
            <CardDescription>
              Select your role first. GEMPREP will create a mock room link and
              send you to the waiting area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-secondary/35 p-4">
              <p className="text-sm font-medium">Creation flow</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-2">
                  <ArrowRight className="mt-1 size-4 shrink-0 text-primary" />
                  Choose interviewer or candidate.
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="mt-1 size-4 shrink-0 text-primary" />
                  Copy or share the generated room link.
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="mt-1 size-4 shrink-0 text-primary" />
                  Continue to the pre-join waiting room.
                </li>
              </ul>
              <div className="mt-5">
                <CreateInterview />
              </div>
            </div>
          </CardContent>
        </Card>

        <JoinInterview />
      </div>
    </div>
  );
}
