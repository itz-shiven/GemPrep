"use client";

import { useEffect, useRef, useState } from "react";
import { getPusherClient } from "@/lib/pusher";
import { Mic, MicOff, Video as VideoIcon, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function WebRTCCall({ roomId, currentParticipant, participants }: any) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const opponent = participants.find((p: any) => p.id !== currentParticipant.id);

  // Send signaling message
  const sendSignal = async (type: string, payload: any, targetId?: string) => {
    await fetch("/api/signaling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        senderId: currentParticipant.id,
        targetId,
        type,
        payload
      })
    });
  };

  useEffect(() => {
    let stream: MediaStream;
    let pc: RTCPeerConnection;
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`room-${roomId}`);

    const init = async () => {
      try {
        // 1. Get local stream
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 2. Setup RTCPeerConnection
        pc = new RTCPeerConnection(ICE_SERVERS);
        setPeerConnection(pc);

        // Add local tracks to pc
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle remote tracks
        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setIsConnected(true);
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal("ice-candidate", event.candidate, opponent?.id);
          }
        };

        // 3. Listen to Pusher for signaling
        channel.bind("webrtc-signal", async (data: any) => {
          // Ignore our own signals
          if (data.senderId === currentParticipant.id) return;
          // Ignore signals not meant for us (if targetId is specified)
          if (data.targetId && data.targetId !== currentParticipant.id) return;

          try {
            if (data.type === "offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendSignal("answer", answer, data.senderId);
            } 
            else if (data.type === "answer") {
              await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
            } 
            else if (data.type === "ice-candidate") {
              await pc.addIceCandidate(new RTCIceCandidate(data.payload));
            }
          } catch (e) {
            console.error("Error processing signal:", e);
          }
        });

        // 4. If we are the INTERVIEWER, initiate the call
        if (currentParticipant.role === "INTERVIEWER") {
          // Add a slight delay to ensure the other side is ready to listen
          setTimeout(async () => {
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              sendSignal("offer", offer, opponent?.id);
            } catch (e) {
              console.error("Error creating offer:", e);
            }
          }, 2000);
        }

      } catch (err) {
        console.error("Error initializing WebRTC:", err);
      }
    };

    init();

    return () => {
      channel.unbind("webrtc-signal");
      pusher.unsubscribe(`room-${roomId}`);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (pc) {
        pc.close();
      }
    };
  }, [roomId]);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="relative flex-1 bg-black rounded-lg overflow-hidden border border-border">
        {/* Remote Video (Full Screen) */}
        <video 
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <p className="text-muted-foreground animate-pulse">Waiting for partner to connect...</p>
          </div>
        )}

        {/* Local Video (PiP) */}
        <div className="absolute bottom-4 right-4 w-48 aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 shadow-xl">
          <video 
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 p-2 rounded-full backdrop-blur-sm">
          <Button 
            variant={isMicOn ? "secondary" : "destructive"} 
            size="icon" 
            className="rounded-full"
            onClick={toggleMic}
          >
            {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button 
            variant={isVideoOn ? "secondary" : "destructive"} 
            size="icon" 
            className="rounded-full"
            onClick={toggleVideo}
          >
            {isVideoOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
