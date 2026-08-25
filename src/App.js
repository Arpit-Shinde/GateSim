import { useState, useEffect, useRef } from "react";
import { evaluate, topologicalOrderAndReindex } from "./evaluate"
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

  let [graph, setGraph] = useState([
  
])
  let [clock_delays, setClockDelays] = useState([
])
  const graphRef = useRef(graph);
  const clockDelaysRef = useRef(clock_delays);

  useEffect(() => {
    graphRef.current = graph;
  }, [graph]);

  useEffect(() => {
    clockDelaysRef.current = clock_delays;
  }, [clock_delays]);


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

      const newGraph = structuredClone(graph);
      if (selectedWire) {

        newGraph[selectedWire.to].inputs[selectedWire.inputIndex] = -1;
        for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) evaluate(newGraph);
        setGraph(newGraph);
        setSelectedWire(null); // Clear the selected wire
      }

      else if (selectedGate) {

        const idToDelete = selectedGate.id;

        // Find the index of the gate to delete
        let deleteIndex = -1;
        for (let i = 0; i < newGraph.length; i++) {
          if (newGraph[i].id === idToDelete) {
            deleteIndex = i;
            break;
          }
        }

        if (deleteIndex === -1) return;

        newGraph.splice(deleteIndex, 1);

        // Clear selectedWire if it was connected to the deleted gate
        if (selectedWire) {
          // Check if the wire is from or to the deleted gate
          if (selectedWire.from === idToDelete || selectedWire.to === idToDelete) {
            setSelectedWire(null);
          } else {
            // If the wire's IDs need to be updated
            const updatedWire = { ...selectedWire };
            if (updatedWire.from > idToDelete) updatedWire.from -= 1;
            if (updatedWire.to > idToDelete) updatedWire.to -= 1;
            setSelectedWire(updatedWire);
          }
        }

        // Update IDs and fix connections for all remaining gates
        for (let i = 0; i < newGraph.length; i++) {
          const node = newGraph[i];

          // Update ID
          if (node.id > idToDelete) {
            node.id -= 1;
          }

          // Update inputs - handle all positions properly
          for (let j = 0; j < node.inputs.length; j++) {
            const input = node.inputs[j];

            if (input === idToDelete) {
              // This input was connected to the deleted gate
              node.inputs[j] = -1;
            } else if (input > idToDelete) {
              // This input referenced a gate with higher ID, shift it down
              node.inputs[j] = input - 1;
            }
            // If input < idToDelete, it stays the same
          }
        }



      }
      let [newGraph2, new_clock_delays] = topologicalOrderAndReindex(newGraph)

      // Evaluate the circuit
      for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) evaluate(newGraph2);

      setGraph(newGraph2)
      setClockDelays(new_clock_delays)
      // Clear selected gate
      setSelectedGate(null);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedWire, selectedGate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = performance.now();

      const graph = graphRef.current;
      const clocks = clockDelaysRef.current;

      let changed = false;
      const newGraph = structuredClone(graph);

      const newClockDelays = clocks.map(clock => {
        if (now >= clock.next_delay) {
          newGraph[clock.id].value =
            !newGraph[clock.id].value;

          changed = true;

          return {
            ...clock,
            next_delay: clock.next_delay + clock.delay
          };
        }

        return clock;
      });

      if (changed) {
        for (
          let i = 0;
          i < CONSTANTS.MAX_EVALUATION_ITERATIONS;
          i++
        ) {
          evaluate(newGraph);
        }

        graphRef.current = newGraph;
        clockDelaysRef.current = newClockDelays;

        setGraph(newGraph);
        setClockDelays(newClockDelays);
      }
    }, CONSTANTS.MIN_FRAME_TIME);

    return () => clearInterval(intervalId);
  }, []);

  function toggle(id) {
    let newGraph = structuredClone(graph);

    newGraph[id].value = !newGraph[id].value;



    for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
      evaluate(newGraph);
    }

    setGraph(newGraph);

  }

  function Add(gate) {
    if (!gate) return
    let newGate;

    if (gate === "CLOCK") {
      let input = window.prompt(`Clock Delay (minimum:${CONSTANTS.MIN_FRAME_TIME})`)
      if (input === null) return
      let delay = Number(input)
      if (delay<50){
        alert(`Delay entered less than ${CONSTANTS.MIN_FRAME_TIME}`);
        return;
      }
      newGate = { type: gate, id: graph.length, value: false, inputs: [], x: 30 + graph.length * 10, y: 30 + graph.length * 10, delay: delay };
      let newdelay = { id: graph.length, delay: delay, next_delay: performance.now() + delay }
      setClockDelays((prev) => [...prev, newdelay])

    }
    else newGate = { type: gate, id: graph.length, value: false, inputs: [], x: 30 + graph.length * 10, y: 30 + graph.length * 10 };


    let [newGraph, new_clock_delays] = topologicalOrderAndReindex([...graph, newGate])
    for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
      evaluate(newGraph);
    }
    setGraph(newGraph);
    setClockDelays(new_clock_delays)
    console.log(graph)
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

    for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) evaluate(newgraph)



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

  function sortgraph(graph) {
    let [newGraph, new_clock_delays] = topologicalOrderAndReindex(graph)
    setGraph(newGraph)
    setClockDelays(new_clock_delays)
  }
  




  return (
    <div>
      <div className="toolsBar">
        <div className="inputSection">
          {
            inputGateRenderList.map(
              (object) => {
                return (
                  <div
                    key={object.type}
                    onClick={() => Add(object.type)}
                  >
                    <GateCard
                      renderFxn={object.render}
                      gateType={object.type}
                    />
                  </div>)
              }
            )
          }
        </div>
        <div><button onClick={() => { Add("CLOCK") }}>clock</button></div>
        <div><button onClick={() => { Add("NAND3") }}>nand3</button></div>
        <div><button onClick={() => { sortgraph(graph) }}>sort</button></div>
        <div>
          <button onClick={() => {
            console.log(JSON.stringify(graph, null, 2));
            console.log(JSON.stringify(clock_delays, null, 2));
          }}>
            print
          </button>
        </div>
        <div className="outputSection">
          {
            outputGateRenderList.map(
              (object) => {
                return (
                  <div
                    key={object.type}
                    onClick={() => Add(object.type)}
                  >
                    <GateCard
                      renderFxn={object.render}
                      gateType={object.type}
                    />
                  </div>)
              }
            )
          }
        </div>
        <div className="gatesSection">
          {
            logicGateRenderList.map(
              (object) => {
                return (
                  <div
                    key={object.type}
                    onClick={() => Add(object.type)}
                  >
                    <GateCard
                      renderFxn={object.render}
                      gateType={object.type}
                    />
                  </div>)
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
              if (input === -1) return
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
              if (node.type === "NAND3" && index === 2) {
                endy = node.y + CONSTANTS.GATE_HEIGHT / 2
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

          {graph.map((node) => {
            return (<Gate
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
            />)
          })}

        </svg>
      </div>
    </div>
  )
}

export default App; 