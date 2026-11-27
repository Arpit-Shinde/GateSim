// Restores the invariant graph[id] === node WITHOUT reordering.

export function compactAndReindex(graph) {

  const n = graph.length;

  const idMap = new Map(); //map of old id->new id

  for (let i = 0; i < n; i++) idMap.set(graph[i].id, i);

  const newGraph = new Array(n);

  for (let i = 0; i < n; i++) {
    const node = graph[i];
    const copy = { ...node, id: i };

    //fix inputs
    if (node.inputs){
      copy.inputs = node.inputs.map((input)=>{
        if (!input) return null;
        const mappedId = idMap.get(input.id);
        return mappedId === undefined ? null : {id: mappedId, index: input.index}
      })
    }

    //fix outputs
    if (node.outputs) {
      const outs = [];
      for (const o of node.outputs) {
        const mapped = idMap.get(o);
        if (mapped !== undefined) outs.push(mapped);
      }
      copy.outputs = outs;
    }

    newGraph[i] = copy;
  }

  return [newGraph, idMap];
}