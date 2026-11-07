import * as CONSTANTS from "../constants/constants";

const EMPTY = Object.freeze([]);

// Return null if the node's value did not change.
// Otherwise return the new value.
function is_changed(node, new_value) {
  const old_value = node.value ?? [];

  if (old_value.length !== new_value.length) {
    return new_value;
  }

  for (let i = 0; i < new_value.length; i++) {
    if (old_value[i] !== new_value[i]) {
      return new_value;
    }
  }

  return null;
}

// Offset of an output pin inside node.value. Nodes with multi-bit pins
// (buses, splitters, joiners, custom components) define node.outWidths;
// all other nodes have one bit per pin.
export function pinOffset(node, index) {
  const w = node?.outWidths;
  if (!w) return index;
  let o = 0;
  for (let i = 0; i < index; i++) o += w[i] ?? 1;
  return o;
}

function readState(input, graph, map) {
  if (!input || input.index === -1) return false;

  if (input.id === "__CUSTOM_INPUT__") {
    const v = input.value;
    return Array.isArray(v) ? !!v[0] : (v ?? false);
  }

  const source = map ? map.get(input.id) : graph[input.id];

  return source?.value?.[pinOffset(source, input.index)] ?? false;
}

// Reads `width` bits from the pin an input is connected to.
function readBits(input, graph, map, width) {
  const out = new Array(width).fill(false);
  if (!input || input.index === -1) return out;

  if (input.id === "__CUSTOM_INPUT__") {
    const v = input.value;
    if (Array.isArray(v)) {
      for (let i = 0; i < width; i++) out[i] = !!v[i];
    } else {
      out[0] = !!v;
    }
    return out;
  }

  const source = map ? map.get(input.id) : graph[input.id];
  if (!source || !source.value) return out;

  const off = pinOffset(source, input.index);
  for (let i = 0; i < width; i++) out[i] = !!source.value[off + i];
  return out;
}

export function sameBits(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  return a === b;
}

//returns map having id -> reference to node having that id
function buildMap(graph) {
  const map = new Map();

  for (let i = 0; i < graph.length; i++) {
    map.set(graph[i].id, graph[i]);
  }

  return map;
}

let _lastClock = false;

//returns new evaluated value, else null if unchanged
function computeNext(node, graph, map) {
  const type = node.type;

  // These nodes are sources.
  // Their values are controlled externally.
  if (
    type === "INPUT" ||
    type === "CLOCK" ||
    type === "EXT_SIGNAL" ||
    type === "BUS_IN"
  ) return null;

  const inp = node.inputs ?? [];
  const n = inp.length;

  const a = n > 0 ? readState(inp[0], graph, map) : false;
  const b = n > 1 ? readState(inp[1], graph, map) : false;
  const c = n > 2 ? readState(inp[2], graph, map) : false;
  const d = n > 3 ? readState(inp[3], graph, map) : false;
  const e = n > 4 ? readState(inp[4], graph, map) : false;
  const f = n > 5 ? readState(inp[5], graph, map) : false;

  switch (type) {

    case "WIRE":
    case "BUS_OUT":
    case "SPLITTER":
      return is_changed(node, readBits(inp[0], graph, map, node.width ?? 1));

    case "JOINER": {
      const bits = [];
      (node.inWidths ?? []).forEach((w, i) => {
        bits.push(...readBits(inp[i], graph, map, w));
      });
      return is_changed(node, bits);
    }
    case "BULB": return is_changed(node, [a]);
    case "NOT": return is_changed(node, [!a]);

    case "AND": return is_changed(node, [a && b]);
    case "OR": return is_changed(node, [a || b]);
    case "XOR": return is_changed(node, [a !== b]);
    case "NAND": return is_changed(node, [!(a && b)]);
    case "NOR": return is_changed(node, [!(a || b)]);
    case "XNOR": return is_changed(node, [a === b]);

    case "AND3": return is_changed(node, [a && b && c]);
    case "OR3": return is_changed(node, [a || b || c]);
    case "NAND3": return is_changed(node, [!(a && b && c)]);
    case "NOR3": return is_changed(node, [!(a || b || c)]);
    case "XOR3": return is_changed(node, [(a !== b) !== c]);
    case "XNOR3": return is_changed(node, [!((a !== b) !== c)]);

    case "AND4": return is_changed(node, [a && b && c && d]);
    case "OR4": return is_changed(node, [a || b || c || d]);
    case "NAND4": return is_changed(node, [!(a && b && c && d)]);
    case "NOR4": return is_changed(node, [!(a || b || c || d)]);
    case "XOR4": return is_changed(node, [(a !== b) !== (c !== d)]);
    case "XNOR4": return is_changed(node, [((a === b) === c) === d]);

    case "MUX2": return is_changed(node, [c ? b : a]);
    case "MUX4": return is_changed(node, [f ? (e ? d : c) : (e ? b : a)]);

    case "HALF_ADDER":
      return is_changed(node, [a !== b, a && b]);


    case "FULL_ADDER":
      return is_changed(node, [(a !== b) !== c, (a && b) || (c && (a !== b))]);
    case "JK": {
      // inputs: a = J, b = CLK, c = K;

      const oldQ = node.value?.[0] ?? false;
      let q = oldQ;

      // Rising edge: previous clock = 0, current clock  = 1
      if (b && !(node.lastClock ?? false)) {

        // J=1 K=1 -> toggle
        if (a && c) q = !q;

        // J=1 K=0 -> set
        else if (a) q = true;

        // J=0 K=1 -> reset
        else if (c) q = false;

        // J=0 K=0 -> hold
      }

      // Remember the current clock.
      _lastClock = b;

      return is_changed(node, [q, !q]);
    }

    case "CUSTOM": return evaluateCustom(node, graph, map);

    default: return null;
  }
}

function getInternalOutputs(refGraph) {
  const outputs = new Map();

  // First create an empty output list for every node.
  for (const node of refGraph) {
    if (!node) continue;

    outputs.set(node.id, []);
  }

  // Then inspect every node's inputs.
  //
  // If B has input from A:
  //
  //     B.inputs = [{ id: A, index: 0 }]
  //
  //  then:
  //
  //     A -> B
  //
  for (const node of refGraph) {
    if (!node) continue;

    for (const input of node.inputs ?? []) {

      if (!input) {
        continue;
      }

      // Disconnected input.
      if (input.index === -1) {
        continue;
      }

      // __CUSTOM_INPUT__ is not an internal graph node.
      //
      // It represents a signal injected from the outside.
      if (input.id === "__CUSTOM_INPUT__") {
        continue;
      }

      if (!outputs.has(input.id)) {
        outputs.set(input.id, []);
      }

      outputs.get(input.id).push(node.id);
    }
  }

  return outputs;
}


// ============================================================
// PROPAGATE INSIDE CUSTOM COMPONENT
// ============================================================
//
// This is basically the same algorithm as propagate(),
// except:
//
//     graph IDs may not equal array indexes
//
// so we use a Map.
//
function propagateFrom(graph, map, seedIds) {

  // Build internal dependency information.
  const internalOutputs = getInternalOutputs(graph);

  let cur = [];
  let nxt = [];

  // ----------------------------------------------------------
  // INITIAL FRONTIER
  // ----------------------------------------------------------

  const visited = new Set();

  for (const id of seedIds) {

    if (visited.has(id)) {
      continue;
    }

    visited.add(id);
    cur.push(id);
  }


  // ----------------------------------------------------------
  // PROPAGATION LIMIT
  // ----------------------------------------------------------

  const MAX_STEPS = Math.max(
    graph.length + 1,
    CONSTANTS.MAX_EVALUATION_ITERATIONS
  );


  // ----------------------------------------------------------
  // TEMPORARY RESULTS
  // ----------------------------------------------------------

  const resultNodes = [];
  const resultValues = [];
  const resultClocks = [];


  let step = 0;


  // ==========================================================
  // FRONTIER PROPAGATION
  // ==========================================================

  while (
    cur.length > 0 &&
    step < MAX_STEPS
  ) {

    step++;


    // ========================================================
    // PHASE 1
    // ========================================================
    //
    // Calculate EVERY node using the same committed state.
    //
    // Nothing is changed yet.
    //

    resultNodes.length = 0;
    resultValues.length = 0;
    resultClocks.length = 0;


    for (const id of cur) {

      const node = map.get(id);

      if (!node) {
        continue;
      }

      const nextValue =
        computeNext(node, graph, map);

      const isJK =
        node.type === "JK";


      // If the node changed, remember it.
      //
      // For JK we also remember the clock state even when
      // its Q output did not change.
      if (
        nextValue !== null ||
        isJK
      ) {

        resultNodes.push(node);
        resultValues.push(nextValue);

        resultClocks.push(
          isJK ? _lastClock : false
        );
      }
    }


    // ========================================================
    // PHASE 2
    // ========================================================
    //
    // NOW commit the results.
    //
    // Only nodes whose value actually changed cause their
    // outputs to enter the next frontier.
    //

    nxt.length = 0;

    const nextVisited = new Set();


    for (let i = 0; i < resultNodes.length; i++) {

      const node = resultNodes[i];

      // Save JK clock state.
      if (node.type === "JK") {
        node.lastClock = resultClocks[i];
      }


      const nextValue =
        resultValues[i];


      // null means:
      //
      //     node's output did not change
      //
      if (nextValue === null) {
        continue;
      }


      // Commit new value.
      node.value = nextValue;


      // Find nodes affected by this change.
      const outputs =
        internalOutputs.get(node.id);


      if (!outputs) {
        continue;
      }


      for (const outputId of outputs) {

        if (nextVisited.has(outputId)) {
          continue;
        }

        nextVisited.add(outputId);
        nxt.push(outputId);
      }
    }


    // Move to next frontier.
    const temp = cur;
    cur = nxt;
    nxt = temp;
  }


  if (cur.length > 0) {
    console.warn(
      "propagateFrom(): custom component did not settle."
    );
  }
}

// First find from where the signal comes to the custom component's pin, read and write the signal into inputs. (step 1)
// Then propagate that signal throughout the refGraph (step 2)
// Then fetch the outputs and return it.
function evaluateCustom(customNode, graph, map) {

  const extInputs = customNode.ext_inputs ?? EMPTY;
  const extOutputs = customNode.ext_outputs ?? EMPTY;
  const refGraph = customNode.ref_graph ?? EMPTY;

  const internalMap = buildMap(refGraph);

  // sourceId -> slot index in customNode.inputs
  const sourceToIndex = new Map();
  for (const ext of extInputs) {
    if (!sourceToIndex.has(ext.sourceId)) {
      sourceToIndex.set(ext.sourceId, sourceToIndex.size);
    }
  }

  const extConns = customNode.inputs ?? EMPTY;

  const seedIds = [];

  // step 1: push external signals (1 bit or a whole bus) into the internal nodes
  for (const ext of extInputs) {

    const internalNode = internalMap.get(ext.id);
    if (!internalNode) continue;

    const w = ext.width ?? 1;
    const customInputIndex = sourceToIndex.get(ext.sourceId);
    const conn = extConns[customInputIndex];

    const bits = readBits(conn, graph, map, w);          // always an array
    const signal = w > 1 ? bits : bits[0];               // legacy 1-bit pins stay booleans

    // CASE 1: internal node is another CUSTOM component
    if (internalNode.type === "CUSTOM") {

      const carrierId = ext._carrierId ?? `__ext_${ext.id}_${ext.index}__`;
      ext._carrierId = carrierId;

      let carrier = internalMap.get(carrierId);
      let carrierChanged = false;

      if (!carrier) {
        carrier = {
          type: "EXT_SIGNAL",
          id: carrierId,
          value: bits.slice(),
          inputs: [],
          outputs: []
        };
        refGraph.push(carrier);
        internalMap.set(carrierId, carrier);
        carrierChanged = true;
      }
      else if (!sameBits(carrier.value, bits)) {
        carrier.value = bits.slice();
        carrierChanged = true;
      }

      if (internalNode.inputs) {
        const current = internalNode.inputs[ext.index];
        if (!current || current.id !== carrierId) {
          internalNode.inputs[ext.index] = { id: carrierId, index: 0 };
          carrierChanged = true;
        }
      }

      if (carrierChanged) seedIds.push(internalNode.id);
    }

    // CASE 2: ordinary internal node (gate, splitter, joiner, ...)
    else if (internalNode.inputs) {

      const current = internalNode.inputs[ext.index];

      if (current && current.id === "__CUSTOM_INPUT__") {
        if (!sameBits(current.value, signal)) {
          current.value = signal;
          seedIds.push(internalNode.id);
        }
      }
      else {
        internalNode.inputs[ext.index] = {
          id: "__CUSTOM_INPUT__",
          index: 0,
          value: signal
        };
        seedIds.push(internalNode.id);
      }
    }
  }

  if (seedIds.length > 0) {
    propagateFrom(refGraph, internalMap, seedIds);
  }

  // step 3: collect outputs. Value layout = concatenation of every output pin.
  const oldValue = customNode.value ?? EMPTY;

  const total = extOutputs.reduce((s, o) => s + (o.width ?? 1), 0);
  const nextValue = new Array(total).fill(false);

  let off = 0;
  for (const output of extOutputs) {
    const w = output.width ?? 1;
    const internalNode = internalMap.get(output.id);

    if (internalNode?.value) {
      const base = pinOffset(internalNode, output.index);
      for (let j = 0; j < w; j++) {
        nextValue[off + j] = !!internalNode.value[base + j];
      }
    }
    off += w;
  }

  let differs = oldValue.length !== total;
  if (!differs) {
    for (let i = 0; i < total; i++) {
      if (oldValue[i] !== nextValue[i]) { differs = true; break; }
    }
  }

  return differs ? nextValue : null;
}

function evaluateGraph(graph, map) {

  let changed = false;

  for (let i = 0; i < graph.length; i++) {
    const node = graph[i];
    const type = node.type;

    // Sources don't get calculated.
    if (
      type === "INPUT" ||
      type === "CLOCK" ||
      type === "EXT_SIGNAL" ||
      type === "BUS_IN"
    ) continue;

    const nextValue = computeNext(node, graph, map);

    // JK clock bookkeeping.
    if (node.type === "JK") node.lastClock = _lastClock;

    // No change.
    if (nextValue === null) continue;

    // Commit new value.
    node.value = nextValue;

    changed = true;
  }

  return changed;
}


// ============================================================
// PUBLIC evaluate()
// ============================================================

export function evaluate(
  graph,
  nodeMap = null
) {

  const map =
    nodeMap ?? buildMap(graph);


  return evaluateGraph(
    graph,
    map
  );
}

export function settle(graph) {

  for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
    const didChange = evaluateGraph(graph);
    if (!didChange) return true;
  }

  return false;
}

export function propagate(graph, id) {

  const source = graph[id];

  if (!source) return;

  let cur = [];
  let nxt = [];

  const visited = new Set();

  //initial frontier
  for (const outputId of source.outputs) {
    if (visited.has(outputId)) continue;
    visited.add(outputId);
    cur.push(outputId);
  }

  const MAX_STEPS = Math.max(graph.length + 1, CONSTANTS.MAX_EVALUATION_ITERATIONS);

  const resultNodes = [];
  const resultValues = [];
  const resultClocks = [];

  let step = 0;
  let evaluates = 0;
  let gateSteps = 0;

  while (cur.length > 0 && step < MAX_STEPS) {
    step++;
    let stepHasGate = false;

    //phase 1

    resultNodes.length = 0;
    resultValues.length = 0;
    resultClocks.length = 0;

    for (const nodeId of cur) {

      const node = graph[nodeId];

      if (!node) continue;

      const nextValue = computeNext(node, graph, null); //null if unchanged, else new value

      const isJK = node.type === "JK";

      if (node.type !== "WIRE") {
        evaluates++;
        stepHasGate = true;
      }

      if (nextValue !== null || isJK) { //only add nodes whose values changed
        resultNodes.push(node);
        resultValues.push(nextValue);
        resultClocks.push(isJK ? _lastClock : false);
      }
    }

    if (stepHasGate) gateSteps++;

    //phase 2

    nxt.length = 0;

    const nextVisited = new Set();

    for (let i = 0; i < resultNodes.length; i++) {

      const node = resultNodes[i];

      if (node.type === "JK") node.lastClock = resultClocks[i];

      const nextValue = resultValues[i];

      if (nextValue === null) continue; //null encountered only for JK

      // Commit.
      node.value = nextValue;
      const outputs = node.outputs;

      if (!outputs) continue;

      for (const outputId of outputs) {
        if (nextVisited.has(outputId)) continue;
        nextVisited.add(outputId);
        nxt.push(outputId);
      }
    }

    const temp = cur;
    cur = nxt;
    nxt = temp;
  }

  if (cur.length > 0) console.warn("propagate(): did not settle within propagation limit.");

  return [gateSteps, evaluates];
}