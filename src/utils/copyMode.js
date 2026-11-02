// utils/copyMode.js

export function pointInsideRect(point, rect, padding = 0) {
  const minX = Math.min(rect.x0, rect.x1) - padding;
  const maxX = Math.max(rect.x0, rect.x1) + padding;
  const minY = Math.min(rect.y0, rect.y1) - padding;
  const maxY = Math.max(rect.y0, rect.y1) + padding;

  return (
    point.x >= minX &&
    point.x <= maxX &&
    point.y >= minY &&
    point.y <= maxY
  );
}

export function wireInsideRect(wire, rect) {
  if (!wire.path || wire.path.length === 0) {
    return false;
  }

  // Small padding makes it easier to capture wires that touch
  // the boundary of the selection.
  return wire.path.every(point =>
    pointInsideRect(point, rect, 10)
  );
}

export function finalizeCopySelection({
  rect,
  graph,
  clock_delays,
  isNodeFullyContained,
  setCopiedGraph,
  setCopiedClockDelays,
  setCopySelectMode,
  setSelectionRect
}) {
  const selectedNodes = graph.filter(node => {
    // Ignore text labels when copying a circuit.
    if (node.type === "TEXT") {
      return false;
    }

    // Wires are handled separately.
    if (node.type === "WIRE") {
      return false;
    }

    return isNodeFullyContained(node, rect);
  });

  const selectedIds = new Set(
    selectedNodes.map(node => node.id)
  );

  const selectedWires = graph.filter(node => {
    if (node.type !== "WIRE") {
      return false;
    }

    return wireInsideRect(node, rect);
  });

  const copiedIds = new Set([
    ...selectedNodes.map(node => node.id),
    ...selectedWires.map(node => node.id)
  ]);

  if (copiedIds.size === 0) {
    alert("Nothing selected.");
    return;
  }

  const selection = graph
    .filter(node => copiedIds.has(node.id))
    .map(node => structuredClone(node));

  // Keep only connections that remain inside the copied graph.
  // External connections become disconnected when pasted.
  for (const node of selection) {
    if (Array.isArray(node.inputs)) {
      node.inputs = node.inputs.map(input => {
        if (!input || input.index === -1) {
          return input;
        }

        if (!copiedIds.has(input.id)) {
          return { id: -1, index: -1 };
        }

        return { ...input };
      });
    }

    if (Array.isArray(node.outputs)) {
      node.outputs = node.outputs.filter(outputId =>
        copiedIds.has(outputId)
      );
    }
  }

  // Copy clock information.
  const selectedClockIds = new Set(
    selection
      .filter(node => node.type === "CLOCK")
      .map(node => node.id)
  );

  const selectedDelays = clock_delays
    .filter(clock => selectedClockIds.has(clock.id))
    .map(clock => ({
      id: clock.id,
      delay: clock.delay
    }));

  setCopiedGraph(selection);
  setCopiedClockDelays(selectedDelays);

  setCopySelectMode(false);
  setSelectionRect(null);

  console.log("Copied circuit:", selection);
}

export function pasteCopiedCircuit({
  copiedGraph,
  mousePosition,
  graph,
  clock_delays,
  CONSTANTS,
  compactAndReindex,
  evaluate,
  remapTimingSignals,
  setGraph,
  setClockDelays,
  graphRef,
  clockDelaysRef
}) {
  if (!copiedGraph || copiedGraph.length === 0) {
    alert("Nothing has been copied.");
    return;
  }

  const mouse = mousePosition;

  // Clone clipboard graph.
  const pastedGraph = structuredClone(copiedGraph);

  // Give every pasted node a temporary unique ID.
  let nextTempId = -1;
  for (const node of graph) {
    if (typeof node.id === "number" && node.id >= nextTempId) {
      nextTempId = node.id + 1;
    }
  }

  const idMap = new Map();
  for (const node of pastedGraph) {
    const oldId = node.id;
    const newId = nextTempId++;
    idMap.set(oldId, newId);
  }

  // Remap IDs inside copied graph.
  for (const node of pastedGraph) {
    const oldId = node.id;
    node.id = idMap.get(oldId);

    // Inputs
    if (Array.isArray(node.inputs)) {
      node.inputs = node.inputs.map(input => {
        if (!input || input.index === -1) {
          return input;
        }

        const remappedId = idMap.get(input.id);

        if (remappedId === undefined) {
          return { id: -1, index: -1 };
        }

        return { ...input, id: remappedId };
      });
    }

    // Outputs
    if (Array.isArray(node.outputs)) {
      node.outputs = node.outputs
        .map(outputId => idMap.get(outputId))
        .filter(outputId => outputId !== undefined);
    }
  }

  // Find bounds of copied circuit.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of pastedGraph) {
    if (node.type === "WIRE") {
      for (const point of node.path ?? []) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      }
      continue;
    }

    if (typeof node.x !== "number" || typeof node.y !== "number") {
      continue;
    }

    let width = CONSTANTS.GATE_WIDTH;
    let height = CONSTANTS.GATE_HEIGHT;

    if (node.type === "INPUT" || node.type === "CLOCK") {
      width = 40;
      height = 40;
    }

    if (node.type === "BULB") {
      width = 30;
      height = 30;
    }

    if (node.rotation !== undefined && node.rotation % 180 !== 0) {
      [width, height] = [height, width];
    }

    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + width);
    maxY = Math.max(maxY, node.y + height);
  }

  // Nothing has positional information.
  if (
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxX) ||
    !Number.isFinite(maxY)
  ) {
    return;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const dx = mouse.x - centerX;
  const dy = mouse.y - centerY;

  // Move copied circuit to cursor.
  for (const node of pastedGraph) {
    if (node.type === "WIRE") {
      if (Array.isArray(node.path)) {
        node.path = node.path.map(point => ({
          x: point.x + dx,
          y: point.y + dy
        }));
      }
      continue;
    }

    if (typeof node.x === "number" && typeof node.y === "number") {
      node.x += dx;
      node.y += dy;
    }
  }

  // Combine original + pasted graph.
  const combinedGraph = [...structuredClone(graph), ...pastedGraph];

  const [newGraph, finalIdMap] = compactAndReindex(combinedGraph);

  // Timing signals need the new IDs as well.
  remapTimingSignals(finalIdMap);

  clock_delays = newGraph.filter((node)=>node.type==="CLOCK").map((node)=>{
    return {id: node.id, delay: node.delay, next_tick: performance.now() + node.delay}
  })
  console.log(clock_delays)

  // Update refs immediately.
  if (graphRef) graphRef.current = newGraph;
  if (clockDelaysRef) clockDelaysRef.current = clock_delays;

  setGraph(newGraph);
  setClockDelays(structuredClone(clock_delays));

  // Evaluate pasted circuit.
  for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
    const changed = evaluate(newGraph);
    if (!changed) {
      break;
    }
  }

  console.log("Pasted circuit at:", mouse);
}