"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import {
  ConnectionState,
  RoomEvent,
  type RemoteParticipant,
} from "livekit-client";

import type {
  InterviewTimerSnapshot,
  InterviewTimerStatus,
  RoomRole,
} from "@/features/interview-room/types/interview-room";

type SyncedInterviewTimerParams = {
  initialSeconds: number;
  role: RoomRole;
  roomId: string;
};

type TimerStateMessage = {
  type: "state";
  snapshot: InterviewTimerSnapshot;
};

type TimerSyncRequestMessage = {
  type: "sync-request";
};

type TimerMessage = TimerStateMessage | TimerSyncRequestMessage;

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export function useSyncedInterviewTimer({
  initialSeconds,
  role,
  roomId,
}: SyncedInterviewTimerParams) {
  const room = useRoomContext();
  const canControlTimer = role === "INTERVIEWER";
  const topic = useMemo(() => `gemprep.timer.${roomId}`, [roomId]);
  const [snapshot, setSnapshot] = useState<InterviewTimerSnapshot>(() => ({
    status: "idle",
    elapsedSeconds: initialSeconds,
    updatedAt: Date.now(),
  }));
  const [displaySeconds, setDisplaySeconds] = useState(initialSeconds);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  const publishMessage = useCallback(
    (message: TimerMessage) => {
      const payload = textEncoder.encode(JSON.stringify(message));

      void room.localParticipant.publishData(payload, {
        reliable: true,
        topic,
      }).catch(() => undefined);
    },
    [room, topic],
  );

  const publishSnapshot = useCallback(
    (nextSnapshot: InterviewTimerSnapshot) => {
      publishMessage({
        type: "state",
        snapshot: nextSnapshot,
      });
    },
    [publishMessage],
  );

  const setAuthoritativeSnapshot = useCallback(
    (nextSnapshot: InterviewTimerSnapshot) => {
      setSnapshot(nextSnapshot);
      snapshotRef.current = nextSnapshot;

      if (canControlTimer) {
        publishSnapshot(nextSnapshot);
      }
    },
    [canControlTimer, publishSnapshot],
  );

  const startTimer = useCallback(() => {
    if (!canControlTimer) {
      return;
    }

    const now = Date.now();
    const elapsedSeconds = getElapsedSeconds(snapshotRef.current, now);

    setAuthoritativeSnapshot({
      status: "running",
      elapsedSeconds,
      updatedAt: now,
    });
  }, [canControlTimer, setAuthoritativeSnapshot]);

  const toggleTimer = useCallback(() => {
    if (!canControlTimer) {
      return;
    }

    const now = Date.now();
    const currentSnapshot = snapshotRef.current;
    const elapsedSeconds = getElapsedSeconds(currentSnapshot, now);
    const nextStatus: InterviewTimerStatus =
      currentSnapshot.status === "running" ? "paused" : "running";

    setAuthoritativeSnapshot({
      status: nextStatus,
      elapsedSeconds,
      updatedAt: now,
    });
  }, [canControlTimer, setAuthoritativeSnapshot]);

  useEffect(() => {
    function updateDisplaySeconds() {
      setDisplaySeconds(getElapsedSeconds(snapshotRef.current, Date.now()));
    }

    updateDisplaySeconds();

    if (snapshot.status !== "running") {
      return;
    }

    const timerId = window.setInterval(updateDisplaySeconds, 500);

    return () => window.clearInterval(timerId);
  }, [snapshot]);

  useEffect(() => {
    function handleDataReceived(
      payload: Uint8Array,
      _participant?: RemoteParticipant,
      _kind?: unknown,
      messageTopic?: string,
    ) {
      if (messageTopic !== topic) {
        return;
      }

      const message = decodeTimerMessage(payload);

      if (!message) {
        return;
      }

      if (message.type === "sync-request") {
        if (canControlTimer) {
          publishSnapshot(snapshotRef.current);
        }

        return;
      }

      if (!canControlTimer) {
        setSnapshot(message.snapshot);
      }
    }

    function handleConnected() {
      if (canControlTimer) {
        publishSnapshot(snapshotRef.current);
        return;
      }

      publishMessage({ type: "sync-request" });
    }

    room.on(RoomEvent.DataReceived, handleDataReceived);
    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Reconnected, handleConnected);
    room.on(RoomEvent.ParticipantConnected, handleConnected);

    if (room.state === ConnectionState.Connected) {
      handleConnected();
    }

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Reconnected, handleConnected);
      room.off(RoomEvent.ParticipantConnected, handleConnected);
    };
  }, [canControlTimer, publishMessage, publishSnapshot, room, topic]);

  return {
    canControlTimer,
    displaySeconds,
    startTimer,
    status: snapshot.status,
    toggleTimer,
  };
}

function getElapsedSeconds(snapshot: InterviewTimerSnapshot, now: number) {
  if (snapshot.status !== "running") {
    return snapshot.elapsedSeconds;
  }

  return snapshot.elapsedSeconds + Math.floor((now - snapshot.updatedAt) / 1000);
}

function decodeTimerMessage(payload: Uint8Array): TimerMessage | null {
  try {
    const parsed = JSON.parse(textDecoder.decode(payload)) as unknown;

    if (!isRecord(parsed) || typeof parsed.type !== "string") {
      return null;
    }

    if (parsed.type === "sync-request") {
      return { type: "sync-request" };
    }

    if (parsed.type !== "state") {
      return null;
    }

    const snapshot = normalizeSnapshot(parsed.snapshot);

    return snapshot ? { type: "state", snapshot } : null;
  } catch {
    return null;
  }
}

function normalizeSnapshot(value: unknown): InterviewTimerSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  const { elapsedSeconds, status, updatedAt } = value;

  if (
    !isTimerStatus(status) ||
    typeof elapsedSeconds !== "number" ||
    typeof updatedAt !== "number"
  ) {
    return null;
  }

  return {
    status,
    elapsedSeconds: Math.max(0, Math.floor(elapsedSeconds)),
    updatedAt,
  };
}

function isTimerStatus(value: unknown): value is InterviewTimerStatus {
  return value === "idle" || value === "running" || value === "paused";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
