//just for testing functions

function topologicalOrderAndReindex(graph) {
    // Clone graph so the original graph is never mutated
    let remaining = graph.map(node => ({
        ...node,
        inputs: [...node.inputs]
    }));

    const newGraph = [];
    const idMap = new Map();

    // --------------------------------------------------
    // 1. Add source nodes
    // --------------------------------------------------

    for (let i = remaining.length - 1; i >= 0; i--) {
        const node = remaining[i];

        if (node.inputs.length === 0) {
            const oldId = node.id;
            const newId = newGraph.length;

            idMap.set(oldId, newId);

            node.id = newId;
            newGraph.push(node);

            remaining.splice(i, 1);
        }
    }

    // --------------------------------------------------
    // 2. Topological ordering
    // --------------------------------------------------

    let progress = true;

    while (remaining.length > 0 && progress) {
        progress = false;

        for (let i = 0; i < remaining.length; i++) {
            const node = remaining[i];

            // -1 means an unconnected input, so it is
            // NOT a dependency.
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

    // --------------------------------------------------
    // 3. Remaining nodes are part of cycles
    // --------------------------------------------------
    //
    // They cannot be topologically ordered.
    // Preserve them, but assign new IDs.
    //

    for (const node of remaining) {
        const oldId = node.id;
        const newId = newGraph.length;

        idMap.set(oldId, newId);

        node.id = newId;
        newGraph.push(node);
    }

    // --------------------------------------------------
    // 4. Remap every input reference
    // --------------------------------------------------

    for (const node of newGraph) {
        node.inputs = node.inputs.map(inputId => {
            if (inputId === -1) {
                return -1;
            }

            return idMap.get(inputId);
        });
    }

    return newGraph;
}



let oldgraph = [
  {
    "type": "INPUT",
    "id": 0,
    "value": true,
    "inputs": [],
    "x": 121,
    "y": 82
  },
  {
    "type": "INPUT",
    "id": 1,
    "value": true,
    "inputs": [],
    "x": 133,
    "y": 364
  },
  {
    "type": "NAND3",
    "id": 2,
    "value": false,
    "inputs": [
      9,
      13,
      1
    ],
    "x": 346,
    "y": 349
  },
  {
    "type": "NAND3",
    "id": 3,
    "value": false,
    "inputs": [
      13,
      8,
      0
    ],
    "x": 354,
    "y": 78
  },
  {
    "type": "NAND",
    "id": 4,
    "value": true,
    "inputs": [
      5,
      2
    ],
    "x": 612,
    "y": 309
  },
  {
    "type": "NAND",
    "id": 5,
    "value": true,
    "inputs": [
      3,
      4
    ],
    "x": 614,
    "y": 91
  },
  {
    "type": "NAND",
    "id": 6,
    "value": false,
    "inputs": [
      12,
      4
    ],
    "x": 894,
    "y": 305
  },
  {
    "type": "NAND",
    "id": 7,
    "value": false,
    "inputs": [
      5,
      12
    ],
    "x": 880,
    "y": 99
  },
  {
    "type": "NAND",
    "id": 8,
    "value": true,
    "inputs": [
      9,
      6
    ],
    "x": 1141,
    "y": 292
  },
  {
    "type": "NAND",
    "id": 9,
    "value": true,
    "inputs": [
      7,
      8
    ],
    "x": 1135,
    "y": 115
  },
  {
    "type": "BULB",
    "id": 10,
    "value": true,
    "inputs": [
      8
    ],
    "x": 1375,
    "y": 282
  },
  {
    "type": "BULB",
    "id": 11,
    "value": true,
    "inputs": [
      9
    ],
    "x": 1354,
    "y": 93
  },
  {
    "type": "NOT",
    "id": 12,
    "value": true,
    "inputs": [
      13
    ],
    "x": 566,
    "y": 532
  },
  {
    "type": "CLOCK",
    "id": 13,
    "value": false,
    "inputs": [],
    "x": 98,
    "y": 212,
    "delay": 1000
  }
]

let newgraph = topologicalOrderAndReindex(oldgraph)

console.log(newgraph)
