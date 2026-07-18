import * as Y from "yjs";

export type EditorYDoc = {
  doc: Y.Doc;
  codeText: Y.Text;
  metadata: Y.Map<string>;
};

export function createEditorYDoc(): EditorYDoc {
  const doc = new Y.Doc();

  return {
    doc,
    codeText: doc.getText("code"),
    metadata: doc.getMap<string>("metadata"),
  };
}

export function seedEditorDocument({
  codeText,
  metadata,
  initialCode,
  languageId,
}: {
  codeText: Y.Text;
  metadata: Y.Map<string>;
  initialCode: string;
  languageId: string;
}) {
  if (codeText.length === 0 && initialCode) {
    codeText.insert(0, initialCode);
  }

  if (!metadata.get("languageId")) {
    metadata.set("languageId", languageId);
  }
}
