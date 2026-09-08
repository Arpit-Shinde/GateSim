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

            case "JK": {
                const j = a;
                const clk = b;
                const k = c;
                

                // Rising edge detection
                if (!clk && node.lastClock) { // do clk && !node.lastClock for + edge triggered
                    if (j && k) {
                        // Toggle
                        node.value = !node.value;
                    } else if (j && !k) {
                        // Set
                        node.value = true;
                    } else if (!j && k) {
                        // Reset
                        node.value = false;
                    }
                    // else: Hold (no change)
                }

                // Update last clock state for edge detection
                node.lastClock = clk;

                // Store Q' (complement)
                node.notQ = !node.value;
                break;
            }
        }
    }
}
