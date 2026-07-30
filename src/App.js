import { useState } from "react";

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

    default:
      throw new Error(`Unknown gate: ${node.type}`);
  }

}



function App() {

  let [graph, setGraph] = useState(
    []
  )

  function toggle(id) {
    const newgraph = structuredClone(graph);
    newgraph[id].value = !graph[id].value
    setGraph(newgraph)
  }

  function Add() {
    const gate = window
      .prompt("Enter gate type:")
      ?.trim()
      .toUpperCase();

    let newGate;

    if (gate === "INPUT") {
      newGate = { type: gate, id: graph.length, value: false, inputs: [], x: 30, y: 30 + graph.length * 100 };
    }

    else {
      newGate = { type: gate, id: graph.length, value: false, inputs: [], x: 30 + graph.length * 100, y: 30 };
    }

    if (!gate) return


    // Append using functional state update (cleaner than manual cloning outside)
    setGraph((prev) => [...prev, newGate]);


  }



  function Connect() {
    const gate = Number(window.prompt("Specify gate id:"));
    let connections = window.prompt("Specify inputs (like 1,3):")

    if (Number.isNaN(gate) || !connections) return

    connections = connections.split(",")

    let newgraph = structuredClone(graph)
    if (connections.length === 1) {
      newgraph[gate].inputs = [Number(connections[0])]
    }
    else {
      newgraph[gate].inputs = [Number(connections[0]), Number(connections[1])]
    }

    setGraph(newgraph)

  }

  function print() {
    console.log(graph)
  }





  return (
    <div>

      <button onClick={Add}>ADD</button>
      <button onClick={print}>print</button>
      <button onClick={Connect}>connect</button>
      <svg
        width="1000"
        height="700"
        style={{ border: "1px solid black" }}
      >
        {graph.map(node =>
          node.inputs.map(input => (
            <Wire
              key={`${node.id}-${input}`}
              start={[
                graph[input].x + GATE_WIDTH,
                graph[input].y + GATE_HEIGHT / 2
              ]}
              end={[
                node.x,
                node.y + GATE_HEIGHT / 2
              ]}
            />
          ))
        )}
        {graph.map(node => (

          <Gate key={node.id} node={node} toggle={toggle} graph={graph} />
        ))}
      </svg>




    </div>
  )


}

function Wire({ start, end }) {
  return (
    <line x1={start[0]} x2={end[0]} y1={start[1]} y2={end[1]} stroke="black" strokeWidth="2" ></line>
  )
}

function Gate({ node, toggle, graph }) {

  if (node.type === "INPUT") {
    return (
      <g
        transform={`translate(${node.x}, ${node.y})`}
        onClick={() => toggle(node.id)}
        style={{ cursor: "pointer" }}
      >
        <rect
          width="70"
          height="40"
          rx="5"
          fill={node.value ? "limegreen" : "gray"}
          stroke="black"
          strokeWidth="2"
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
      </g>
    );
  }

  else {
    
      return (
        <g transform={`translate(${node.x}, ${node.y})`}>
          <rect width="70" height="40" rx="5" fill={evaluate(node.id, graph) ? "limegreen" : "gray"} />
          <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
        </g>

      )
    

  }
}

export default App; 