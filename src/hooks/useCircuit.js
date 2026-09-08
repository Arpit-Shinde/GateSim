// hooks/useCircuit.js
import { evaluate } from "../utils/evaluate";
import { topologicalOrderAndReindex } from "../utils/topologicalSort";
import * as CONSTANTS from "../constants/constants";

export function useCircuit(
  graph,
  setGraph,
  clock_delays,
  setClockDelays,
  view,
  addToUndoStack,
  setoPin,
  setSelectedGate,
  setSelectedWire
) {

  // ─── TOGGLE ───
  function toggle(id) {
    let newGraph = structuredClone(graph);
    addToUndoStack(graph, clock_delays);

    newGraph[id].value = !newGraph[id].value;

    for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
      evaluate(newGraph);
    }

    setGraph(newGraph);
  }

  // ─── ADD GATE ───
  function Add(gate) {
    if (!gate) return;
    addToUndoStack(graph, clock_delays);

    let newGate;

    if (gate === "CLOCK") {
      let input = window.prompt(`Clock Delay (minimum:${CONSTANTS.MIN_FRAME_TIME})`);
      if (input === null) return;
      let delay = Number(input);
      if (delay < CONSTANTS.MIN_FRAME_TIME) {
        alert(`Delay entered less than ${CONSTANTS.MIN_FRAME_TIME}`);
        return;
      }
      newGate = {
        type: gate,
        id: graph.length,
        value: false,
        inputs: [],
        x: view.x + view.width / 2,
        y: view.y + view.height / 2,
        delay: delay
      };
      let newdelay = {
        id: graph.length,
        delay: delay,
        next_delay: performance.now() + delay
      };
      setClockDelays((prev) => [...prev, newdelay]);
    } else {
      newGate = {
        type: gate,
        id: graph.length,
        value: false,
        inputs: [],
        x: view.x + view.width / 2,
        y: view.y + view.height / 2
      };
    }

    let [newGraph, new_clock_delays] = topologicalOrderAndReindex([...graph, newGate]);
    for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
      evaluate(newGraph);
    }
    setGraph(newGraph);
    setClockDelays(new_clock_delays);
  }

  // ─── CONNECT ───
  function Connect(inputpin, outputpin) {
    if (!inputpin || !outputpin) return;

    let newgraph = structuredClone(graph);
    addToUndoStack(graph, clock_delays);

    newgraph[inputpin.gateId].inputs[inputpin.gateIndex] = outputpin.gateId;

    let [sortedGraph, new_clock_delays] = topologicalOrderAndReindex(newgraph);

    for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
      evaluate(sortedGraph);
    }

    // ✅ Clear selections
    setoPin(null);
    setSelectedGate(null);
    setSelectedWire(null);

    // ✅ Update state
    setGraph(sortedGraph);
    setClockDelays(new_clock_delays);
  }

  // ─── CLEAR GRAPH ───
  function clearGraph() {
    if (graph.length === 0) {
      alert("Circuit is already empty.");
      return;
    }

    if (window.confirm("Are you sure you want to clear the circuit? This cannot be undone.")) {
      addToUndoStack(graph, clock_delays);
      setGraph([]);
      setClockDelays([]);
    }
  }

  return {
    toggle,
    Add,
    Connect,
    clearGraph
  };
}