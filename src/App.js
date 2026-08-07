import { useState, useEffect } from "react";

import Gate from "./gate"
import Wire from "./wire"
import { GATE_WIDTH, GATE_HEIGHT, GATE_TYPES } from "./constants";

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
        {GATE_TYPES.map(gate => (
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

            <Gate key={node.id} node={node} toggle={toggle} graph={graph} didDrag = {didDrag} startDrag = {startDrag} setoutputpin = {setoutputpin} setinputpin = {setinputpin} />
          ))}
        </svg>
      </div>



    </div>
  )


}





export default App; 