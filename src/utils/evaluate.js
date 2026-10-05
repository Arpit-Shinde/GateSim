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

function readState(input, graph, map) {
  if (!input || input.index === -1) {
    return false;
  }

  // External input injected into a CUSTOM component.
  if (input.id === "__CUSTOM_INPUT__") {
    return input.value ?? false;
  }

  let source;

  if (map) {
    source = map.get(input.id);
  } else {
    source = graph[input.id];
  }

  return source?.value?.[input.index] ?? false;
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

function computeNext(node, graph, map) {
  const type = node.type;

  // These nodes are sources.
  // Their values are controlled externally.
  if (
    type === "INPUT" ||
    type === "CLOCK" ||
    type === "EXT_SIGNAL"
  ) {
    return null;
  }

  const inp = node.inputs ?? [];
  const n = inp.length;

  const a = n > 0 ? readState(inp[0], graph, map) : false;
  const b = n > 1 ? readState(inp[1], graph, map) : false;
  const c = n > 2 ? readState(inp[2], graph, map) : false;
  const d = n > 3 ? readState(inp[3], graph, map) : false;
  const e = n > 4 ? readState(inp[4], graph, map) : false;
  const f = n > 5 ? readState(inp[5], graph, map) : false;

  switch (type) {

    case "WIRE":   return is_changed(node, [a]);
    case "BULB":   return is_changed(node, [a]);
    case "NOT":    return is_changed(node, [!a]);

    case "AND":    return is_changed(node, [a && b]);
    case "OR":     return is_changed(node, [a || b]);
    case "XOR":    return is_changed(node, [a !== b]);
    case "NAND":   return is_changed(node, [!(a && b)]);
    case "NOR":    return is_changed(node, [!(a || b)]);
    case "XNOR":   return is_changed(node, [a === b]);

    case "AND3":   return is_changed(node, [a && b && c]);
    case "OR3":    return is_changed(node, [a || b || c]);
    case "NAND3":  return is_changed(node, [!(a && b && c)]);
    case "NOR3":   return is_changed(node, [!(a || b || c)]);
    case "XOR3":   return is_changed(node, [(a !== b) !== c]);
    case "XNOR3":  return is_changed(node, [(a === b) === c]);

    case "AND4":   return is_changed(node, [a && b && c && d]);
    case "OR4":    return is_changed(node, [a || b || c || d]);
    case "NAND4":  return is_changed(node, [!(a && b && c && d)]);
    case "NOR4":   return is_changed(node, [!(a || b || c || d)]);
    case "XOR4":   return is_changed(node, [(a !== b) !== (c !== d)]);
    case "XNOR4":  return is_changed(node, [((a === b) === c) === d]);

    case "MUX2":
      return is_changed(node, [c ? b : a]);

    case "MUX4":
      return is_changed(
        node,
        [f ? (e ? d : c) : (e ? b : a)]
      );

    case "HALF_ADDER":
      return is_changed(
        node,
        [
          a !== b, // sum
          a && b   // carry
        ]
      );


    case "FULL_ADDER":
      return is_changed(
        node,
        [
          (a !== b) !== c,              // sum
          (a && b) || (c && (a !== b))  // carry
        ]
      );
    case "JK": {
      // inputs:
      //
      // a = J
      // b = CLK
      // c = K;

      const oldQ = node.value?.[0] ?? false;

      let q = oldQ;

      // Rising edge:
      //
      // previous clock = 0
      // current clock  = 1
      if (b && !(node.lastClock ?? false)) {

        // J=1 K=1 -> toggle
        if (a && c) {
          q = !q;
        }

        // J=1 K=0 -> set
        else if (a) {
          q = true;
        }

        // J=0 K=1 -> reset
        else if (c) {
          q = false;
        }

        // J=0 K=0 -> hold
      }

      // Remember the current clock.
      _lastClock = b;

      return is_changed(
        node,
        [q, !q]
      );
    }

    case "CUSTOM":
      return evaluateCustom(node, graph, map);


    default:
      return null;
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
    CONSTANTS.MAX_EVALUATION_ITERATIONS * 100
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

  const extInputs =
    customNode.ext_inputs ?? EMPTY;

  const extOutputs =
    customNode.ext_outputs ?? EMPTY;

  const refGraph =
    customNode.ref_graph ?? EMPTY;


  // map to avoid O(n) find. using this map, we can get a node in refGraph with given id. actually, array index != id here.
  const internalMap = buildMap(refGraph);

  // map which consist sourceid -> index of slot in customNode.inputs from where it recieves signal
  const sourceToIndex = new Map();

  for (const ext of extInputs) {
    if (!sourceToIndex.has(ext.sourceId)) {
      sourceToIndex.set(
        ext.sourceId,
        sourceToIndex.size
      );
    }
  }

  const extConns = customNode.inputs ?? EMPTY;


  // Internal nodes whose input signals changed.
  const seedIds = [];

  // step 1
  for (const ext of extInputs) { //ext = {id: to which node the input goes, index: to which pin of that node, sourceId: id of the toggle to which this node was connected during abstractGraph }

    //node in the refGraph which this ext points to
    const internalNode =
      internalMap.get(ext.id);

    if (!internalNode) {
      continue;
    }


    // gets index of slot in customNode.inputs from where it recieves signal
    const customInputIndex = sourceToIndex.get(ext.sourceId);


    const conn = extConns[customInputIndex]; // {id: id of the node sending external signal, index: ...}

    let signal = false; // if conn is null, we default the signal to false


    if (conn) {

      let source;

      if (map) {
        source = map.get(conn.id);
      } else {
        source = graph[conn.id];
      }


      if (source) {

        signal = source.value?.[conn.index] ?? false; //get the signal
      }
    }


    // ========================================================
    // CASE 1:
    // Internal node is another CUSTOM component
    // ========================================================

    if (internalNode.type === "CUSTOM") {

      // We need an internal signal node to carry the
      // external value into the nested CUSTOM component.

      const carrierId =
        ext._carrierId ??
        `__ext_${ext.id}_${ext.index}__`;


      ext._carrierId = carrierId;


      let carrier =
        internalMap.get(carrierId);


      let carrierChanged = false;


      // ------------------------------------------------------
      // Create carrier if necessary.
      // ------------------------------------------------------

      if (!carrier) {

        carrier = {
          type: "EXT_SIGNAL",
          id: carrierId,
          value: [signal],
          inputs: [],
          outputs: []
        };


        refGraph.push(carrier);

        internalMap.set(
          carrierId,
          carrier
        );

        carrierChanged = true;
      }


      // ------------------------------------------------------
      // Update carrier if signal changed.
      // ------------------------------------------------------

      else if (
        carrier.value[0] !== signal
      ) {

        carrier.value = [signal];

        carrierChanged = true;
      }


      // ------------------------------------------------------
      // Connect nested CUSTOM input to carrier.
      // ------------------------------------------------------

      if (internalNode.inputs) {

        const current =
          internalNode.inputs[ext.index];


        if (
          !current ||
          current.id !== carrierId
        ) {

          internalNode.inputs[ext.index] = {
            id: carrierId,
            index: 0
          };

          carrierChanged = true;
        }
      }


      // If the carrier changed, the nested CUSTOM node
      // needs to be evaluated.
      if (carrierChanged) {
        seedIds.push(internalNode.id);
      }
    }

    //for normal gates
    else if (internalNode.inputs) {

      const current =
        internalNode.inputs[ext.index];


      // ------------------------------------------------------
      // Already using __CUSTOM_INPUT__
      // ------------------------------------------------------

      if (
        current &&
        current.id === "__CUSTOM_INPUT__"
      ) {

        if (current.value !== signal) {

          current.value = signal;

          seedIds.push(
            internalNode.id
          );
        }
      }

      else {

        internalNode.inputs[ext.index] = { //write the signal here
          id: "__CUSTOM_INPUT__",
          index: 0,
          value: signal
        };

        seedIds.push(
          internalNode.id
        );
      }
    }
  }

  if (seedIds.length > 0) { //same as normal propagate, but graph.id === index invariant isnt there, so we use map. 

    propagateFrom(
      refGraph,
      internalMap,
      seedIds
    );
  }


  const oldValue =
    customNode.value ?? EMPTY;


  const outputCount =
    extOutputs.length;


  const nextValue =
    new Array(outputCount);


  let differs =
    oldValue.length !== outputCount;


  for (let i = 0; i < outputCount; i++) {

    const output =
      extOutputs[i];


    const internalNode =
      internalMap.get(output.id);


    const value =
      internalNode?.value?.[output.index] ?? false;


    nextValue[i] =
      value;


    if (
      !differs &&
      oldValue[i] !== value
    ) {

      differs = true;
    }
  }


  return differs
    ? nextValue
    : null;
}

//evaluates nodes in graph order.

function evaluateGraph(graph, map) {

  let changed = false;


  for (let i = 0; i < graph.length; i++) {

    const node =
      graph[i];


    const type =
      node.type;


    // Sources don't get calculated.
    if (
      type === "INPUT" ||
      type === "CLOCK" ||
      type === "EXT_SIGNAL"
    ) {
      continue;
    }


    const nextValue =
      computeNext(
        node,
        graph,
        map
      );


    // JK clock bookkeeping.
    if (node.type === "JK") {
      node.lastClock =
        _lastClock;
    }


    // No change.
    if (nextValue === null) {
      continue;
    }


    // Commit new value.
    node.value =
      nextValue;


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

  const map =
    buildMap(graph);


  const maxIter =
    CONSTANTS.MAX_EVALUATION_ITERATIONS;


  for (
    let i = 0;
    i < maxIter;
    i++
  ) {

    const changed =
      evaluateGraph(
        graph,
        map
      );


    if (!changed) {
      return true;
    }
  }

  return false;
}

export function propagate(graph, id) {

  const source = graph[id];

  if (!source) {
    return;
  }

  let cur = [];
  let nxt = [];

  const visited = new Set(); //initial frontier

  for (const outputId of source.outputs) {

    if (visited.has(outputId)) {
      continue;
    }
    visited.add(outputId);
    cur.push(outputId);
  }

  const MAX_STEPS = Math.max(graph.length + 1, CONSTANTS.MAX_EVALUATION_ITERATIONS * 100);

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

      const nextValue = computeNext(node,graph,null);

      const isJK =node.type === "JK";

      if (node.type !== "WIRE") {
        evaluates++;
        stepHasGate = true;
      }

      if (nextValue !== null || isJK) {
        resultNodes.push(node);
        resultValues.push(
          nextValue
        );
        resultClocks.push(
          isJK
            ? _lastClock
            : false
        );
      }
    }

    if (stepHasGate) {
      gateSteps++;
    }

    //phase 2

    nxt.length = 0;

    const nextVisited = new Set();

    for (let i = 0;i < resultNodes.length;i++) {

      const node = resultNodes[i];

      if (node.type === "JK") {
        node.lastClock = resultClocks[i];
      }

      const nextValue = resultValues[i];


      if (nextValue === null) {
        continue;
      }

      // Commit.
      node.value = nextValue;
      const outputs =
        node.outputs;

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

    const temp = cur;

    cur = nxt;

    nxt = temp;
  }

  if (cur.length > 0) {
    console.warn("propagate(): did not settle within propagation limit.");
  }


  return [gateSteps, evaluates];
}