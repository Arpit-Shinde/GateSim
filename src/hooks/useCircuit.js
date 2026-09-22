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
  setClockDelayInput,
  onReindex
) {

  function getInputCount(gate) {
    switch (gate) {
      case "NOT":
        return 1;
      case "AND":
      case "OR":
      case "NAND":
      case "NOR":
      case "XOR":
      case "XNOR":
      case "HALF_ADDER":
        return 2;

      case "AND3":
      case "OR3":
      case "NAND3":
      case "NOR3":
      case "XOR3":
      case "XNOR3":
      case "MUX2":
      case "FULL_ADDER":
        return 3;

      case "AND4":
      case "OR4":
      case "NAND4":
      case "NOR4":
      case "XOR4":
      case "XNOR4":
        return 4;

      case "MUX4":
        return 6

      default:
        return 0;
    }
  }

  // ─── TOGGLE ───
  function toggle(id) {
    let newGraph = structuredClone(graph);
    //do not push into undo stack here, its unneccessary

    newGraph[id].value = [!newGraph[id].value[0]];

    for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
      evaluate(newGraph);
    }

    setGraph(newGraph);
  }

  // ─── ADD GATE ───
  function Add(gate, wireData = null, inputpin = null, clockDelay = null, customComponent = null) {
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
        value: [false],
        inputs: [],
        x: view.x + view.width / 2,
        y: view.y + view.height / 2,
        z: Math.max(0, ...graph.map(node => node.z ?? 0)) + 1,
        rotation: 0,
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
        value: [false],
        path: wireData.path,
        inputs: [{ id: wireData.inputId, index: wireData.outputIndex }]
      };
      console.log("else if of wire entered")

    }

    else if (gate === "CUSTOM") {

      if (!customComponent) return;
      let n = new Set(customComponent.inputs.map(x => x.sourceId)).size;

      newGate = {
        type: "CUSTOM",
        id: graph.length,

        name: customComponent.name,

        inputs: Array(n).fill(null),
        ext_inputs: structuredClone(customComponent.inputs),

        value: customComponent.outputs.map(() => false),

        ext_outputs: structuredClone(customComponent.outputs),
        ref_graph: structuredClone(customComponent.ref_graph),

        x: view.x + view.width / 2,
        y: view.y + view.height / 2,

        z: Math.max(
          0,
          ...graph.map(node => node.z ?? 0)
        ) + 1,

        rotation: 0
      };

      console.table(newGate)
    }
    else if (gate === "TEXT") {
      newGate = {
        type: "TEXT",
        id: graph.length,
        text: "Label",
        x: view.x + view.width / 2,
        y: view.y + view.height / 2,
        z: Math.max(0, ...graph.map(node => node.z ?? 0)) + 1,
        rotation: 0,
        // TEXT has no inputs/outputs
        inputs: [],
        value: [],
      };
    }

    else {

      newGate = {
        type: gate,
        id: graph.length,
        value: [false],
        inputs: Array(getInputCount(gate)).fill(null),
        x: view.x + view.width / 2,
        y: view.y + view.height / 2,
        z: Math.max(0, ...graph.map(node => node.z ?? 0)) + 1,
        rotation: 0,
      };
    }

    // CONNECT HERE, BEFORE setGraph()
    let oldId = newGate.id;

    if (inputpin) {

      graph[inputpin.gateId].inputs[inputpin.gateIndex] = {
        id: newGate.id,
        index: 0
      };

      console.log("if inputpin entered");

      let current_input = graph[inputpin.gateId];

      if (current_input.type === "CUSTOM") {

        let nullCount = 0;

        for (let node of current_input.ref_graph) {

          if (!node.inputs)
            continue;

          for (let i = 0; i < node.inputs.length; i++) {

            if (node.inputs[i] === null) {

              if (nullCount === inputpin.gateIndex) {

                node.inputs[i] = {
                  id: newGate.id,
                  index: 0
                };

                break;
              }

              nullCount++;
            }
          }
        }
      }
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
    if (onReindex) onReindex(idMap);

    setGraph(newGraph);
    setClockDelays(new_clock_delays);

    console.log(`in Add(), newId = ${newId}`);

    return newId;
  }


  // ─── CLEAR GRAPH ───
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

  return {
    toggle,
    Add,
    clearGraph
  };
}