"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getMockInterviewByLink,
  parseRoomIdFromLink,
} from "@/features/interview-workspace/data/mockInterviews";
import {
  INTERVIEW_ROLE_LABELS,
  type MockInterviewRoom,
} from "@/features/interview-workspace/types/interview";
import { setStoredInterviewRole } from "@/features/interview-workspace/hooks/use-stored-interview-role";
import { ROUTES } from "@/lib/constants";

export function JoinInterview() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [detectedRoom, setDetectedRoom] = useState<MockInterviewRoom | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const roomId = parseRoomIdFromLink(link);

    if (!roomId) {
      setDetectedRoom(null);
      setError("Enter a valid GEMPREP room link or room ID.");
      return;
    }

    const room = getMockInterviewByLink(link);
    if (!room) {
      setDetectedRoom(null);
      setError("Enter a valid GEMPREP room link or room ID.");
      return;
    }

    setError(null);
    setDetectedRoom(room);
    setStoredInterviewRole(roomId, room.role);
  }

  function continueToWaitingRoom() {
    if (!detectedRoom) {
      return;
    }

    toast.success("Room detected. Opening waiting area.");
    router.push(ROUTES.roomWaiting(detectedRoom.roomId));
  }

  return (
    <Card>
      <CardHeader>
        <span className="mb-3 grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
          <Link2 className="size-5" aria-hidden="true" />
        </span>
        <CardTitle>Join with link</CardTitle>
        <CardDescription>
          Paste a GEMPREP room link to detect the mock room and assigned role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://gemprep.com/room/abc123"
            aria-label="Interview room link"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" variant="outline" className="w-full">
            Detect room
          </Button>
        </form>

        {detectedRoom ? (
          <div className="mt-5 rounded-lg border bg-secondary/35 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Room detected</Badge>
              <Badge variant="outline">
                You are joining as: {INTERVIEW_ROLE_LABELS[detectedRoom.role]}
              </Badge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <span>Room ID: {detectedRoom.roomId}</span>
              <span>{detectedRoom.type}</span>
              <span>{detectedRoom.duration}</span>
              <span>Status: {detectedRoom.status}</span>
            </div>
            <Button className="mt-5 w-full" onClick={continueToWaitingRoom}>
              Continue to waiting
              <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
