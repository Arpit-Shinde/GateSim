// hooks/useDeleteNode.js
import { useEffect } from "react";
import { computeDeletion } from "../utils/deleteNode";

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
  CONSTANTS,
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key !== "Delete") return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (selectedGate === null) return;

      addToUndoStack(graph, clock_delays);

      const result = computeDeletion(graph, clock_delays, selectedGate.id, {
        CONSTANTS, compactAndReindex, evaluate,
      });

      if (!result) return;

      remapTimingSignals(result.idMap);
      setGraph(result.graph);
      setClockDelays(result.clockDelays);
      setSelectedGate(null);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    selectedGate, graph, clock_delays, addToUndoStack,
    setGraph, setClockDelays, setSelectedGate,
    compactAndReindex, remapTimingSignals, evaluate, CONSTANTS,
  ]);
}