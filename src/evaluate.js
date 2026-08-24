function evaluate(graph) {
    // 1. Removed structuredClone. We MUST mutate the graph in place.
    for (const node of graph) {
        if (node.type === "INPUT" || node.type === "CLOCK") {
            continue;
        }

        // 2. Read directly from the live graph, not an old copy.
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
        }
    }
}

export default evaluate;