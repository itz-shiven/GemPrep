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
  metadata,
  languageId,
}: {
  metadata: Y.Map<string>;
  languageId: string;
}) {
  if (!metadata.get("languageId")) {
    metadata.set("languageId", languageId);
  }
}
