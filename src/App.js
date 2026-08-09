import { useState, useEffect } from "react";

import {Gate, FancyGate} from "./gate"
import {Wire, LiveWire} from "./wire"
import * as CONSTANTS from "./constants";

function App() {

  let [graph, setGraph] = useState(
    [
]
  )

  let [opin, setoPin] = useState(null)

  const [selectedWire, setSelectedWire] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null)

  const [draginfo, setdraginfo] = useState(null);
  const [didDrag, setDidDrag] = useState(false);
  const [mouse, setMouse] = useState(null)

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
          if (newGraph[i].id===selectedGate.id && !deleted){
            newGraph.splice(i, 1)
            //console.log(`deleted i=${i}`)
            i-=1
            deleted = true
            
            continue
          }

          if (newGraph[i].id>selectedGate.id) {
            //console.log(`decrement i=${i}`)
            newGraph[i].id -= 1
            
          }
          if (newGraph[i].inputs.length===2){ //we check the case for two inputs first because if any input is to be removed, then the length reduces to 1 and the next if are still applicable. if we put next ifs before this length=2, and if inputs length=2 and they change, then inputs length=1. this time, the (length===2) wont be executed. This will cause infinite recursion.
            if (newGraph[i].inputs[1]===selectedGate.id){
              newGraph[i].inputs.splice(1,1)
              //console.log(`removed wire from i=${i}`)
            }
            else if (newGraph[i].inputs[1] > selectedGate.id){ //put else if conditions, cuz we are modifying the inputs array
              //console.log(`decremented wire inside length 2 loop ${newGraph[i].inputs[1]} - ${selectedGate.id}`)
              newGraph[i].inputs[1] -=1
            }
          }
          if (newGraph[i].inputs[0] > selectedGate.id){
            //console.log(`decremented wire inside length 2 loop ${newGraph[i].inputs[1]} - ${selectedGate.id}`)
            newGraph[i].inputs[0] -=1
          }
          else if (newGraph[i].inputs[0]===selectedGate.id){
            newGraph[i].inputs.splice(0,1)
            //console.log(`removed wire ${newGraph[i].inputs[0]} - ${selectedGate.id}`)
          }
          
          
          
          
          
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
    setMouse({
      x : graph[id].x + +CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X,
      y:graph[id].y + + CONSTANTS.INPUT_PIN_Y})
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
    setSelectedGate(null) //when selected wire, clear selected gate 
  }

  function drag(e) {
    if (draginfo){

      setDidDrag(true);

      const newGraph = structuredClone(graph);
      newGraph[draginfo.gateId].x = e.clientX - draginfo.offsetX;
      newGraph[draginfo.gateId].y = e.clientY - draginfo.offsetY;
      setGraph(newGraph);
    }

    else if (opin){
      setMouse({x : e.clientX - CONSTANTS.CANVAS_START.x, y : e.clientY - CONSTANTS.CANVAS_START.y})
    }
  }

  function stopDrag() {
    setdraginfo(null);
  }

  return (
    <div>
      <div>
        {CONSTANTS.GATE_TYPES.map(gate => (
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
          style={{ 
            position: "absolute",
            border: "1px solid black",
            top: CONSTANTS.CANVAS_START.x,
            left: CONSTANTS.CANVAS_START.y,
            backgroundColor:CONSTANTS.CANVAS_BACKGROUND

           }}
          onMouseMove={drag}
          onMouseUp={stopDrag}
          
        >
          
          {graph.map(node =>
            node.inputs.map((input, index) => {
              let startx = graph[input].x +CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X
              let starty = graph[input].y + CONSTANTS.INPUT_PIN_Y
              let endx = node.x + CONSTANTS.INPUT_PIN_X
              let endy
              if(index===0) endy = node.y + CONSTANTS.INPUT_PIN_Y_TOP
              else endy = node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM
              
              if (node.type === "BULB") {
                endx = node.x + CONSTANTS.BULB_PIN_X
                endy = node.y + CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH
              }
              if (node.type === "NOT") {
                
                endy = node.y + CONSTANTS.INPUT_PIN_Y
              }

            

              if (graph[input].type === "INPUT"){
                startx = graph[input].x + CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X
                starty = graph[input].y + CONSTANTS.TOGGLE_HEIGHT/2
              }
              // console.log(`Wire key=${node.id} - ${index}`)
              return (<Wire
                key={`${node.id}-${index}`}
                start={[
                  startx,
                  starty
                ]}
                end={[
                  endx,
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
          

          {opin && 
          <LiveWire 
          start={[
            graph[opin.gateId].x +CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X,
            graph[opin.gateId].y + CONSTANTS.INPUT_PIN_Y
          ]}
          end={[mouse.x, mouse.y]}
          >
          </LiveWire>}
          
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
            setSelectedWire={setSelectedWire}
            />
          ))}
        </svg>
      </div>



    </div>
  )


}





export default App; 