"use client";

import { useEffect, useState } from "react";
import type { Awareness } from "y-protocols/awareness";

import type {
  CollaborativeEditorUser,
  EditorPresenceUser,
} from "@/features/collaborative-editor/types/editor";

type AwarenessUserState = {
  user?: {
    id: string;
    name: string;
    role: CollaborativeEditorUser["role"];
    color: string;
  };
  status?: "editing" | "viewing";
};

export function useEditorPresence(
  awareness: Awareness | null,
  currentUser: CollaborativeEditorUser,
  canEdit: boolean,
) {
  const [participants, setParticipants] = useState<EditorPresenceUser[]>([]);

  useEffect(() => {
    if (!awareness) {
      return;
    }

    const activeAwareness = awareness;
    const color = getPresenceColor(currentUser.role);

    activeAwareness.setLocalStateField("user", {
      id: currentUser.id,
      name: currentUser.name,
      role: currentUser.role,
      color,
    });
    activeAwareness.setLocalStateField(
      "status",
      canEdit ? "editing" : "viewing",
    );

    function syncPresence() {
      const nextParticipants: EditorPresenceUser[] = [];

      activeAwareness.getStates().forEach((state, clientId) => {
        const typedState = state as AwarenessUserState;

        if (!typedState.user) {
          return;
        }

        nextParticipants.push({
          clientId,
          id: typedState.user.id,
          name: typedState.user.name,
          role: typedState.user.role,
          color: typedState.user.color,
          status: typedState.status ?? "viewing",
        });
      });

      setParticipants(nextParticipants);
    }

    syncPresence();
    activeAwareness.on("change", syncPresence);

    return () => {
      activeAwareness.off("change", syncPresence);
      activeAwareness.setLocalState(null);
    };
  }, [awareness, canEdit, currentUser.id, currentUser.name, currentUser.role]);

  return participants;
}

function getPresenceColor(role: CollaborativeEditorUser["role"]) {
  return role === "CANDIDATE" ? "#38bdf8" : "#34d399";
}
