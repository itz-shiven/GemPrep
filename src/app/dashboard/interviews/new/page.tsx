"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrivateInterview, joinInterview } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Users, KeyRound } from "lucide-react";

export default function NewInterviewPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  async function handleCreate() {
    setCreating(true);
    setError("");
    const result = await createPrivateInterview();
    if (result.error) {
      setError(result.error);
      setCreating(false);
    } else if (result.code) {
      router.push(`/interview/${result.code}`);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    
    setJoining(true);
    setError("");
    const result = await joinInterview(joinCode.trim());
    if (result.error) {
      setError(result.error);
      setJoining(false);
    } else {
      router.push(`/interview/${joinCode.trim()}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Start an Interview</h2>
        <p className="text-muted-foreground mt-2">
          Create a new private room to invite a friend, or join an existing room with a code.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Create Private Room
            </CardTitle>
            <CardDescription>
              Generate a unique code to share with your interview partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4 flex flex-col gap-4">
            <Button onClick={handleCreate} disabled={creating || joining} className="w-full">
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create New Room
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Join Room
            </CardTitle>
            <CardDescription>
              Enter the room code provided by your partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4">
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Room Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. clk123xyz..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  disabled={creating || joining}
                />
              </div>
              <Button type="submit" disabled={!joinCode.trim() || creating || joining} variant="secondary" className="w-full">
                {joining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Join Interview
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
