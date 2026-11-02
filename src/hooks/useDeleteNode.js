// hooks/useDeleteNode.js
import { useEffect } from "react";

export function useDeleteNode({
  selectedGate,
  graph,
  clock_delays,
  addToUndoStack,
  setGraph,
  setClockDelays,
  setSelectedGate,
  compactAndReindex,
  remapTimingSignals,
  evaluate,
  CONSTANTS
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key !== "Delete") return;
      if (selectedGate === null) return;

      addToUndoStack(graph, clock_delays);

      const newGraph = structuredClone(graph);
      const nodeToDelete = newGraph[selectedGate.id];

      // delete wire
      if (nodeToDelete.type === "WIRE") {
        const idsToDelete = new Set([selectedGate.id]);
        let changed = true;

        // Find all downstream child wires recursively
        while (changed) {
          changed = false;

          for (const node of newGraph) {
            if (node.type !== "WIRE") continue;
            if (!node.inputs || node.inputs.length === 0) continue;

            const input = node.inputs[0];

            if (
              input &&
              input.index !== -1 &&
              idsToDelete.has(input.id)
            ) {
              if (!idsToDelete.has(node.id)) {
                idsToDelete.add(node.id);
                changed = true;
              }
            }
          }
        }

        // Disconnect references to deleted wires
        for (const node of newGraph) {
          if (!node.inputs) continue;

          node.inputs = node.inputs.map((input) =>
            input && input.index !== -1 && idsToDelete.has(input.id)
              ? { id: -1, index: -1 }
              : input
          );
        }

        // Delete all collected wires
        for (let i = newGraph.length - 1; i >= 0; i--) {
          if (idsToDelete.has(newGraph[i].id)) {
            newGraph.splice(i, 1);
          }
        }
      }
      // delete gate
      else {
        const idsToDelete = new Set([selectedGate.id]);
        let changed = true;

        // Collect connected wires
        while (changed) {
          changed = false;

          for (const node of newGraph) {
            if (node.type !== "WIRE") continue;

            // Child wire: this wire's source is a to-be-deleted node
            if (node.inputs && node.inputs.length > 0) {
              const input = node.inputs[0];

              if (
                input &&
                input.index !== -1 &&
                idsToDelete.has(input.id)
              ) {
                if (!idsToDelete.has(node.id)) {
                  idsToDelete.add(node.id);
                  changed = true;
                }
              }
            }

            // Parent wire: the to-be-deleted node takes input from this wire
            if (
              nodeToDelete.inputs &&
              nodeToDelete.inputs.some(
                (input) =>
                  input &&
                  input.index !== -1 &&
                  input.id === node.id
              )
            ) {
              if (!idsToDelete.has(node.id)) {
                idsToDelete.add(node.id);
                changed = true;
              }
            }
          }
        }

        // Disconnect references to deleted nodes/wires
        for (const node of newGraph) {
          if (!node.inputs) continue;

          node.inputs = node.inputs.map((input) =>
            input && input.index !== -1 && idsToDelete.has(input.id)
              ? { id: -1, index: -1 }
              : input
          );
        }

        // Delete gate + all collected wires
        for (let i = newGraph.length - 1; i >= 0; i--) {
          if (idsToDelete.has(newGraph[i].id)) {
            newGraph.splice(i, 1);
          }
        }
      }

      if (nodeToDelete.type === "CLOCK") {
        clock_delays = clock_delays.filter((clock) => clock.id !== nodeToDelete.id
        )
      }

      const [newGraph2, idMap2] = compactAndReindex(newGraph);

      //update id in clock_delays
      const remappedClockDelays = clock_delays.filter(c => idMap2.has(c.id)).map(c => ({ ...c, id: idMap2.get(c.id) }));

      remapTimingSignals(idMap2);

      for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
        const changed = evaluate(newGraph2);
        if (!changed) {
          break;
        }
      }

      setGraph(newGraph2);
      setClockDelays(remappedClockDelays);
      setSelectedGate(null);
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [
    selectedGate,
    graph,
    clock_delays,
    addToUndoStack,
    setGraph,
    setSelectedGate,
    compactAndReindex,
    remapTimingSignals,
    evaluate,
    CONSTANTS,
  ]);
}