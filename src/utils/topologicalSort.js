export function topologicalOrderAndReindex(graph) {

    let remaining = graph.map(node => ({
        ...node,
        inputs: node.inputs.map(input =>
            input === null
                ? null
                : { ...input }
        )
    })); //creates a copy of graph, ... operator copies the top level prop, but if a prop is array, it copies reference instead of creating a copy. so we explicitly overwrite the inputs to create a new copy and not reference. else changing inputs in this "remaining" will make changes in graph as well, which we dont want

    const newGraph = []; //to store the newly ordered and re-indexed graph
    const idMap = new Map(); //to store relation between old ids and new ids. (its like a array of elements of kind oldId->newId)

    // 1. Add source nodes
    for (let i = remaining.length - 1; i >= 0; i--) {

        const node = remaining[i];

        if (node.type === "INPUT" || node.type === "CLOCK") {

            const oldId = node.id;
            const newId = newGraph.length;

            idMap.set(oldId, newId);

            node.id = newId;
            newGraph.push(node);

            remaining.splice(i, 1);
        }
    }

    // 2. Topological ordering. we loop through the remaining, and check if node's parent is present in new Graph. if yes, remove from remaining and push to new Graph.
    let progress = true;

    while (remaining.length > 0 && progress) {

        progress = false;

        for (let i = 0; i < remaining.length; i++) {

            const node = remaining[i];

            const allInputsReady = node.inputs.every(input =>
                input === null || idMap.has(input.id)
            );

            if (allInputsReady) {

                const oldId = node.id;
                const newId = newGraph.length;

                idMap.set(oldId, newId);

                node.id = newId;
                newGraph.push(node);

                remaining.splice(i, 1);

                progress = true;
                break;
            }
        }
    }

    // 3. Add cyclic nodes
    for (const node of remaining) {

        const oldId = node.id;
        const newId = newGraph.length;

        idMap.set(oldId, newId);

        node.id = newId;
        newGraph.push(node);
    }

    // 4. Remap input IDs
    for (const node of newGraph) {

        node.inputs = node.inputs.map(input => {

            // Disconnected input
            if (input === null) {
                return null;
            }

            // Valid connection
            if (idMap.has(input.id)) {
                return {
                    id: idMap.get(input.id),
                    index: input.index
                };
            }

            // Invalid / stale connection
            return null;
        });
    }

    // 5. Rebuild clock delays
    const new_clock_delays = [];

    for (const node of newGraph) {

        if (node.type === "CLOCK") {

            new_clock_delays.push({
                id: node.id,
                delay: node.delay,
                next_delay: performance.now() + node.delay
            });
        }
    }

    return [
        newGraph,
        new_clock_delays,
        idMap
    ];
}