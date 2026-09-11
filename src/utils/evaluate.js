export function evaluate(graph) {

    for (const node of graph) {
        if (node.type === "INPUT" || node.type === "CLOCK") {
            continue;
        }

        const values = node.inputs.map(input => {
            if (!input || input.index === -1) return false;
            return graph[input.id].value[input.index];
        });

        const a = values[0] ?? false;
        const b = values[1] ?? false;
        const c = values[2] ?? false;
        const d = values[3] ?? false;
        const e = values[4] ?? false;
        const f = values[5] ?? false;

        switch (node.type) {
            case "WIRE": node.value = [a]; break;
            case "AND": node.value = [a && b]; break;
            case "OR": node.value = [a || b]; break;
            case "NOT": node.value = [!a]; break;
            case "XOR": node.value = [a !== b]; break;
            case "NAND": node.value = [!(a && b)]; break;
            case "NOR": node.value = [!(a || b)]; break;
            case "XNOR": node.value = [a === b]; break;
            case "BULB": node.value = [a]; break;
            case "NAND3": node.value = [!(a && b && c)]; break;
            case "AND3": node.value = [a && b && c]; break;
            case "OR3": node.value = [a || b || c]; break;
            case "NOR3": node.value = [!(a || b || c)]; break;
            case "XOR3": node.value = [(a !== b) !== c]; break;  // XOR of 3 inputs
            case "XNOR3": node.value = [(a === b) === c]; break; // XNOR of 3 inputs
            case "AND4": node.value = [a && b && c && d]; break;
            case "OR4": node.value = [a || b || c || d]; break;
            case "NAND4": node.value = [!(a && b && c && d)]; break;
            case "NOR4": node.value = [!(a || b || c || d)]; break;
            case "XOR4": node.value = [(a !== b) !== (c !== d)]; break; // XOR of 4 inputs (parity)
            case "XNOR4": node.value = [((a === b) === c) === d]; break; // XNOR of 4 inputs
            case "MUX2": node.value = [c ? b : a]; break;  // a = D0, b = D1, c = S
            case "MUX4": node.value = [f ? (e ? d : c) : (e ? b : a)]; break;
            case "HALF_ADDER":
                node.value = [
                    a !== b,        // S  = A XOR B
                    a && b          // C  = A AND B
                ];
                break;

            case "FULL_ADDER":
                node.value = [
                    (a !== b) !== c,                          // S    = A XOR B XOR Cin
                    (a && b) || (c && (a !== b))              // Cout = (A AND B) OR (Cin AND (A XOR B))
                ];
                break;

            case "JK": {

                const j = a;
                const clk = b;
                const k = c;

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

                node.value[1] = !node.value[0];

                break;
            }
        }
    }
}
