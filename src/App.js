import { useState, useEffect } from "react";

import { Gate } from "./gate"
import { Wire, LiveWire } from "./wire"
import * as CONSTANTS from "./constants";
import * as RENDER_GATES from "./gates_svg"

const inputGateRenderList = [
  { type: 'INPUT', render: RENDER_GATES.RenderINPUT }
];

const logicGateRenderList = [
  { type: 'AND', render: RENDER_GATES.RenderAND },
  { type: 'OR', render: RENDER_GATES.RenderOR },
  { type: 'NOT', render: RENDER_GATES.RenderNOT },
  { type: 'NAND', render: RENDER_GATES.RenderNAND },
  { type: 'NOR', render: RENDER_GATES.RenderNOR },
  { type: 'XOR', render: RENDER_GATES.RenderXOR },
  { type: 'XNOR', render: RENDER_GATES.RenderXNOR },

];

const outputGateRenderList = [
  { type: 'BULB', render: RENDER_GATES.RenderBULB }
];

function GateCard({ renderFxn, gateType }) {
  const RenderFn = renderFxn;
  return (
    <div className="gate-card">
      <div className="gate-preview">
        <svg width="110" height="60" viewBox="0 0 110 60">
          <rect width="110" height="60" fill={CONSTANTS.GATE_CARD_BACKGROUND} rx="8" />
          <g transform="translate(15, 10)">
            <RenderFn />
          </g>
        </svg>
      </div>
      <span className="gate-label">{gateType}</span>
    </div>
  );
}


function App() {

  let [graph, setGraph] = useState(
    [
  // Inputs
  { "type": "INPUT", "id": 0, "value": false, "inputs": [], "x": 50, "y": 100 },   // A (LSB)
  { "type": "INPUT", "id": 1, "value": false, "inputs": [], "x": 50, "y": 200 },   // B
  { "type": "INPUT", "id": 2, "value": false, "inputs": [], "x": 50, "y": 300 },   // C (MSB)

  // NOT gates
  { "type": "NOT", "id": 3, "value": false, "inputs": [0], "x": 180, "y": 100 },   // ~A
  { "type": "NOT", "id": 4, "value": false, "inputs": [1], "x": 180, "y": 200 },   // ~B
  { "type": "NOT", "id": 5, "value": false, "inputs": [2], "x": 180, "y": 300 },   // ~C

  // STAGE 1: 2-input AND gates (Evaluating A and B)
  { "type": "AND", "id": 6, "value": false, "inputs": [3, 4], "x": 300, "y": 60 },   // ~A AND ~B
  { "type": "AND", "id": 7, "value": false, "inputs": [0, 4], "x": 300, "y": 120 },  //  A AND ~B
  { "type": "AND", "id": 8, "value": false, "inputs": [3, 1], "x": 300, "y": 180 },  // ~A AND  B
  { "type": "AND", "id": 9, "value": false, "inputs": [0, 1], "x": 300, "y": 240 },  //  A AND  B
  { "type": "AND", "id": 10, "value": false, "inputs": [3, 4], "x": 300, "y": 300 }, // ~A AND ~B
  { "type": "AND", "id": 11, "value": false, "inputs": [0, 4], "x": 300, "y": 360 }, //  A AND ~B
  { "type": "AND", "id": 12, "value": false, "inputs": [3, 1], "x": 300, "y": 420 }, // ~A AND  B
  { "type": "AND", "id": 13, "value": false, "inputs": [0, 1], "x": 300, "y": 480 }, //  A AND  B

  // STAGE 2: 2-input AND gates (Evaluating previous stage with C)
  { "type": "AND", "id": 14, "value": false, "inputs": [6, 5], "x": 450, "y": 60 },   // Y0 = (~A~B) AND ~C (000)
  { "type": "AND", "id": 15, "value": false, "inputs": [7, 5], "x": 450, "y": 120 },  // Y1 = ( A~B) AND ~C (001)
  { "type": "AND", "id": 16, "value": false, "inputs": [8, 5], "x": 450, "y": 180 },  // Y2 = (~AB)  AND ~C (010)
  { "type": "AND", "id": 17, "value": false, "inputs": [9, 5], "x": 450, "y": 240 },  // Y3 = ( AB)  AND ~C (011)
  { "type": "AND", "id": 18, "value": false, "inputs": [10, 2], "x": 450, "y": 300 }, // Y4 = (~A~B) AND C  (100)
  { "type": "AND", "id": 19, "value": false, "inputs": [11, 2], "x": 450, "y": 360 }, // Y5 = ( A~B) AND C  (101)
  { "type": "AND", "id": 20, "value": false, "inputs": [12, 2], "x": 450, "y": 420 }, // Y6 = (~AB)  AND C  (110)
  { "type": "AND", "id": 21, "value": false, "inputs": [13, 2], "x": 450, "y": 480 }, // Y7 = ( AB)  AND C  (111)

  // Bulbs
  { "type": "BULB", "id": 22, "value": false, "inputs": [14], "x": 600, "y": 60 },
  { "type": "BULB", "id": 23, "value": false, "inputs": [15], "x": 600, "y": 120 },
  { "type": "BULB", "id": 24, "value": false, "inputs": [16], "x": 600, "y": 180 },
  { "type": "BULB", "id": 25, "value": false, "inputs": [17], "x": 600, "y": 240 },
  { "type": "BULB", "id": 26, "value": false, "inputs": [18], "x": 600, "y": 300 },
  { "type": "BULB", "id": 27, "value": false, "inputs": [19], "x": 600, "y": 360 },
  { "type": "BULB", "id": 28, "value": false, "inputs": [20], "x": 600, "y": 420 },
  { "type": "BULB", "id": 29, "value": false, "inputs": [21], "x": 600, "y": 480 }
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

      if (selectedWire) {
        const newGraph = structuredClone(graph);

        newGraph[selectedWire.to].inputs.splice(selectedWire.inputIndex, 1);

        setGraph(newGraph);
        setSelectedWire(null);
      }

      else if (selectedGate) {
        const newGraph = structuredClone(graph)
        let deleted = false


        for (let i = 0; i < newGraph.length; i++) {
          // console.log(`i=${i}`)
          if (newGraph[i].id === selectedGate.id && !deleted) {
            newGraph.splice(i, 1)
            //console.log(`deleted i=${i}`)
            i -= 1
            deleted = true

            continue
          }

          if (newGraph[i].id > selectedGate.id) {
            //console.log(`decrement i=${i}`)
            newGraph[i].id -= 1

          }
          if (newGraph[i].inputs.length === 2) { //we check the case for two inputs first because if any input is to be removed, then the length reduces to 1 and the next if are still applicable. if we put next ifs before this length=2, and if inputs length=2 and they change, then inputs length=1. this time, the (length===2) wont be executed. This will cause infinite recursion.
            if (newGraph[i].inputs[1] === selectedGate.id) {
              newGraph[i].inputs.splice(1, 1)
              //console.log(`removed wire from i=${i}`)
            }
            else if (newGraph[i].inputs[1] > selectedGate.id) { //put else if conditions, cuz we are modifying the inputs array
              //console.log(`decremented wire inside length 2 loop ${newGraph[i].inputs[1]} - ${selectedGate.id}`)
              newGraph[i].inputs[1] -= 1
            }
          }
          if (newGraph[i].inputs[0] > selectedGate.id) {
            //console.log(`decremented wire inside length 2 loop ${newGraph[i].inputs[1]} - ${selectedGate.id}`)
            newGraph[i].inputs[0] -= 1
          }
          else if (newGraph[i].inputs[0] === selectedGate.id) {
            newGraph[i].inputs.splice(0, 1)
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

    setGraph((prev) => [...prev, newGate]);
  }

  function setoutputpin(id) {
    setoPin({ gateId: id });
    setMouse({
      x: graph[id].x + +CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X,
      y: graph[id].y + + CONSTANTS.INPUT_PIN_Y
    })
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

  function selectWire(wire) {
    setSelectedWire(wire)
    setSelectedGate(null) //when selected wire, clear selected gate 
  }

  function drag(e) {
    if (draginfo) {

      setDidDrag(true);

      const newGraph = structuredClone(graph);
      newGraph[draginfo.gateId].x = e.clientX - draginfo.offsetX;
      newGraph[draginfo.gateId].y = e.clientY - draginfo.offsetY;
      setGraph(newGraph);
    }

    else if (opin) {
      setMouse({ x: e.clientX - CONSTANTS.CANVAS_START.x, y: e.clientY - CONSTANTS.CANVAS_START.y })
    }
  }

  function stopDrag() {
    setdraginfo(null);
  }

  return (
    <div>
      <div className="toolsBar">
        <div className="inputSection">
          {
            inputGateRenderList.map(
              (object) => {
                return (
                  <g onClick={() => Add(object.type)}><GateCard renderFxn={object.render} gateType={object.type}></GateCard></g>
                )
              }
            )
          }
        </div>
        <div className="outputSection">
          {
            outputGateRenderList.map(
              (object) => {
                return (
                  <g onClick={() => Add(object.type)}><GateCard renderFxn={object.render} gateType={object.type}></GateCard></g>
                )
              }
            )
          }
        </div>
        <div className="gatesSection">
          {
            logicGateRenderList.map(
              (object) => {
                return (
                  <g onClick={() => Add(object.type)}><GateCard renderFxn={object.render} gateType={object.type}></GateCard></g>
                )
              }
            )
          }
        </div>

      </div>
      <div>
        <svg
          width="4000"
          height="3000"
          style={{
            position: "absolute",
            
            top: CONSTANTS.CANVAS_START.y,
            left: CONSTANTS.CANVAS_START.x,
            backgroundColor: CONSTANTS.CANVAS_BACKGROUND
          }}
          onMouseMove={drag}
          onMouseUp={stopDrag}
        >

          {graph.map(node =>
            node.inputs.map((input, index) => {
              let startx = graph[input].x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X
              let starty = graph[input].y + CONSTANTS.INPUT_PIN_Y
              let endx = node.x + CONSTANTS.INPUT_PIN_X
              let endy
              if (index === 0) endy = node.y + CONSTANTS.INPUT_PIN_Y_TOP
              else endy = node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM

              if (node.type === "BULB") {
                endx = node.x + CONSTANTS.BULB_PIN_X
                endy = node.y + CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH
              }
              if (node.type === "NOT") {

                endy = node.y + CONSTANTS.INPUT_PIN_Y
              }



              if (graph[input].type === "INPUT") {
                startx = graph[input].x + CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X
                starty = graph[input].y + CONSTANTS.TOGGLE_HEIGHT / 2
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

          {opin && (() => {
            if (graph[opin.gateId].type === "INPUT") {
              return (
                <LiveWire
                  start={[
                    graph[opin.gateId].x + CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X,
                    graph[opin.gateId].y + CONSTANTS.TOGGLE_HEIGHT / 2
                  ]}
                  end={[mouse.x, mouse.y]}
                  color={CONSTANTS.WIRE_COLOR}
                  strokeWidth={CONSTANTS.WIRE_STROKE_WIDTH}
                />
              );
            }
            else {
              return (
                <LiveWire
                  start={[
                    graph[opin.gateId].x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X,
                    graph[opin.gateId].y + CONSTANTS.INPUT_PIN_Y
                  ]}
                  end={[mouse.x, mouse.y]}
                  color={CONSTANTS.WIRE_COLOR}
                  strokeWidth={CONSTANTS.WIRE_STROKE_WIDTH}
                />
              );
            }
          })()}

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