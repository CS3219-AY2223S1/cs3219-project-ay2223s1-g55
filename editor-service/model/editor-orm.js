import { createEditor, findEditor, findEditorAndUpdate } from './repository.js';

export async function ormFindOrCreateEditor(sessionId) {
  if (sessionId == null) return {};
  const editor = await findEditor(sessionId);
  if (editor) {
    return editor;
  }
  const newEditor = await createEditor(sessionId);
  return newEditor;
}

export async function ormFindEditorAndUpdate(sessionId, data) {
  const editor = await findEditorAndUpdate(sessionId, data);
  return editor;
}
