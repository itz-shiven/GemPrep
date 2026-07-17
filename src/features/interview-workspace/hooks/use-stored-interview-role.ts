"use client";

import { useSyncExternalStore } from "react";

import {
  INTERVIEW_ROOM_STORAGE_PREFIX,
  type InterviewRole,
} from "@/features/interview-workspace/types/interview";

export function useStoredInterviewRole(
  roomId: string,
  fallbackRole: InterviewRole,
) {
  return useSyncExternalStore(
    subscribeToRoleChanges,
    () => getStoredInterviewRole(roomId) ?? fallbackRole,
    () => fallbackRole,
  );
}

export function getStoredInterviewRole(roomId: string): InterviewRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedRole = sessionStorage.getItem(getInterviewRoleStorageKey(roomId));

  if (storedRole === "INTERVIEWER" || storedRole === "CANDIDATE") {
    return storedRole;
  }

  return null;
}

export function setStoredInterviewRole(roomId: string, role: InterviewRole) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(getInterviewRoleStorageKey(roomId), role);
  window.dispatchEvent(new StorageEvent("storage"));
}

function subscribeToRoleChanges(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);

  return () => window.removeEventListener("storage", onStoreChange);
}

function getInterviewRoleStorageKey(roomId: string) {
  return `${INTERVIEW_ROOM_STORAGE_PREFIX}.${roomId}`;
}
