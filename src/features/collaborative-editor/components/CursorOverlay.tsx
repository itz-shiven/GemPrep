"use client";

import { MousePointer2 } from "lucide-react";

import type { EditorPresenceUser } from "@/features/collaborative-editor/types/editor";

type CursorOverlayProps = {
  participants: EditorPresenceUser[];
};

export function CursorOverlay({ participants }: CursorOverlayProps) {
  const remoteUsers = participants.slice(0, 2);

  return (
    <div className="hidden items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-neutral-300 xl:flex">
      <MousePointer2 className="size-3.5 text-primary" aria-hidden="true" />
      <span>{remoteUsers.length > 1 ? "Remote cursors live" : "Cursor sync ready"}</span>
    </div>
  );
}
