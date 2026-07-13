"use client";

import { useState, useEffect } from "react";
import { getPusherClient } from "@/lib/pusher";
import { WaitingRoom } from "@/components/interview/waiting-room";
import { ActiveInterview } from "@/components/interview/active-interview";
import { updateReadyStatus } from "./actions";

export function InterviewClient({ room: initialRoom, currentParticipant, currentUser }: any) {
  const [room, setRoom] = useState(initialRoom);
  const [isReady, setIsReady] = useState(currentParticipant.isReady);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`room-${room.id}`);

    channel.bind("participant-ready", (data: any) => {
      setRoom((prev: any) => ({
        ...prev,
        participants: prev.participants.map((p: any) => 
          p.id === data.participantId ? { ...p, isReady: data.isReady } : p
        )
      }));
    });

    channel.bind("room-status-changed", (data: any) => {
      setRoom((prev: any) => ({
        ...prev,
        status: data.status,
        interview: data.interview || prev.interview
      }));
    });

    return () => {
      pusher.unsubscribe(`room-${room.id}`);
    };
  }, [room.id]);

  const toggleReady = async () => {
    const newState = !isReady;
    setIsReady(newState);
    
    // Optimistic update locally
    setRoom((prev: any) => ({
      ...prev,
      participants: prev.participants.map((p: any) => 
        p.id === currentParticipant.id ? { ...p, isReady: newState } : p
      )
    }));

    // Tell server
    await updateReadyStatus(room.id, currentParticipant.id, newState);
  };

  if (room.status === "WAITING") {
    return (
      <WaitingRoom 
        room={room} 
        currentParticipant={currentParticipant} 
        isReady={isReady}
        onToggleReady={toggleReady}
      />
    );
  }

  return (
    <ActiveInterview 
      room={room} 
      currentParticipant={currentParticipant} 
      currentUser={currentUser}
    />
  );
}
