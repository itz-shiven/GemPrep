"use client";

import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  INTERVIEW_ROLE_LABELS,
  type GeneratedInterview,
} from "@/features/interview-workspace/types/interview";

type LinkGeneratorProps = {
  interview: GeneratedInterview;
  onContinue: () => void;
};

export function LinkGenerator({ interview, onContinue }: LinkGeneratorProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(interview.link);
    setCopied(true);
    toast.success("Interview link copied.");
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({
        title: "GEMPREP interview room",
        text: "Join my GEMPREP mock interview room.",
        url: interview.link,
      });
      return;
    }

    await copyLink();
  }

  return (
    <div className="space-y-4 rounded-lg border bg-secondary/35 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">Link generated</Badge>
        <Badge variant="outline">
          You: {INTERVIEW_ROLE_LABELS[interview.role]}
        </Badge>
        <Badge variant="muted">
          Invite: {INTERVIEW_ROLE_LABELS[interview.inviteRole]}
        </Badge>
        <Badge variant="muted">Status: {interview.status}</Badge>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Generated room link</p>
        <p className="text-xs text-muted-foreground">
          Anyone using this link joins as{" "}
          {INTERVIEW_ROLE_LABELS[interview.inviteRole]} for this room.
        </p>
        <div className="flex gap-2">
          <Input value={interview.link} readOnly aria-label="Generated room link" />
          <Button type="button" variant="outline" size="icon" onClick={copyLink}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" onClick={shareLink}>
          <Share2 className="size-4" />
          Share
        </Button>
        <Button type="button" onClick={onContinue}>
          Continue to waiting
          <ExternalLink className="size-4" />
        </Button>
      </div>
    </div>
  );
}
