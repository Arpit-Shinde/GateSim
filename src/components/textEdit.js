export function openTextEditor(id, currentText, setEditingText) {
  setEditingText({ id, draft: currentText ?? "" });
}

export function updateTextLabel(id, newText, graph, setGraph, clock_delays, addToUndoStack) {
  addToUndoStack(graph, clock_delays);

  setGraph(prev => {
    const next = structuredClone(prev);
    const node = next.find(n => n.id === id);
    if (node && node.type === "TEXT") {
      node.text = newText;
    }
    return next;
  });
}

export function commitTextEdit({
  editingText,
  setEditingText,
  graph,
  setGraph,
  clock_delays,
  addToUndoStack
}) {
  if (!editingText) return;

  const trimmed = editingText.draft.trim();
  if (trimmed === "") {
    // treat empty as cancel
    setEditingText(null);
    return;
  }

  updateTextLabel(editingText.id, trimmed, graph, setGraph, clock_delays, addToUndoStack);
  setEditingText(null);
}

export function cancelTextEdit(setEditingText) {
  setEditingText(null);
}

export function TextEditDialog({
  editingText,
  setEditingText,
  commitTextEdit,
  cancelTextEdit
}) {
  if (!editingText) return null;

  return (
    <div className="text-edit-overlay" onClick={cancelTextEdit}>
      <div
        className="text-edit-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-edit-title">Edit Label</div>

        <input
          className="text-edit-input"
          autoFocus
          value={editingText.draft}
          onChange={(e) =>
            setEditingText(prev => ({ ...prev, draft: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") commitTextEdit();
            if (e.key === "Escape") cancelTextEdit();
          }}
        />

        <div className="text-edit-buttons">
          <button
            className="utilities-button"
            onClick={cancelTextEdit}
          >
            CANCEL
          </button>
          <button
            className="utilities-button primary"
            onClick={commitTextEdit}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}