"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Video, Mic, Wifi, Users, Loader2 } from "lucide-react";

export function WaitingRoom({ room, currentParticipant, isReady, onToggleReady }: any) {
  const [copied, setCopied] = useState(false);
  const [hasVideo, setHasVideo] = useState<boolean | null>(null);
  const [hasAudio, setHasAudio] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Check devices
  useEffect(() => {
    async function checkDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setHasVideo(devices.some(d => d.kind === 'videoinput'));
        setHasAudio(devices.some(d => d.kind === 'audioinput'));
      } catch (e) {
        console.error("Device check failed:", e);
        setHasVideo(false);
        setHasAudio(false);
      }
    }
    checkDevices();

    // Check internet
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const opponent = room.participants.find((p: any) => p.id !== currentParticipant.id);

  return (
    <div className="flex h-full items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Waiting Room</CardTitle>
          <CardDescription>
            Prepare for your interview and wait for your partner to join.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 p-4">
            <span className="text-sm font-medium text-muted-foreground">Room Code</span>
            <div className="flex items-center gap-2">
              <code className="text-xl font-mono font-bold tracking-wider">{room.code}</code>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this code with your partner so they can join.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" /> Participants
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">You ({currentParticipant.role})</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${isReady ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {isReady ? "Ready" : "Not Ready"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{opponent ? `Partner (${opponent.role})` : "Waiting for partner..."}</span>
                  {opponent && (
                    <span className={`text-xs px-2 py-1 rounded-full ${opponent.isReady ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {opponent.isReady ? "Ready" : "Not Ready"}
                    </span>
                  )}
                  {!opponent && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-semibold text-sm">System Check</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Video className="h-4 w-4" /> Camera
                  </span>
                  {hasVideo === null ? <Loader2 className="h-3 w-3 animate-spin" /> : (
                    <div className={`h-2 w-2 rounded-full ${hasVideo ? 'bg-green-500' : 'bg-red-500'}`} />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Mic className="h-4 w-4" /> Microphone
                  </span>
                  {hasAudio === null ? <Loader2 className="h-3 w-3 animate-spin" /> : (
                    <div className={`h-2 w-2 rounded-full ${hasAudio ? 'bg-green-500' : 'bg-red-500'}`} />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Wifi className="h-4 w-4" /> Internet
                  </span>
                  <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg font-medium" 
            variant={isReady ? "outline" : "default"}
            onClick={onToggleReady}
            disabled={!opponent && !isReady}
          >
            {isReady ? "I'm not ready" : "I'm Ready"}
          </Button>

          {!opponent && !isReady && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Waiting for partner to join before you can be ready.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
