// evaluate.js

import * as CONSTANTS from "../constants/constants";

// ============================================================
// HELPERS
// ============================================================

function valuesEqual(a, b) {
  if (a === b) return true;

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function setNodeValue(node, nextValue) {
  const changed = !valuesEqual(node.value, nextValue);

  node.value = nextValue;

  return changed;
}

// ============================================================
// MAIN EVALUATOR
// ============================================================

export function evaluate(graph) {
  // O(N) once per evaluation pass.
  // Replaces repeated graph.find(...) calls with O(1) Map lookups.
  const nodeMap = new Map();

  for (const node of graph) {
    nodeMap.set(node.id, node);
  }

  let changed = false;

  for (const node of graph) {
    // These nodes get their values externally.
    if (
      node.type === "INPUT" ||
      node.type === "CLOCK" ||
      node.type === "EXT_SIGNAL"
    ) {
      continue;
    }

    // --------------------------------------------------------
    // CUSTOM COMPONENT
    // --------------------------------------------------------

    if (node.type === "CUSTOM") {
      const customChanged = evaluateCustom(
        node,
        graph,
        nodeMap
      );

      if (customChanged) {
        changed = true;
      }

      continue;
    }

    // --------------------------------------------------------
    // RESOLVE INPUT VALUES
    // --------------------------------------------------------

    const values = node.inputs.map(input => {
      if (!input || input.index === -1) {
        return false;
      }

      // Input coming from a CUSTOM component boundary.
      if (input.id === "__CUSTOM_INPUT__") {
        return input.value ?? false;
      }

      const source = nodeMap.get(input.id);

      return source?.value?.[input.index] ?? false;
    });

    const a = values[0] ?? false;
    const b = values[1] ?? false;
    const c = values[2] ?? false;
    const d = values[3] ?? false;
    const e = values[4] ?? false;
    const f = values[5] ?? false;

    let nodeChanged = false;

    switch (node.type) {

      // ======================================================
      // BASIC GATES
      // ======================================================

      case "WIRE":
        nodeChanged = setNodeValue(node, [a]);
        break;

      case "AND":
        nodeChanged = setNodeValue(node, [a && b]);
        break;

      case "OR":
        nodeChanged = setNodeValue(node, [a || b]);
        break;

      case "NOT":
        nodeChanged = setNodeValue(node, [!a]);
        break;

      case "XOR":
        nodeChanged = setNodeValue(node, [a !== b]);
        break;

      case "NAND":
        nodeChanged = setNodeValue(node, [!(a && b)]);
        break;

      case "NOR":
        nodeChanged = setNodeValue(node, [!(a || b)]);
        break;

      case "XNOR":
        nodeChanged = setNodeValue(node, [a === b]);
        break;


      // ======================================================
      // 3-INPUT GATES
      // ======================================================

      case "AND3":
        nodeChanged = setNodeValue(node, [
          a && b && c
        ]);
        break;

      case "OR3":
        nodeChanged = setNodeValue(node, [
          a || b || c
        ]);
        break;

      case "NAND3":
        nodeChanged = setNodeValue(node, [
          !(a && b && c)
        ]);
        break;

      case "NOR3":
        nodeChanged = setNodeValue(node, [
          !(a || b || c)
        ]);
        break;

      case "XOR3":
        nodeChanged = setNodeValue(node, [
          (a !== b) !== c
        ]);
        break;

      case "XNOR3":
        nodeChanged = setNodeValue(node, [
          (a === b) === c
        ]);
        break;


      // ======================================================
      // 4-INPUT GATES
      // ======================================================

      case "AND4":
        nodeChanged = setNodeValue(node, [
          a && b && c && d
        ]);
        break;

      case "OR4":
        nodeChanged = setNodeValue(node, [
          a || b || c || d
        ]);
        break;

      case "NAND4":
        nodeChanged = setNodeValue(node, [
          !(a && b && c && d)
        ]);
        break;

      case "NOR4":
        nodeChanged = setNodeValue(node, [
          !(a || b || c || d)
        ]);
        break;

      case "XOR4":
        nodeChanged = setNodeValue(node, [
          (a !== b) !== (c !== d)
        ]);
        break;

      case "XNOR4":
        nodeChanged = setNodeValue(node, [
          ((a === b) === c) === d
        ]);
        break;


      // ======================================================
      // MUX
      // ======================================================

      case "MUX2":
        nodeChanged = setNodeValue(node, [
          c ? b : a
        ]);
        break;

      case "MUX4":
        nodeChanged = setNodeValue(node, [
          f
            ? (e ? d : c)
            : (e ? b : a)
        ]);
        break;


      // ======================================================
      // BASIC OUTPUT
      // ======================================================

      case "BULB":
        nodeChanged = setNodeValue(node, [a]);
        break;


      // ======================================================
      // ADDERS
      // ======================================================

      case "HALF_ADDER":
        nodeChanged = setNodeValue(node, [
          a !== b,       // Sum
          a && b         // Carry
        ]);
        break;

      case "FULL_ADDER":
        nodeChanged = setNodeValue(node, [
          (a !== b) !== c,                // Sum
          (a && b) || (c && (a !== b))    // Carry
        ]);
        break;


      // ======================================================
      // JK FLIP-FLOP
      // ======================================================

      case "JK": {
        const j = a;
        const clk = b;
        const k = c;

        const oldQ = node.value?.[0] ?? false;
        const oldQbar = node.value?.[1] ?? !oldQ;
        const oldLastClock = node.lastClock ?? false;

        let q = oldQ;

        // Rising edge
        if (clk && !oldLastClock) {

          if (j && k) {
            q = !q;
          }
          else if (j && !k) {
            q = true;
          }
          else if (!j && k) {
            q = false;
          }
        }

        node.lastClock = clk;

        const nextValue = [
          q,
          !q
        ];

        // Only output-value changes contribute to convergence.
        // A lastClock change alone does not require another
        // combinational iteration.
        nodeChanged =
          oldQ !== nextValue[0] ||
          oldQbar !== nextValue[1];

        node.value = nextValue;

        break;
      }


      // ======================================================
      // UNKNOWN / UNSUPPORTED NODE
      // ======================================================

      default:
        break;
    }

    if (nodeChanged) {
      changed = true;
    }
  }

  // Tell the caller whether another fixed-point iteration
  // is actually necessary.
  return changed;
}


// ============================================================
// CUSTOM COMPONENT
// ============================================================

function evaluateCustom(
  customNode,
  outerGraph,
  outerNodeMap
) {
  const extInputs = customNode.ext_inputs ?? [];
  const extOutputs = customNode.ext_outputs ?? [];
  const refGraph = customNode.ref_graph ?? [];

  // ----------------------------------------------------------
  // Map external source IDs -> custom input index
  // ----------------------------------------------------------

  const sourceToInputIndex = new Map();

  for (const extInput of extInputs) {
    if (!sourceToInputIndex.has(extInput.sourceId)) {
      sourceToInputIndex.set(
        extInput.sourceId,
        sourceToInputIndex.size
      );
    }
  }

  // ----------------------------------------------------------
  // Map internal IDs -> internal nodes
  // ----------------------------------------------------------

  const internalNodeMap = new Map();

  for (const node of refGraph) {
    internalNodeMap.set(node.id, node);
  }

  // ----------------------------------------------------------
  // Connect external inputs into internal graph
  // ----------------------------------------------------------

  for (const extInput of extInputs) {

    const internalNode =
      internalNodeMap.get(extInput.id);

    if (!internalNode) {
      continue;
    }

    const customInputIndex =
      sourceToInputIndex.get(extInput.sourceId);

    if (customInputIndex === undefined) {
      continue;
    }

    const externalConnection =
      customNode.inputs?.[customInputIndex];

    if (!externalConnection) {
      continue;
    }

    const externalSource =
      outerNodeMap.get(externalConnection.id);

    if (!externalSource) {
      continue;
    }

    const signal =
      externalSource.value?.[
        externalConnection.index
      ] ?? false;

    // --------------------------------------------------------
    // Nested CUSTOM component
    // --------------------------------------------------------

    if (internalNode.type === "CUSTOM") {

      /*
       * A nested CUSTOM component resolves its .inputs[i]
       * through its own graph lookup.
       *
       * Therefore, instead of "__CUSTOM_INPUT__", provide
       * a real EXT_SIGNAL node inside the nested graph.
       */

      const carrierId =
        `__ext_${extInput.id}_${extInput.index}__`;

      let carrier =
        internalNodeMap.get(carrierId);

      if (!carrier) {

        carrier = {
          type: "EXT_SIGNAL",
          id: carrierId,
          value: [signal],
          inputs: []
        };

        refGraph.push(carrier);
        internalNodeMap.set(carrierId, carrier);

      } else {

        carrier.value = [signal];

      }

      if (internalNode.inputs) {
        internalNode.inputs[extInput.index] = {
          id: carrierId,
          index: 0
        };
      }

    } else {

      // ------------------------------------------------------
      // Normal internal node
      // ------------------------------------------------------

      if (internalNode.inputs) {
        internalNode.inputs[extInput.index] = {
          id: "__CUSTOM_INPUT__",
          index: 0,
          value: signal
        };
      }
    }
  }


  // ----------------------------------------------------------
  // Fixed-point iteration
  // ----------------------------------------------------------

  let internalChanged = true;

  for (
    let i = 0;
    i < CONSTANTS.MAX_EVALUATION_ITERATIONS;
    i++
  ) {

    internalChanged = evaluate(refGraph);

    // Circuit has reached a fixed point.
    if (!internalChanged) {
      break;
    }
  }


  // ----------------------------------------------------------
  // Resolve custom outputs
  // ----------------------------------------------------------

  const oldValue = customNode.value ?? [];

  const nextValue = extOutputs.map(output => {

    const internalNode =
      internalNodeMap.get(output.id);

    if (!internalNode) {
      return false;
    }

    return (
      internalNode.value?.[output.index] ??
      false
    );
  });

  const outputChanged =
    !valuesEqual(oldValue, nextValue);

  customNode.value = nextValue;

  return outputChanged;
}