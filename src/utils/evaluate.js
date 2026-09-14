// evaluate.js
import * as CONSTANTS from "../constants/constants";

export function evaluate(graph) {
  for (const node of graph) {

    // These nodes get their values externally.
    if (node.type === "INPUT" || node.type === "CLOCK" || node.type === "EXT_SIGNAL") {
      continue;
    }

    // Custom component
    if (node.type === "CUSTOM") {
      evaluateCustom(node, graph)

      continue;
    }

    const values = node.inputs.map(input => {
      if (!input || input.index === -1) {
        return false;
      }

      // Input coming from a CUSTOM component boundary
      if (input.id === "__CUSTOM_INPUT__") {
        return input.value ?? false;
      }

      const source = graph.find(n => n.id === input.id);

      return source?.value?.[input.index] ?? false;
    });

    const a = values[0] ?? false;
    const b = values[1] ?? false;
    const c = values[2] ?? false;
    const d = values[3] ?? false;
    const e = values[4] ?? false;
    const f = values[5] ?? false;

    switch (node.type) {

      // -------------------------
      // BASIC GATES
      // -------------------------

      case "WIRE":
        node.value = [a];
        break;

      case "AND":
        node.value = [a && b];
        break;

      case "OR":
        node.value = [a || b];
        break;

      case "NOT":
        node.value = [!a];
        break;

      case "XOR":
        node.value = [a !== b];
        break;

      case "NAND":
        node.value = [!(a && b)];
        break;

      case "NOR":
        node.value = [!(a || b)];
        break;

      case "XNOR":
        node.value = [a === b];
        break;


      // -------------------------
      // 3-INPUT GATES
      // -------------------------

      case "AND3":
        node.value = [a && b && c];
        break;

      case "OR3":
        node.value = [a || b || c];
        break;

      case "NAND3":
        node.value = [!(a && b && c)];
        break;

      case "NOR3":
        node.value = [!(a || b || c)];
        break;

      case "XOR3":
        node.value = [(a !== b) !== c];
        break;

      case "XNOR3":
        node.value = [(a === b) === c];
        break;


      // -------------------------
      // 4-INPUT GATES
      // -------------------------

      case "AND4":
        node.value = [a && b && c && d];
        break;

      case "OR4":
        node.value = [a || b || c || d];
        break;

      case "NAND4":
        node.value = [!(a && b && c && d)];
        break;

      case "NOR4":
        node.value = [!(a || b || c || d)];
        break;

      case "XOR4":
        node.value = [
          (a !== b) !== (c !== d)
        ];
        break;

      case "XNOR4":
        node.value = [
          ((a === b) === c) === d
        ];
        break;


      // -------------------------
      // MUX
      // -------------------------

      case "MUX2":
        node.value = [c ? b : a];
        break;

      case "MUX4":
        node.value = [
          f
            ? (e ? d : c)
            : (e ? b : a)
        ];
        break;


      // -------------------------
      // BASIC OUTPUT
      // -------------------------

      case "BULB":
        node.value = [a];
        break;


      // -------------------------
      // ADDERS
      // -------------------------

      case "HALF_ADDER":
        node.value = [
          a !== b,       // Sum
          a && b         // Carry
        ];
        break;

      case "FULL_ADDER":
        node.value = [
          (a !== b) !== c,                 // Sum
          (a && b) || (c && (a !== b))    // Carry
        ];
        break;


      // -------------------------
      // JK FLIP-FLOP
      // -------------------------

      case "JK": {
        const j = a;
        const clk = b;
        const k = c;

        // Rising edge
        if (clk && !node.lastClock) {

          if (j && k) {
            node.value[0] = !node.value[0];
          }
          else if (j && !k) {
            node.value[0] = true;
          }
          else if (!j && k) {
            node.value[0] = false;
          }
        }

        node.lastClock = clk;

        // Qbar
        node.value[1] = !node.value[0];

        break;
      }
    }
  }
}


// ============================================================
// CUSTOM COMPONENT
// ============================================================

// evaluate.js

function evaluateCustom(customNode, outerGraph) {

  const sourceToInputIndex = new Map();
  for (const extInput of customNode.ext_inputs) {
    if (!sourceToInputIndex.has(extInput.sourceId)) {
      sourceToInputIndex.set(extInput.sourceId, sourceToInputIndex.size);
    }
  }

  for (const extInput of customNode.ext_inputs) {

    const internalNode = customNode.ref_graph.find(node => node.id === extInput.id);
    if (!internalNode) continue;

    const customInputIndex = sourceToInputIndex.get(extInput.sourceId);
    if (customInputIndex === undefined) continue;

    const externalConnection = customNode.inputs[customInputIndex];
    if (!externalConnection) continue;

    const externalSource = outerGraph.find(node => node.id === externalConnection.id);
    if (!externalSource) continue;

    const signal = externalSource.value?.[externalConnection.index] ?? false;

    if (internalNode.type === "CUSTOM") {
      // A nested CUSTOM resolves its .inputs[i] via its own
      // outerGraph.find(...) lookup — it doesn't understand the
      // "__CUSTOM_INPUT__" placeholder. Give it a real node to find instead.
      const carrierId = `__ext_${extInput.id}_${extInput.index}__`;

      let carrier = customNode.ref_graph.find(n => n.id === carrierId);

      if (!carrier) {
        carrier = { type: "EXT_SIGNAL", id: carrierId, value: [signal], inputs: [] };
        customNode.ref_graph.push(carrier);
      } else {
        carrier.value = [signal];
      }

      internalNode.inputs[extInput.index] = { id: carrierId, index: 0 };

    } else {
      internalNode.inputs[extInput.index] = {
        id: "__CUSTOM_INPUT__",
        index: 0,
        value: signal
      };
    }
  }

  for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
    evaluate(customNode.ref_graph);
  }

  customNode.value = customNode.ext_outputs.map(output => {
    const internalNode = customNode.ref_graph.find(node => node.id === output.id);
    if (!internalNode) return false;
    return internalNode.value?.[output.index] ?? false;
  });
}