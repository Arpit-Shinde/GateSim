// hooks/useCircuit.js

import { propagate, settle } from "../utils/evaluate";
import { compactAndReindex } from "../utils/reindex";

const INPUT_COUNTS = {
  NOT: 1,
  AND: 2, OR: 2, NAND: 2, NOR: 2, XOR: 2, XNOR: 2, HALF_ADDER: 2,
  AND3: 3, OR3: 3, NAND3: 3, NOR3: 3, XOR3: 3, XNOR3: 3, MUX2: 3, FULL_ADDER: 3,
  AND4: 4, OR4: 4, NAND4: 4, NOR4: 4, XOR4: 4, XNOR4: 4,
  MUX4: 6
};

function maxZ(graph) {
  let m = 0;
  for (const n of graph) if ((n.z ?? 0) > m) m = n.z ?? 0;
  return m;
}

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
  setClockDelayInput,
  onReindex
) {

  function toggle(id) {
    let start = performance.now()
    
    const node = graph[id];
    if (!node) return;

    if (node.value && node.value[0]) {
      node.value = [false];
    } else {
      node.value = [true];
    }
    
    let [steps, evaluates] = propagate(graph, id);
    console.log("Propagation steps:", steps);
    console.log("Number of evaluations:", evaluates);
    console.log("Propagation time:", (performance.now() - start) * 1000, "µs");
    
    setGraph(graph); //can be removed, cuz other click handlers attached to toggle SVG fire re-renders

  }


  function Add(
    gate,
    wireData = null,
    inputpin = null,
    clockDelay = null,
    customComponent = null
  ) {
    if (!gate) return;

    if (gate === "CLOCK" && clockDelay === null) {
      setClockDelayInput("");
      setShowClockWindow(true);
      return;
    }

    if (gate === "CUSTOM" && !customComponent) return;

    addToUndoStack(graph, clock_delays);

    // Working copy: never mutate React state in place.
    const g = graph.map(n => ({
      ...n,
      inputs: n.inputs ? [...n.inputs] : n.inputs,
      outputs: n.outputs ? [...n.outputs] : n.outputs
    }));

    const id = g.length;
    const x = view.x + view.width / 2;
    const y = view.y + view.height / 2;
    const z = maxZ(graph) + 1;

    let newGate;

    if (gate === "CLOCK") {
      newGate = {
        type: gate, id, value: [false], inputs: [], outputs: [],
        x, y, z, rotation: 0, delay: Number(clockDelay)
      };
    }
    else if (gate === "WIRE") {
      newGate = {
        type: gate, id, value: [false], outputs: [],
        path: wireData.path,
        inputs: [{ id: wireData.inputId, index: wireData.outputIndex }]
      };
    }
    else if (gate === "CUSTOM") {
      const n = new Set(customComponent.inputs.map(i => i.sourceId)).size; //finds number of unique ids
      newGate = {
        type: "CUSTOM", id, outputs: [],
        name: customComponent.name,
        inputs: Array(n).fill(null),
        ext_inputs: structuredClone(customComponent.inputs),
        value: customComponent.outputs.map(() => false),
        ext_outputs: structuredClone(customComponent.outputs),
        ref_graph: structuredClone(customComponent.ref_graph),
        x, y, z, rotation: 0
      };
    }
    else if (gate === "TEXT") {
      newGate = {
        type: "TEXT", id, text: "Label",
        x, y, z, rotation: 0, inputs: [], value: []
      };
    }
    else {
      newGate = {
        type: gate, id, value: [false], outputs: [],
        inputs: Array(INPUT_COUNTS[gate] ?? 0).fill(null),
        x, y, z, rotation: 0
      };
    }

    // ---- connect ----
    if (wireData) {
      g[wireData.inputId].outputs.push(id);
    }

    if (inputpin) {
      const target = g[inputpin.gateId];
      target.inputs[inputpin.gateIndex] = { id, index: 0 };
      newGate.outputs.push(inputpin.gateId);
    }

    g.push(newGate);

    const [newGraph, newDelays, idMap] = compactAndReindex(g, clock_delays);

    settle(newGraph);

    if (onReindex) onReindex(idMap);

    setGraph(newGraph);
    setClockDelays(newDelays);

    return idMap.get(id);
  }

  function clearGraph() {
    if (graph.length === 0) {
      alert("Circuit is already empty.");
      return;
    }

    if (window.confirm("Are you sure you want to clear the circuit?")) {
      addToUndoStack(graph, clock_delays);
      setGraph([]);
      setClockDelays([]);
    }
  }


  return { toggle, Add, clearGraph };
}