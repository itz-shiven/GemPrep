"use client";

import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LinkGenerator } from "@/features/interview-workspace/components/LinkGenerator";
import { RoleSelector } from "@/features/interview-workspace/components/RoleSelector";
import {
  type GeneratedInterview,
  type InterviewRole,
} from "@/features/interview-workspace/types/interview";
import { setStoredInterviewRole } from "@/features/interview-workspace/hooks/use-stored-interview-role";
import { ROUTES } from "@/lib/constants";

export function CreateInterview() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<InterviewRole | null>(null);
  const [interview, setInterview] = useState<GeneratedInterview | null>(null);

  function generateInterview(selectedRole: InterviewRole) {
    const roomId = createRoomId();
    const nextInterview: GeneratedInterview = {
      roomId,
      role: selectedRole,
      link: `https://gemprep.com/room/${roomId}`,
      status: "WAITING",
    };

    setRole(selectedRole);
    setInterview(nextInterview);
    setStoredInterviewRole(roomId, selectedRole);
  }

  function continueToWaitingRoom() {
    if (!interview) {
      return;
    }

    setOpen(false);
    router.push(ROUTES.roomWaiting(interview.roomId));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <PlusCircle className="size-4" />
          Create Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create interview link</DialogTitle>
          <DialogDescription>
            Choose your role, generate a shareable room link, then continue to
            the waiting room.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          <div>
            <p className="mb-3 text-sm font-medium">
              What role will you play in this interview?
            </p>
            <RoleSelector value={role} onChange={generateInterview} />
          </div>

          {interview ? (
            <LinkGenerator
              interview={interview}
              onContinue={continueToWaitingRoom}
            />
          ) : null}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function createRoomId() {
  return Math.random().toString(36).slice(2, 8);
}
