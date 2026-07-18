"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { useRoomContext } from "@livekit/components-react";
import {
  ConnectionState,
  RoomEvent,
  type RemoteParticipant,
} from "livekit-client";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";

import {
  createEditorYDoc,
  seedEditorDocument,
} from "@/features/collaborative-editor/lib/yjs";
import {
  COLLABORATION_MESSAGE_TYPES,
  type CollaborationMessageType,
  decodeCollaborationMessage,
  encodeCollaborationMessage,
  getCollaborationTopic,
} from "@/features/collaborative-editor/lib/websocket";
import { useEditorPresence } from "@/features/collaborative-editor/hooks/useEditorPresence";
import type {
  CollaborationStatus,
  CollaborativeEditorUser,
  MonacoEditorInstance,
} from "@/features/collaborative-editor/types/editor";
import type {
  LanguageId,
  LanguageOption,
} from "@/features/interview-room/types/interview-room";

type UseCollaborativeEditorParams = {
  roomId: string;
  user: CollaborativeEditorUser;
  language: LanguageOption;
  canEdit: boolean;
  onRemoteLanguageChange: (languageId: LanguageId) => void;
};

export function useCollaborativeEditor({
  roomId,
  user,
  language,
  canEdit,
  onRemoteLanguageChange,
}: UseCollaborativeEditorParams) {
  const room = useRoomContext();
  const { doc, codeText, metadata } = useMemo(() => createEditorYDoc(), []);
  const awareness = useMemo(() => new Awareness(doc), [doc]);
  const liveKitOrigin = useMemo(() => ({ provider: "livekit-yjs" }), []);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [status, setStatus] = useState<CollaborationStatus>("connecting");
  const participants = useEditorPresence(awareness, user, canEdit);

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    seedEditorDocument({
      codeText,
      metadata,
      initialCode: language.initialCode,
      languageId: language.id,
    });
  }, [canEdit, codeText, language.id, language.initialCode, metadata]);

  useEffect(() => {
    const topic = getCollaborationTopic(roomId);

    function publishMessage(
      type: CollaborationMessageType,
      payload: Uint8Array,
    ) {
      const message = encodeCollaborationMessage(type, payload);

      void room.localParticipant
        .publishData(message, { reliable: true, topic })
        .catch(() => setStatus("disconnected"));
    }

    function publishSyncRequest() {
      publishMessage(
        COLLABORATION_MESSAGE_TYPES.syncRequest,
        Y.encodeStateVector(doc),
      );
      publishMessage(
        COLLABORATION_MESSAGE_TYPES.awareness,
        encodeAwarenessUpdate(awareness, [awareness.clientID]),
      );
    }

    function handleDocUpdate(update: Uint8Array, origin: unknown) {
      if (origin === liveKitOrigin) {
        return;
      }

      publishMessage(COLLABORATION_MESSAGE_TYPES.update, update);
    }

    function handleAwarenessUpdate(
      changes: { added: number[]; updated: number[]; removed: number[] },
      origin: unknown,
    ) {
      if (origin === liveKitOrigin) {
        return;
      }

      const changedClients = [
        ...changes.added,
        ...changes.updated,
        ...changes.removed,
      ];

      publishMessage(
        COLLABORATION_MESSAGE_TYPES.awareness,
        encodeAwarenessUpdate(awareness, changedClients),
      );
    }

    function handleDataReceived(
      payload: Uint8Array,
      _participant?: RemoteParticipant,
      _kind?: unknown,
      messageTopic?: string,
    ) {
      if (messageTopic !== topic) {
        return;
      }

      const message = decodeCollaborationMessage(payload);

      if (!message) {
        return;
      }

      if (
        message.type === COLLABORATION_MESSAGE_TYPES.update ||
        message.type === COLLABORATION_MESSAGE_TYPES.syncResponse
      ) {
        Y.applyUpdate(doc, message.payload, liveKitOrigin);
        return;
      }

      if (message.type === COLLABORATION_MESSAGE_TYPES.syncRequest) {
        publishMessage(
          COLLABORATION_MESSAGE_TYPES.syncResponse,
          Y.encodeStateAsUpdate(doc, message.payload),
        );
        return;
      }

      if (message.type === COLLABORATION_MESSAGE_TYPES.awareness) {
        applyAwarenessUpdate(awareness, message.payload, liveKitOrigin);
      }
    }

    function handleConnected() {
      setStatus("connected");
      publishSyncRequest();
    }

    function handleReconnecting() {
      setStatus("reconnecting");
    }

    function handleDisconnected() {
      setStatus("disconnected");
    }

    doc.on("update", handleDocUpdate);
    awareness.on("update", handleAwarenessUpdate);
    room.on(RoomEvent.DataReceived, handleDataReceived);
    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Reconnected, handleConnected);
    room.on(RoomEvent.ParticipantConnected, publishSyncRequest);
    room.on(RoomEvent.Reconnecting, handleReconnecting);
    room.on(RoomEvent.Disconnected, handleDisconnected);

    if (room.state === ConnectionState.Connected) {
      handleConnected();
    }

    return () => {
      doc.off("update", handleDocUpdate);
      awareness.off("update", handleAwarenessUpdate);
      room.off(RoomEvent.DataReceived, handleDataReceived);
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Reconnected, handleConnected);
      room.off(RoomEvent.ParticipantConnected, publishSyncRequest);
      room.off(RoomEvent.Reconnecting, handleReconnecting);
      room.off(RoomEvent.Disconnected, handleDisconnected);
    };
  }, [awareness, doc, liveKitOrigin, room, roomId]);

  useEffect(() => () => doc.destroy(), [doc]);

  useEffect(() => {
    const observer = () => {
      const nextLanguageId = metadata.get("languageId") as
        | LanguageId
        | undefined;

      if (nextLanguageId && nextLanguageId !== language.id) {
        onRemoteLanguageChange(nextLanguageId);
      }
    };

    metadata.observe(observer);
    observer();

    return () => metadata.unobserve(observer);
  }, [language.id, metadata, onRemoteLanguageChange]);

  const bindEditor = useCallback(
    (editorInstance: MonacoEditorInstance, monacoInstance: Monaco) => {
      bindingRef.current?.destroy();

      const model =
        editorInstance.getModel() ??
        monacoInstance.editor.createModel("", language.monacoLanguage);

      editorInstance.setModel(model);
      monacoInstance.editor.setModelLanguage(model, language.monacoLanguage);
      editorInstance.updateOptions({ readOnly: !canEdit });

      bindingRef.current = new MonacoBinding(
        codeText,
        model,
        new Set<editor.IStandaloneCodeEditor>([editorInstance]),
        awareness,
      );
    },
    [awareness, canEdit, codeText, language.monacoLanguage],
  );

  const setSharedLanguage = useCallback(
    (languageId: LanguageId, initialCode: string) => {
      if (!canEdit) {
        return;
      }

      metadata.set("languageId", languageId);

      doc.transact(() => {
        codeText.delete(0, codeText.length);
        codeText.insert(0, initialCode);
      });
    },
    [canEdit, codeText, doc, metadata],
  );

  const destroyBinding = useCallback(() => {
    bindingRef.current?.destroy();
    bindingRef.current = null;
  }, []);

  return {
    awareness,
    bindEditor,
    destroyBinding,
    participants,
    setSharedLanguage,
    status,
  };
}
