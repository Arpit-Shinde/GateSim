import { propagate, settle } from "../utils/evaluate";
import { compactAndReindex } from "../utils/reindex";
import { RANDOM_POSITION_OFFSET_MULTIPLIER } from "../constants/constants"
import { outPinWidth } from "../utils/busUtils";
import { GRID_SIZE } from "../constants/constants";


const INPUT_COUNTS = {
  NOT: 1,
  AND: 2, OR: 2, NAND: 2, NOR: 2, XOR: 2, XNOR: 2, HALF_ADDER: 2,
  AND3: 3, OR3: 3, NAND3: 3, NOR3: 3, XOR3: 3, XNOR3: 3, MUX2: 3, FULL_ADDER: 3,
  AND4: 4, OR4: 4, NAND4: 4, NOR4: 4, XOR4: 4, XNOR4: 4,
  MUX4: 6, JK: 3
};

const VALUE_COUNTS = {
  NOT: 1,
  AND: 1, OR: 1, NAND: 1, NOR: 1, XOR: 1, XNOR: 1, HALF_ADDER: 2,
  AND3: 1, OR3: 1, NAND3: 1, NOR3: 1, XOR3: 1, XNOR3: 1, MUX2: 1, FULL_ADDER: 2,
  AND4: 1, OR4: 1, NAND4: 1, NOR4: 1, XOR4: 1, XNOR4: 1,
  MUX4: 1, JK: 2
};

const KNOWN_TYPES = [

  "CLOCK", "WIRE", "TEXT", "CUSTOM",
  "BUS_IN", "BUS_OUT", "SPLITTER", "JOINER",
  // primitives covered by INPUT_COUNTS (plus the two that aren't)
  "INPUT", "BULB",
  ...Object.keys(INPUT_COUNTS),
];

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
  setShowClockWindow,
  remapTimingSignals,
  graphRef,
  clockDelaysRef,
  customComponents = []
) {

  // bit = index of the bit to flip (bus inputs); plain toggles use 0
  function toggle(id, bit = 0) {
    let newGraph = structuredClone(graph);

    const node = newGraph[id];
    if (!node) return;

    node.value[bit] = !node.value[bit];

    propagate(newGraph, id);

    setGraph(newGraph);
  }


  function Add(type, wireData = null, inputpin = null, clockDelay = null, customComponent = null, busConfig = null, x = null, y = null) {
    if (!type) return;

    const isKnown = KNOWN_TYPES.find(t => t === type) !== undefined; 
    if (!isKnown) {
    const component = customComponents.find(c => c.name === type);
    if (!component) {
      throw new Error(`Add: unknown gate or component "${type}"`);
    }
    customComponent = component;
    type = "CUSTOM";
  }

    if (type === "CLOCK" && clockDelay === null) {
      setShowClockWindow(true);
      return;
    }

    if (type === "CUSTOM" && !customComponent) return;

    if ((type === "BUS_IN" || type === "BUS_OUT" || type === "SPLITTER" || type === "JOINER") && !busConfig) return;

    addToUndoStack(graph, clock_delays);

    const graphCopy = graphRef.current.map((node) => {
      return { ...node, inputs: node.inputs ? [...node.inputs] : node.inputs, outputs: node.outputs ? [...node.outputs] : node.outputs }
    })

    const newClockDelays = structuredClone(clockDelaysRef.current)

    const id = graphCopy.length;
    const initialX = x ?? view.x + view.width / 2 + (Math.random() * 2 - 1) * RANDOM_POSITION_OFFSET_MULTIPLIER;
    const initialY = y ?? view.y + view.height / 2 + (Math.random() * 2 - 1) * RANDOM_POSITION_OFFSET_MULTIPLIER;
    const zIndex = maxZ(graph) + 1;

    let newGate;

    switch (type) {

      case "CLOCK":
        newGate = {
          type: type, id: id, value: [false], inputs: [], outputs: [],
          x: initialX, y: initialY, z: zIndex, rotation: 0, delay: Number(clockDelay)
        };
        newClockDelays.push({
          id: id,
          delay: Number(clockDelay),
          next_tick: performance.now() + Number(clockDelay)
        });
        break;

      case "WIRE": {
        const w = outPinWidth(graph[wireData.inputId], wireData.outputIndex);
        newGate = {
          type: type, id: id, width: w, value: Array(w).fill(false), outputs: [], path: wireData.path,
          inputs: [{ id: wireData.inputId, index: wireData.outputIndex }]
        };
        break;
      }

      case "BUS_IN": {
        const w = busConfig.width;
        newGate = {
          type, id, width: w, value: Array(w).fill(false),
          inputs: [], outputs: [], outWidths: [w],
          x: initialX, y: initialY, z: zIndex, rotation: 0
        };
        break;
      }

      case "BUS_OUT": {
        const w = busConfig.width;
        newGate = {
          type, id, width: w, value: Array(w).fill(false),
          inputs: [null], outputs: [], inWidths: [w],
          x: initialX, y: initialY, z: zIndex, rotation: 0
        };
        break;
      }

      case "SPLITTER": {
        const w = busConfig.width;
        newGate = {
          type, id, width: w, value: Array(w).fill(false),
          inputs: [null], outputs: [], inWidths: [w], outWidths: [...busConfig.parts],
          x: initialX, y: initialY, z: zIndex, rotation: 0
        };
        break;
      }

      case "JOINER": {
        const w = busConfig.width;
        newGate = {
          type, id, width: w, value: Array(w).fill(false),
          inputs: Array(busConfig.parts.length).fill(null), outputs: [],
          inWidths: [...busConfig.parts], outWidths: [w],
          x: initialX, y: initialY, z: zIndex, rotation: 0
        };
        break;
      }

      case "CUSTOM": {
        const n = new Set(customComponent.inputs.map(i => i.sourceId)).size; //finds number of unique ids

        // width of each input slot (one slot per unique source toggle / bus)
        const inWidths = [];
        const seen = new Set();
        for (const e of customComponent.inputs) {
          if (seen.has(e.sourceId)) continue;
          seen.add(e.sourceId);
          inWidths.push(e.width ?? 1);
        }
        const outWidths = customComponent.outputs.map(o => o.width ?? 1);
        const totalOut = outWidths.reduce((a, b) => a + b, 0);

        newGate = {
          type: "CUSTOM", id: id, outputs: [], name: customComponent.name,
          inputs: Array(n).fill(null),
          ext_inputs: structuredClone(customComponent.inputs),
          value: Array(totalOut).fill(false),
          ext_outputs: structuredClone(customComponent.outputs),
          ref_graph: structuredClone(customComponent.ref_graph),
          inWidths, outWidths,
          x: initialX, y: initialY, z: zIndex, rotation: 0
        };
        break;
      }

      case "TEXT":
        newGate = { type: "TEXT", id: id, text: "Label", x: initialX, y: initialY, z: zIndex, rotation: 0, inputs: [], value: [] };
        break;

      default:
        newGate = {
          type: type, id: id, value: Array(VALUE_COUNTS[type] ?? 0).fill(false), outputs: [],
          inputs: Array(INPUT_COUNTS[type] ?? 0).fill(null), x: initialX, y: initialY, z: zIndex, rotation: 0
        };
        break;

    }

    //Connect
    if (wireData) {
      graphCopy[wireData.inputId].outputs.push(id);
    }

    if (inputpin) {
      const target = graphCopy[inputpin.gateId];
      // if (target.inputs[inputpin.gateIndex]) graphCopy.splice(target.inputs[inputpin.gateIndex].id, 1);

      target.inputs[inputpin.gateIndex] = { id, index: 0 }; //index=0 because its a wire
      newGate.outputs.push(inputpin.gateId);
    }

    graphCopy.push(newGate);

    const [newGraph, idMap] = compactAndReindex(graphCopy);

    settle(newGraph);

    if (remapTimingSignals) remapTimingSignals(idMap);
    graphRef.current = newGraph;
    clockDelaysRef.current = newClockDelays;

    setGraph(newGraph);
    setClockDelays(newClockDelays);

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