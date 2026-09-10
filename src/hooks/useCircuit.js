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
  setSelectedWire,
  setShowClockWindow,
  setClockDelayInput
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
  function Add(gate, wireData = null, inputpin = null, clockDelay = null) {
    if (!gate) return;

    // CLOCK needs user input first
    if (gate === "CLOCK" && clockDelay === null) {
        setClockDelayInput("");
        setShowClockWindow(true);
        return;
    }

    addToUndoStack(graph, clock_delays);

    let newGate;

    if (gate === "CLOCK") {

        let delay = Number(clockDelay);

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
    }

    else if (gate === "WIRE") {

        newGate = {
            type: gate,
            id: graph.length,
            value: false,
            path: wireData.path,
            inputs: [wireData.inputId]
        };

    }

    else {

        newGate = {
            type: gate,
            id: graph.length,
            value: false,
            inputs: [],
            x: view.x + view.width / 2,
            y: view.y + view.height / 2
        };
    }

    // CONNECT HERE, BEFORE setGraph()
    let oldId = newGate.id;

    if (inputpin) {
        graph[inputpin.gateId].inputs[inputpin.gateIndex] = newGate.id;
    }

    let [newGraph, new_clock_delays, idMap] =
        topologicalOrderAndReindex([...graph, newGate]);

    for (
        let i = 0;
        i < CONSTANTS.MAX_EVALUATION_ITERATIONS;
        i++
    ) {
        evaluate(newGraph);
    }

    let newId = idMap.get(oldId);

    setGraph(newGraph);
    setClockDelays(new_clock_delays);

    console.log(`in Add(), newId = ${newId}`);

    return newId;
}

  // ─── CONNECT ───
  function Connect(inputpin, outputId) {
    if (!inputpin || outputId === undefined) return;

    let newgraph = structuredClone(graph);
    addToUndoStack(graph, clock_delays);
    console.log(`inputpin id: ${inputpin.gateId} outputpin id:${outputId}`)

    newgraph[inputpin.gateId].inputs[inputpin.gateIndex] = outputId;

    // ✅ Clear selections
    setoPin(null);
    setSelectedGate(null);
    setSelectedWire(null);

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