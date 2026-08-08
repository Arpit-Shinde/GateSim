import { useState, useEffect } from "react";

import Gate from "./gate"
import Wire from "./wire"
import { GATE_WIDTH, GATE_HEIGHT, GATE_TYPES } from "./constants";

function App() {

  let [graph, setGraph] = useState(
    [
  {
    type: "INPUT",
    id: 0,
    value: false,
    inputs: [],
    x: 30,
    y: 30
  },
  {
    type: "INPUT",
    id: 1,
    value: false,
    inputs: [],
    x: 30,
    y: 110
  },
  {
    type: "AND",
    id: 2,
    value: false,
    inputs: [3, 3],
    x: 296,
    y: 75
  },
  {
    type: "AND",
    id: 3,
    value: false,
    inputs: [0, 1],
    x: 180,
    y: 72
  },
  {
    type: "AND",
    id: 4,
    value: false,
    inputs: [2, 2],
    x: 421,
    y: 73
  }
]
  )

  let [opin, setoPin] = useState(null)

  const [selectedWire, setSelectedWire] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null)

  const [draginfo, setdraginfo] = useState(null);
  const [didDrag, setDidDrag] = useState(false);

  function startDrag(e, id) {
    setdraginfo({
      gateId: id,
      offsetX: e.clientX - graph[id].x,
      offsetY: e.clientY - graph[id].y
    });

    setDidDrag(false);
  }

  useEffect(() => { //for deletion
    function handleKey(e) {
      if (e.key !== "Delete") return;
      

      if (selectedWire){
        const newGraph = structuredClone(graph);

        newGraph[selectedWire.to].inputs.splice(selectedWire.inputIndex, 1);

        setGraph(newGraph);
        setSelectedWire(null);
      }

      else if (selectedGate){
        const newGraph = structuredClone(graph)
        let deleted = false
        

        for (let i=0;i<newGraph.length;i++){
          // console.log(`i=${i}`)
          if (i===selectedGate.id && !deleted){
            newGraph.splice(i, 1)
            // console.log(`deleted i=${i}`)
            i-=1
            deleted = true
            
            continue
          }

          if (newGraph[i].id>selectedGate.id) newGraph[i].id -= 1
          if (newGraph[i].inputs.length===2){ //we check the case for two inputs first because if any input is to be removed, then the length reduces to 1 and the next if are still applicable. if we put next ifs before this length=2, and if inputs length=2 and they change, then inputs length=1. this time, the (length===2) wont be executed. This will cause infinite recursion.
            if (newGraph[i].inputs[1]===selectedGate.id) newGraph[i].inputs.splice(1,1)
            if (newGraph[i].inputs[1] > selectedGate.id) newGraph[i].inputs[1] -=1
          }
          if (newGraph[i].inputs[0] > selectedGate.id) newGraph[i].inputs[0] -=1
          if (newGraph[i].inputs[0]===selectedGate.id) newGraph[i].inputs.splice(0,1)
          
          
          
          
          
        }

        setGraph(newGraph);
        // console.log(newGraph)
        setSelectedGate(null)
      }

      
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedWire, selectedGate, graph]);

  function toggle(id) {
    const newgraph = structuredClone(graph);
    newgraph[id].value = !graph[id].value
    setGraph(newgraph)
  }

  function Add(gate) {


    let newGate;


    newGate = { type: gate, id: graph.length, value: false, inputs: [], x: 30 + graph.length * 10, y: 30 + graph.length * 10 };




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
    console.log(selectedGate)
  }



  function selectWire(wire) {
    setSelectedWire(wire)
  }

  function drag(e) {
    if (!draginfo) return;

    setDidDrag(true);

    const newGraph = structuredClone(graph);
    newGraph[draginfo.gateId].x = e.clientX - draginfo.offsetX;
    newGraph[draginfo.gateId].y = e.clientY - draginfo.offsetY;
    setGraph(newGraph);
  }

  function stopDrag() {
    setdraginfo(null);
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

            <Gate 
            key={node.id} 
            node={node} 
            toggle={toggle} 
            graph={graph} 
            didDrag={didDrag} 
            startDrag={startDrag} 
            setoutputpin={setoutputpin} 
            setinputpin={setinputpin} 
            setSelectedGate={setSelectedGate}
            />
          ))}
        </svg>
      </div>



    </div>
  )


}





export default App; 