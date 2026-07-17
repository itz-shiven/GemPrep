"use client";

import { FormEvent, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ChatMessage,
  RoomRole,
} from "@/features/interview-room/types/interview-room";
import { INTERVIEW_ROLE_LABELS } from "@/features/interview-workspace/types/interview";

type ChatPanelProps = {
  initialMessages: ChatMessage[];
  currentUserName: string;
  currentRole: RoomRole;
};

export function ChatPanel({
  initialMessages,
  currentUserName,
  currentRole,
}: ChatPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const messageBody = draft.trim();

    if (!messageBody) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `message-${Date.now()}`,
        author: currentUserName,
        role: currentRole,
        timestamp: "Now",
        body: messageBody,
      },
    ]);
    setDraft("");
  }

  return (
    <div className="flex min-h-[24rem] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <article
            key={message.id}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-white">
                {message.author}
              </p>
              <span className="text-xs text-neutral-500">
                {message.timestamp}
              </span>
            </div>
            <p className="mt-1 text-[11px] font-medium uppercase text-neutral-500">
              {INTERVIEW_ROLE_LABELS[message.role]}
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-300">
              {message.body}
            </p>
          </article>
        ))}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={handleSendMessage}>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Message the room"
          aria-label="Chat message"
          className="border-white/10 bg-neutral-950 text-white placeholder:text-neutral-500"
        />
        <Button type="submit" size="icon" aria-label="Send message">
          <SendHorizontal className="size-4" />
        </Button>
      </form>
    </div>
  );
}
