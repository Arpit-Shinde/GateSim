import { useState } from "react";


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

    const newGate = { type: gate, id: graph.length, value: false, inputs: [] };

    if (!gate) return

    // Append using functional state update (cleaner than manual cloning outside)
    setGraph((prev) => [...prev, newGate]);


  }



  function Connect() {
    const gate = Number(window.prompt("Specify gate id:"));
    let connections = window.prompt("Specify inputs (like 1,3):")

    if (!gate || !connections) return

    connections = connections.split(",")

    let newgraph = structuredClone(graph)
    newgraph[gate].inputs = [Number(connections[0]), Number(connections[1])]

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
      {
        graph.map((node, id) => {
          let state = evaluate(id, graph)

          if (node.type === "INPUT") return <button key={id} className={state ? "on" : "off"} onClick={() => { return toggle(node.id) }}>
            {id}:{graph[id].type}: {Number(state)}
          </button>

          return <button key={id} className={state ? "on" : "off"}>
            {id}:{graph[id].type}: {Number(state)}
          </button>
        }
        )
      }

    </div>
  )


}


export default App;