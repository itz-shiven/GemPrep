"use client";

import { useState } from "react";
import { WebRTCCall } from "@/components/video/webrtc-call";
import { CodeEditor } from "@/components/editor/code-editor";
import { Button } from "@/components/ui/button";
import { Loader2, Play, CheckCircle } from "lucide-react";
import { FeedbackForm } from "./feedback-form";

export function ActiveInterview({ room, currentParticipant, currentUser }: any) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  
  // Phase logic
  const currentPhase = room.interview?.currentPhase || "INTRO";

  const runCode = async () => {
    setRunning(true);
    setOutput("Executing...");
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: room.interview?.language || "javascript",
          code
        })
      });
      const data = await res.json();
      if (data.run) {
        setOutput(data.run.output || "No output");
      } else {
        setOutput(data.error || "Execution failed");
      }
    } catch (e) {
      setOutput("Error executing code");
    }
    setRunning(false);
  };

  const advancePhase = async () => {
    const phases = ["INTRO", "CODING", "DISCUSSION", "ENDED"];
    const currentIndex = phases.indexOf(currentPhase);
    const nextPhase = phases[currentIndex + 1];

    if (nextPhase) {
      await fetch("/api/interview/phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room.id, nextPhase })
      });
    }
  };

  if (currentPhase === "ENDED") {
    return <FeedbackForm room={room} currentParticipant={currentParticipant} />;
  }

  return (
    <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden">
      {/* Left Sidebar - Video & Info */}
      <div className="flex flex-col w-full lg:w-1/3 xl:w-1/4 border-r border-border bg-card/30">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">Mock Interview</h2>
            <p className="text-xs text-muted-foreground uppercase">{currentPhase} PHASE</p>
          </div>
          <Button variant="outline" size="sm" onClick={advancePhase}>
            Next Phase
          </Button>
        </div>
        
        <div className="flex-1 p-4 flex flex-col gap-4">
          <div className="h-64 rounded-lg overflow-hidden shrink-0">
            <WebRTCCall 
              roomId={room.id}
              currentParticipant={currentParticipant}
              participants={room.participants}
            />
          </div>
          
          <div className="flex-1 bg-muted/20 rounded-lg p-4 border border-border overflow-y-auto">
            <h3 className="font-semibold mb-2">Question Details</h3>
            <p className="text-sm text-muted-foreground">
              {/* If we had a selected question, it would show here. For MVP, we can leave this blank or add generic text */}
              Discuss the problem, decide on an approach, and implement the solution.
            </p>
          </div>
        </div>
      </div>

      {/* Right Area - Code Editor & Output */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="flex-1 p-4 flex flex-col h-1/2 min-h-0">
          <CodeEditor 
            roomId={room.id}
            currentParticipantId={currentParticipant.id}
            initialCode={room.interview?.code || "// Start coding here..."}
            onCodeChange={setCode}
          />
        </div>
        
        <div className="h-1/3 min-h-[200px] border-t border-border flex flex-col bg-zinc-950">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
            <span className="text-sm font-medium text-zinc-300">Terminal Output</span>
            <Button size="sm" onClick={runCode} disabled={running} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Code
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-zinc-300 whitespace-pre-wrap">
            {output || "Output will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}
