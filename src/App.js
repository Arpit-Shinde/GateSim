import { useState, useEffect } from "react";

const GATE_WIDTH = 70
const GATE_HEIGHT = 40


function evaluate(id, graph) {

  let node = graph[id]

  if (node.type === "INPUT") {
    return node.value
  }

  let values = node.inputs.map((id) => {
    return evaluate(id, graph)
  })

  switch (node.type) {
    case "AND":
      node.value = values[0] && values[1]
      return node.value;

    case "OR":
      return values[0] || values[1];

    case "NOT":
      return !values[0];

    case "XOR":
      return values[0] !== values[1]

    case "NAND":
      return !(values[0] && values[1]);

    case "NOR":
      return !(values[0] || values[1]);

    case "XNOR":
      return values[0] === values[1];

    case "BULB":
      return values[0]

    default:
      throw new Error(`Unknown gate: ${node.type}`);
  }

}



function App() {

  let [graph, setGraph] = useState(
    []
  )

  let [opin, setoPin] = useState(null)

  const [selectedWire, setSelectedWire] = useState(null);

  const [dragging, setDragging] = useState(null);
  const [didDrag, setDidDrag] = useState(false);

  function startDrag(e, id) {
  setDragging({
    gateId: id,
    offsetX: e.clientX - graph[id].x,
    offsetY: e.clientY - graph[id].y
  });

  setDidDrag(false);
}

  useEffect(() => {
    function handleKey(e) {
      if (e.key !== "Delete") return;
      if (!selectedWire) return;

      const newGraph = structuredClone(graph);

      newGraph[selectedWire.to].inputs.splice(selectedWire.inputIndex, 1);

      setGraph(newGraph);
      setSelectedWire(null);
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [graph, selectedWire]);

  function toggle(id) {
    const newgraph = structuredClone(graph);
    newgraph[id].value = !graph[id].value
    setGraph(newgraph)
  }

  function Add(gate) {


    let newGate;

    
      newGate = { type: gate, id: graph.length, value: false, inputs: [], x: 30 + graph.length*10, y: 30+graph.length*10};
  
      
    

    if (!gate) return


    // Append using functional state update (cleaner than manual cloning outside)
    setGraph((prev) => [...prev, newGate]);


  }

  function setoutputpin(id) {
    setoPin({ gateId: id });
  }

  function setinputpin(id, index) {
    let newipin = { gateId: id, gateIndex: index }
    Connect(newipin, opin)
  }



  function Connect(inputpin, outputpin) {


    let newgraph = structuredClone(graph)

    if (inputpin != null && outputpin != null) {
      newgraph[inputpin.gateId].inputs[inputpin.gateIndex] = outputpin.gateId;
    }


    setoPin(null);

    setGraph(newgraph)

  }

  function print() {
    console.log(graph)
  }

  function Gate({ node, toggle, graph }) {

    if (node.type === "INPUT") {
      return (
        <g
          transform={`translate(${node.x}, ${node.y})`}

          style={{ cursor: "pointer" }}
        >
          <rect onMouseUp={() => {
    if (!didDrag) toggle(node.id);
}}
            width="70"
            height="40"
            rx="5"
            fill={node.value ? "limegreen" : "gray"}
            stroke="black"
            strokeWidth="2"
            onMouseDown={(e) => startDrag(e, node.id)}
          />

          <text
            x="35"
            y="20"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            pointerEvents="none"
          >
            INPUT
          </text>

          <circle onClick={() => { setoutputpin(node.id) }} cx={GATE_WIDTH} cy={GATE_HEIGHT / 2} r="4" />
        </g>
      );
    }

    else if (node.type === "NOT") {
      return (<g transform={`translate(${node.x}, ${node.y})`}>
        <rect width="70" height="40" rx="5" fill={evaluate(node.id, graph) ? "limegreen" : "gray"} onMouseDown={(e) => startDrag(e, node.id)} />
        <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
        <circle onClick={() => { setinputpin(node.id, 0) }} cx={0} cy={GATE_HEIGHT / 2} r="4" />

        <circle onClick={() => { setoutputpin(node.id) }} cx={GATE_WIDTH} cy={GATE_HEIGHT / 2} r="4" />
      </g>
      )
    }

    else if (node.type === "BULB") {
      return (<g transform={`translate(${node.x}, ${node.y})`}>
        <rect width="70" height="40" rx="5" fill={evaluate(node.id, graph) ? "limegreen" : "gray"} onMouseDown={(e) => startDrag(e, node.id)} />
        <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
        <circle onClick={() => { setinputpin(node.id, 0) }} cx={0} cy={GATE_HEIGHT / 2} r="4" />


      </g>
      )
    }

    else {

      return (
        <g transform={`translate(${node.x}, ${node.y})`}>
          <rect width="70" height="40" rx="5" fill={evaluate(node.id, graph) ? "limegreen" : "gray"} onMouseDown={(e) => startDrag(e, node.id)} />
          <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
          <circle onClick={() => { setinputpin(node.id, 0) }} cx={0} cy={GATE_HEIGHT / 4} r="4" />
          <circle onClick={() => { setinputpin(node.id, 1) }} cx={0} cy={3 * GATE_HEIGHT / 4} r="4" />
          <circle onClick={() => { setoutputpin(node.id) }} cx={GATE_WIDTH} cy={GATE_HEIGHT / 2} r="4" />
        </g>
      )


    }
  }

  function selectWire(wire) {
    setSelectedWire(wire)
  }

  function drag(e) {
  if (!dragging) return;

  setDidDrag(true);

  const newGraph = structuredClone(graph);
  newGraph[dragging.gateId].x = e.clientX - dragging.offsetX;
  newGraph[dragging.gateId].y = e.clientY - dragging.offsetY;
  setGraph(newGraph);
}

function stopDrag() {
  setDragging(null);
}





  return (
    <div>
      <div>
        {["INPUT", "AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR", "BULB"].map(gate => (
          <button key={gate} onClick={() => Add(gate)}>
            {gate}
          </button>
        ))}
        <button onClick={print}>print</button>
      </div>
      <div>
        <svg
          width="4000"
          height="3000"
          style={{ border: "1px solid black" }}
          onMouseMove={drag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {graph.map(node =>
            node.inputs.map((input, index) => {
              let endy = node.y + (index * 2 + 1) * GATE_HEIGHT / 4
              if (node.type === "NOT" || node.type === "BULB") {
                endy = node.y + GATE_HEIGHT / 2
              }
              return (<Wire
                key={`${node.id}-${input}`}
                start={[
                  graph[input].x + GATE_WIDTH,
                  graph[input].y + GATE_HEIGHT / 2
                ]}
                end={[
                  node.x,
                  endy
                ]}
                from={input}
                to={node.id}
                style={{ pointerEvents: "stroke" }}
                inputIndex={index}
                onClick={selectWire}
              />)
            })
          )}
          {graph.map(node => (

            <Gate key={node.id} node={node} toggle={toggle} graph={graph} />
          ))}
        </svg>
      </div>



    </div>
  )


}

function Wire({ start, end, from, to, inputIndex, onClick }) {
  const dx = end[0] - start[0];

  const controlOffset = Math.abs(dx) * 0.5;

  const path = `
    M ${start[0]},${start[1]}
    C ${start[0] + controlOffset},${start[1]}
      ${end[0] - controlOffset},${end[1]}
      ${end[0]},${end[1]}
  `;

  return (
    <path
      d={path}
      stroke="black"
      fill="none"
      strokeWidth="3"
      onClick={() => { onClick({ from, to, inputIndex }) }}
      style={{ pointerEvents: "stroke" }}
    />
  );
}



export default App; 