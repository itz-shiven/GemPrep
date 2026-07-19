export const COLLABORATION_MESSAGE_TYPES = {
  update: 0,
  syncRequest: 1,
  syncResponse: 2,
} as const;

export type CollaborationMessageType =
  (typeof COLLABORATION_MESSAGE_TYPES)[keyof typeof COLLABORATION_MESSAGE_TYPES];

export type CollaborationMessage = {
  type: CollaborationMessageType;
  payload: Uint8Array;
};

export function getCollaborationTopic(roomId: string) {
  return `gemprep.editor.${roomId}`;
}

export function encodeCollaborationMessage(
  type: CollaborationMessageType,
  payload: Uint8Array,
) {
  const message = new Uint8Array(payload.length + 1);
  message[0] = type;
  message.set(payload, 1);

  return message;
}

export function decodeCollaborationMessage(
  message: Uint8Array,
): CollaborationMessage | null {
  if (message.length === 0) {
    return null;
  }

  const type = message[0] as CollaborationMessageType;
  const payload = message.slice(1);

  if (!isCollaborationMessageType(type)) {
    return null;
  }

  return { type, payload };
}

function isCollaborationMessageType(
  type: number,
): type is CollaborationMessageType {
  return Object.values(COLLABORATION_MESSAGE_TYPES).includes(
    type as CollaborationMessageType,
  );
}
