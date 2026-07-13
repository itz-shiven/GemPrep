"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { getPusherClient } from "@/lib/pusher";

interface CodeEditorProps {
  roomId: string;
  currentParticipantId: string;
  initialCode?: string;
  initialLanguage?: string;
  onCodeChange?: (code: string) => void;
}

export function CodeEditor({ roomId, currentParticipantId, initialCode = "", initialLanguage = "javascript", onCodeChange }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const isRemoteUpdate = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pusher subscription
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`room-${roomId}`);

    channel.bind("editor-sync", (data: any) => {
      if (data.senderId !== currentParticipantId) {
        // Prevent trigger loop
        isRemoteUpdate.current = true;
        setCode(data.code);
        if (data.language && data.language !== language) {
          setLanguage(data.language);
        }
      }
    });

    return () => {
      channel.unbind("editor-sync");
      pusher.unsubscribe(`room-${roomId}`);
    };
  }, [roomId, currentParticipantId, language]);

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    
    // If this update came from a remote peer, don't re-sync it
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(newValue);
    if (onCodeChange) onCodeChange(newValue);

    // Debounce sync to avoid flooding
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      await fetch("/api/editor-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          senderId: currentParticipantId,
          code: newValue,
          language
        })
      });
    }, 500); // 500ms debounce
  };

  return (
    <div className="flex-1 w-full h-full border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="bg-muted/50 p-2 border-b border-border flex justify-between items-center">
        <select 
          className="bg-background border border-border rounded text-sm p-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
