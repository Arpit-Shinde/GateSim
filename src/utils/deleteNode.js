// utils/deleteNode.js

/**
 * Pure graph transformation: delete a node and everything that references it.
 * Returns the new graph, remapped clock delays, and the id map used by
 * compactAndReindex. Does NOT touch React state.
 *
 * Returns null if the id is invalid / missing.
 */
export function computeDeletion(graph, clockDelays, idToDelete, {
  CONSTANTS,
  compactAndReindex,
  evaluate,
}) {
  if (idToDelete == null) return null;

  const newGraph = structuredClone(graph);
  const nodeToDelete = newGraph[idToDelete];
  if (!nodeToDelete) return null;

  const idsToDelete = new Set([idToDelete]);

  // ---- collect connected wires (same rules as before) ----
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of newGraph) {
      if (node.type !== "WIRE") continue;
      if (!node.inputs || node.inputs.length === 0) continue;
      const input = node.inputs[0];
      if (input && input.index !== -1 && idsToDelete.has(input.id)) {
        if (!idsToDelete.has(node.id)) {
          idsToDelete.add(node.id);
          changed = true;
        }
      }
    }
  }

  // For a non-wire node, also collect wires feeding into it
  if (nodeToDelete.type !== "WIRE" && nodeToDelete.inputs) {
    changed = true;
    while (changed) {
      changed = false;
      for (const node of newGraph) {
        if (node.type !== "WIRE") continue;
        if (idsToDelete.has(node.id)) continue;

        // parent wire: the node being deleted reads from this wire
        if (
          nodeToDelete.inputs.some(
            (input) => input && input.index !== -1 && input.id === node.id
          )
        ) {
          idsToDelete.add(node.id);
          changed = true;
        }
      }
    }
  }

  // ---- disconnect any references to deleted ids ----
  for (const node of newGraph) {
    if (!node.inputs) continue;
    node.inputs = node.inputs.map((input) =>
      input && input.index !== -1 && idsToDelete.has(input.id)
        ? { id: -1, index: -1 }
        : input
    );
  }

  // ---- splice them out (iterate backwards) ----
  for (let i = newGraph.length - 1; i >= 0; i--) {
    if (idsToDelete.has(newGraph[i].id)) newGraph.splice(i, 1);
  }

  // ---- clock delay cleanup ----
  let filteredClockDelays = clockDelays;
  if (nodeToDelete.type === "CLOCK") {
    filteredClockDelays = clockDelays.filter((c) => c.id !== nodeToDelete.id);
  }

  // ---- reindex + remap ----
  const [newGraph2, idMap] = compactAndReindex(newGraph);

  const remappedClockDelays = filteredClockDelays
    .filter((c) => idMap.has(c.id))
    .map((c) => ({ ...c, id: idMap.get(c.id) }));

  // ---- settle the circuit ----
  for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
    if (!evaluate(newGraph2)) break;
  }

  return { graph: newGraph2, clockDelays: remappedClockDelays, idMap };
}