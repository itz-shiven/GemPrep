"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CameraPreview } from "@/features/interview-workspace/components/CameraPreview";
import { DeviceControls } from "@/features/interview-workspace/components/DeviceControls";
import { InterviewInfoCard } from "@/features/interview-workspace/components/InterviewInfoCard";
import { getMockInterviewByRoomId } from "@/features/interview-workspace/data/mockInterviews";
import { useStoredInterviewRole } from "@/features/interview-workspace/hooks/use-stored-interview-role";
import { DeviceSelector } from "@/features/livekit/components/DeviceSelector";
import {
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
  const [permissionRequestCount, setPermissionRequestCount] = useState(0);
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
  }, [
    cameraEnabled,
    micEnabled,
    permissionRequestCount,
    selectedCameraId,
    selectedMicrophoneId,
  ]);

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
    <main className="h-dvh overflow-hidden bg-secondary/45 text-foreground">
      <div className="mx-auto grid h-full w-full max-w-[1500px] items-center gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(20rem,3fr)] lg:px-10">
        <section className="min-h-0">
          <div className="mx-auto w-full max-w-[58rem]">
            <div className="relative h-[min(58dvh,520px)] min-h-[300px]">
              <CameraPreview
                userName={userName}
                cameraEnabled={cameraEnabled}
                micEnabled={micEnabled}
                mediaStream={mediaStream}
                audioLevel={audioLevel}
                permissionError={permissionError}
                onRequestPermissions={() =>
                  setPermissionRequestCount((count) => count + 1)
                }
                onOpenSettings={handleOpenDeviceSettings}
                className="h-full"
              />
              <DeviceControls
                micEnabled={micEnabled}
                cameraEnabled={cameraEnabled}
                onToggleMic={() => setMicEnabled((enabled) => !enabled)}
                onToggleCamera={() => setCameraEnabled((enabled) => !enabled)}
                showPermissionWarning={Boolean(permissionError)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DeviceSelector
                label="Microphone"
                devices={audioDevices}
                selectedDeviceId={selectedMicrophoneId}
                onChange={setSelectedMicrophoneId}
                disabled={!micEnabled}
              />
              <DeviceSelector
                label="Speaker"
                devices={audioDevices}
                selectedDeviceId={selectedMicrophoneId}
                onChange={setSelectedMicrophoneId}
                disabled={!micEnabled}
              />
              <DeviceSelector
                label="Camera"
                devices={videoDevices}
                selectedDeviceId={selectedCameraId}
                onChange={setSelectedCameraId}
                disabled={!cameraEnabled}
              />
              <DeviceSelector
                label="Background"
                devices={[]}
                selectedDeviceId=""
                onChange={() => undefined}
                disabled
              />
            </div>

            {permissionError ? (
              <p className="mt-3 line-clamp-2 text-center text-xs leading-5 text-muted-foreground">
                {permissionError}
              </p>
            ) : null}
          </div>
        </section>

        <aside className="min-h-0">
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
