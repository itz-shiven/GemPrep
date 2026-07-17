"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CameraPreview } from "@/features/interview-workspace/components/CameraPreview";
import { DeviceControls } from "@/features/interview-workspace/components/DeviceControls";
import { InterviewInfoCard } from "@/features/interview-workspace/components/InterviewInfoCard";
import { getMockInterviewByRoomId } from "@/features/interview-workspace/data/mockInterviews";
import { useStoredInterviewRole } from "@/features/interview-workspace/hooks/use-stored-interview-role";
import { DeviceSelector } from "@/features/livekit/components/DeviceSelector";
import {
  INTERVIEW_ROLE_LABELS,
  type InterviewRole,
  type MockInterviewRoom,
} from "@/features/interview-workspace/types/interview";
import { ROUTES } from "@/lib/constants";

type WaitingRoomUser = {
  fullName: string;
};

type WaitingRoomProps = {
  roomId: string;
  user: WaitingRoomUser;
};

export function WaitingRoom({ roomId, user }: WaitingRoomProps) {
  const router = useRouter();
  const baseRoom = useMemo(() => getMockInterviewByRoomId(roomId), [roomId]);
  const fallbackRole = baseRoom?.role ?? "CANDIDATE";
  const role = useStoredInterviewRole(roomId, fallbackRole);
  const room = useMemo(
    () => baseRoom ?? createFallbackRoom(roomId, role),
    [baseRoom, roomId, role],
  );

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState("");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [joinedIntent, setJoinedIntent] = useState(false);
  const audioLevel = useAudioLevel(mediaStream, micEnabled);
  const userName = user.fullName || "GEMPREP user";
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const audioDevices = devices.filter((device) => device.kind === "audioinput");

  useEffect(() => {
    let active = true;
    let nextStream: MediaStream | null = null;

    async function startPreview() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPermissionError("This browser does not support media preview.");
        return;
      }

      if (!cameraEnabled && !micEnabled) {
        setMediaStream((currentStream) => {
          currentStream?.getTracks().forEach((track) => track.stop());
          return null;
        });
        return;
      }

      try {
        nextStream = await navigator.mediaDevices.getUserMedia({
          video: cameraEnabled
            ? {
                deviceId: selectedCameraId
                  ? { exact: selectedCameraId }
                  : undefined,
              }
            : false,
          audio: micEnabled
            ? {
                deviceId: selectedMicrophoneId
                  ? { exact: selectedMicrophoneId }
                  : undefined,
              }
            : false,
        });

        if (!active) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setPermissionError(null);
        setMediaStream((currentStream) => {
          currentStream?.getTracks().forEach((track) => track.stop());
          return nextStream;
        });

        const nextDevices = await navigator.mediaDevices.enumerateDevices();
        if (active) {
          setDevices(nextDevices);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to access camera or microphone.";

        setPermissionError(message);
        setMediaStream((currentStream) => {
          currentStream?.getTracks().forEach((track) => track.stop());
          return null;
        });
      }
    }

    void startPreview();

    return () => {
      active = false;
      nextStream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraEnabled, micEnabled, selectedCameraId, selectedMicrophoneId]);

  function handleJoinInterview() {
    setJoinedIntent(true);
    toast.success(
      role === "CANDIDATE"
        ? "Opening candidate interview room."
        : "Opening interviewer workspace.",
    );
    router.push(ROUTES.room(roomId));
  }

  function handleOpenDeviceSettings() {
    toast.info("Device settings are mocked for this phase.");
  }

  function handleOpenAudioSettings() {
    toast.info("Audio settings are mocked for this phase.");
  }

  return (
    <main className="min-h-dvh bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1500px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex min-h-14 flex-wrap items-center justify-between gap-3">
          <Link
            href={ROUTES.interviewWorkspace}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.08] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Interview Workspace
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-white/[0.12] bg-white/10 text-white">
              Mock waiting room
            </Badge>
            <Badge className="border-white/[0.12] bg-white/10 text-white">
              {INTERVIEW_ROLE_LABELS[role]}
            </Badge>
          </div>
        </header>

        <div className="grid flex-1 gap-5 py-4 lg:grid-cols-[minmax(0,7fr)_minmax(20rem,3fr)]">
          <section className="relative min-h-[30rem] lg:min-h-full">
            <CameraPreview
              userName={userName}
              cameraEnabled={cameraEnabled}
              micEnabled={micEnabled}
              mediaStream={mediaStream}
              audioLevel={audioLevel}
              permissionError={permissionError}
              className="h-full"
            />
            <DeviceControls
              micEnabled={micEnabled}
              cameraEnabled={cameraEnabled}
              onToggleMic={() => setMicEnabled((enabled) => !enabled)}
              onToggleCamera={() => setCameraEnabled((enabled) => !enabled)}
              onOpenSettings={handleOpenDeviceSettings}
            />
          </section>

          <aside className="grid gap-3">
            <div className="rounded-xl border border-white/10 bg-background p-4 text-foreground shadow-2xl">
              <p className="text-sm font-semibold">Device setup</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Choose your camera and microphone before joining the LiveKit room.
              </p>
              <div className="mt-4 grid gap-3">
                <DeviceSelector
                  label="Camera"
                  devices={videoDevices}
                  selectedDeviceId={selectedCameraId}
                  onChange={setSelectedCameraId}
                  disabled={!cameraEnabled}
                />
                <DeviceSelector
                  label="Microphone"
                  devices={audioDevices}
                  selectedDeviceId={selectedMicrophoneId}
                  onChange={setSelectedMicrophoneId}
                  disabled={!micEnabled}
                />
              </div>
              {permissionError ? (
                <p className="mt-3 rounded-md border border-red-400/20 bg-red-500/[0.12] px-3 py-2 text-xs leading-5 text-red-200">
                  {permissionError}
                </p>
              ) : null}
            </div>

            <InterviewInfoCard
              userName={userName}
              role={role}
              room={{ ...room, role }}
              joinedIntent={joinedIntent}
              onJoin={handleJoinInterview}
              onOpenDeviceSettings={handleOpenDeviceSettings}
              onOpenAudioSettings={handleOpenAudioSettings}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function useAudioLevel(mediaStream: MediaStream | null, micEnabled: boolean) {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    const audioTrack = mediaStream?.getAudioTracks()[0];

    if (!audioTrack || !micEnabled) {
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(
      new MediaStream([audioTrack]),
    );
    const samples = new Uint8Array(analyser.frequencyBinCount);
    let frameId = 0;

    analyser.fftSize = 256;
    source.connect(analyser);

    function updateLevel() {
      analyser.getByteFrequencyData(samples);
      const average =
        samples.reduce((total, sample) => total + sample, 0) / samples.length;

      setAudioLevel(Math.round((average / 255) * 100));
      frameId = requestAnimationFrame(updateLevel);
    }

    updateLevel();

    return () => {
      cancelAnimationFrame(frameId);
      source.disconnect();
      void audioContext.close();
    };
  }, [mediaStream, micEnabled]);

  return mediaStream?.getAudioTracks()[0] && micEnabled ? audioLevel : 0;
}

function createFallbackRoom(
  roomId: string,
  role: InterviewRole,
): MockInterviewRoom {
  return {
    roomId,
    role,
    link: `https://gemprep.com/room/${roomId}`,
    status: "WAITING",
    type: "Data structures mock",
    duration: "45 minutes",
  };
}
