export function evaluate(graph) {
    
    for (const node of graph) {
        if (node.type === "INPUT" || node.type === "CLOCK") {
            continue;
        }

        const values = node.inputs.map(inputId => {
            if (inputId === -1) return false;
            return graph[inputId].value;
        });

        const a = values[0] ?? false;
        const b = values[1] ?? false;
        const c = values[2] ?? false;

        switch (node.type) {
            case "AND": node.value = a && b; break;
            case "OR": node.value = a || b; break;
            case "NOT": node.value = !a; break;
            case "XOR": node.value = a !== b; break;
            case "NAND": node.value = !(a && b); break;
            case "NOR": node.value = !(a || b); break;
            case "XNOR": node.value = a === b; break;
            case "BULB": node.value = a; break;
            case "NAND3": node.value = !(a && b && c); break;
            case "AND3": node.value = a && b && c; break;
            case "OR3": node.value = a || b || c; break;
            case "NOR3": node.value = !(a || b || c); break;
            case "XOR3": node.value = (a !== b) !== c; break;  // XOR of 3 inputs
            case "XNOR3": node.value = (a === b) === c; break; // XNOR of 3 inputs
                }
    }
}
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

