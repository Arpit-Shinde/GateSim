// utils/reindex.js
//
// Restores the invariant graph[id] === node WITHOUT reordering.
// O(n + e). Nodes are shallow-copied (value arrays are replaced, never
// mutated, so sharing them is safe). Existing clocks keep their timers.

export function compactAndReindex(graph, oldClockDelays = []) {
  const n = graph.length;
  const idMap = new Map();

  for (let i = 0; i < n; i++) idMap.set(graph[i].id, i);

  const out = new Array(n);

  for (let i = 0; i < n; i++) {
    const node = graph[i];
    const copy = { ...node, id: i };

    if (node.inputs) {
      copy.inputs = node.inputs.map(input => {
        if (!input) return null;
        const mapped = idMap.get(input.id);
        return mapped === undefined ? null : { id: mapped, index: input.index };
      });
    }

    if (node.outputs) {
      const outs = [];
      for (const o of node.outputs) {
        const mapped = idMap.get(o);
        if (mapped !== undefined) outs.push(mapped);
      }
      copy.outputs = outs;
    }

    out[i] = copy;
  }

  const prev = new Map();
  for (const c of oldClockDelays) prev.set(c.id, c);

  const now = performance.now();
  const clocks = [];

  for (let i = 0; i < n; i++) {
    if (graph[i].type !== "CLOCK") continue;
    const old = prev.get(graph[i].id);
    const delay = graph[i].delay ?? old?.delay;
    clocks.push({
      id: i,
      delay,
      next_delay: old?.next_delay ?? now + delay
    });
  }

  return [out, clocks, idMap];
}