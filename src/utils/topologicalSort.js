export function topologicalOrderAndReindex(graph) {

    let remaining = graph.map(node => ({
        ...node,
        inputs: [...node.inputs]
    }));

    const newGraph = [];
    const idMap = new Map();

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

    // 2. Topological ordering
    let progress = true;

    while (remaining.length > 0 && progress) {
        progress = false;

        for (let i = 0; i < remaining.length; i++) {
            const node = remaining[i];

            const allInputsReady = node.inputs.every(inputId =>
                inputId === -1 || idMap.has(inputId)
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

    // 4. Remap inputs
    for (const node of newGraph) {
        node.inputs = node.inputs.map(inputId => {

            // Already disconnected
            if (inputId === -1) {
                return -1;
            }

            // Valid connection
            if (idMap.has(inputId)) {
                return idMap.get(inputId);
            }

            // Invalid/stale connection
            return -1;
        });
    }




    let new_clock_delays = [];

    for (const node of newGraph) {
        if (node.type === "CLOCK") {
            new_clock_delays.push({
                id: node.id,
                delay: node.delay,
                next_delay: performance.now() + node.delay
            });
        }
    }


    return [newGraph, new_clock_delays]
}

