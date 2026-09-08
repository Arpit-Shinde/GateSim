import { useState, useEffect, useRef } from "react";
import { evaluate } from "./utils/evaluate"
import { topologicalOrderAndReindex } from "./utils/topologicalSort"
import { Gate } from "./components/gate"
import { Wire, LiveWire } from "./components/wire"
import { showTutorial } from "./components/tutorial_modal";
import * as CONSTANTS from "./constants/constants";
import { getWireEnd, getWireStart } from "./utils/wireHelpers";
import { GateCard } from "./components/gatecard";
import { getSVGPoint } from "./utils/svgHelpers";
import { useCircuit } from "./hooks/useCircuit";
import { AboutModal } from "./components/about_modal";
import { inputGateRenderList, logicGateRenderList, outputGateRenderList } from "./constants/gates";


function App() {

  let [graph, setGraph] = useState([])
  let [clock_delays, setClockDelays] = useState([])
  let [view, setView] = useState({
    x: 0,
    y: 0,
    width: 1080,
    height: 720
  })
  let [pan, setPan] = useState(null)
  let svgRef = useRef(null)
  let graphRef = useRef(graph)
  let clockDelaysRef = useRef(clock_delays)
  let [opin, setoPin] = useState(null)
  let [selectedWire, setSelectedWire] = useState(null);
  let [selectedGate, setSelectedGate] = useState(null)
  let [draginfo, setdraginfo] = useState(null);
  let [didDrag, setDidDrag] = useState(false);
  let [mouse, setMouse] = useState(null)
  let [pauseSim, setPauseSim] = useState(false)
  let [pausedClocks, setPausedClocks] = useState([]); //to store remaining time for clock tick after pause
  let { toggle, Add, Connect, clearGraph } = useCircuit(
    graph,
    setGraph,
    clock_delays,
    setClockDelays,
    view,
    addToUndoStack,
    setoPin,
    setSelectedGate,
    setSelectedWire
  );

  useEffect(() => {
    graphRef.current = graph;
  }, [graph]);

  useEffect(() => {
    clockDelaysRef.current = clock_delays;
  }, [clock_delays]);


  function startDrag(e, id) {
    if (e.button === 1) return;
    addToUndoStack(graph, clock_delays)
    const point = getSVGPoint(e, svgRef, view);

    setdraginfo({
      gateId: id,
      offsetX: point.x - graph[id].x,
      offsetY: point.y - graph[id].y
    });

    setDidDrag(false);
  }
function togglePauseSim() {
  const newPauseState = !pauseSim;
  
  if (newPauseState === true) {
    // ✅ PAUSING: Store remaining time for each clock
    const now = performance.now();
    const remainingTimes = clock_delays.map(clock => ({
      id: clock.id,
      remaining: Math.max(0, clock.next_delay - now),
      delay: clock.delay
    }));
    setPausedClocks(remainingTimes);
    
  } else {
    // ✅ RESUMING: Restore clock delays with remaining time
    const now = performance.now();
    setClockDelays(prev => 
      prev.map(clock => {
        const paused = pausedClocks.find(p => p.id === clock.id);
        if (paused) {
          // Resume with remaining time
          return {
            ...clock,
            next_delay: now + paused.remaining
          };
        }
        return {
          ...clock,
          next_delay: now + clock.delay
        };
      })
    );
  }
  
  setPauseSim(newPauseState);
}
  function zoom(e) {
    e.preventDefault();

    if (e.ctrlKey) return

    const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;

    const rect = svgRef.current.getBoundingClientRect();

    // Mouse position in SVG/world coordinates
    const mouseX =
      view.x + ((e.clientX - rect.left) / rect.width) * view.width;

    const mouseY =
      view.y + ((e.clientY - rect.top) / rect.height) * view.height;

    setView(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomFactor,
      y: mouseY - (mouseY - prev.y) * zoomFactor,
      width: prev.width * zoomFactor,
      height: prev.height * zoomFactor
    }));
  }

  useEffect(() => { //for deletion
    function handleKey(e) {
      if (e.key !== "Delete") return;

      addToUndoStack(graph, clock_delays)

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

    if (pauseSim) return
    const intervalId = setInterval(() => {
      let now = performance.now()

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
  }, [pauseSim]);


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

  function selectWire(wire) {
    setSelectedWire(wire)
    setSelectedGate(null) //when selected wire, clear selected gate 
  }

  function drag(e) {

    if (pan) {
      const rect = svgRef.current.getBoundingClientRect();

      const dx = (e.clientX - pan.startX) / rect.width * view.width;
      const dy = (e.clientY - pan.startY) / rect.height * view.height;

      setView(prev => ({
        ...prev,
        x: pan.viewX - dx,
        y: pan.viewY - dy
      }));
    }
    else if (draginfo) {

      setDidDrag(true);

      const point = getSVGPoint(e, svgRef, view);

      const newGraph = structuredClone(graph);

      newGraph[draginfo.gateId].x =
        point.x - draginfo.offsetX;

      newGraph[draginfo.gateId].y =
        point.y - draginfo.offsetY;

      setGraph(newGraph);
    }

    else if (opin) {
      const point = getSVGPoint(e, svgRef, view);

      setMouse({
        x: point.x,
        y: point.y
      });
    }


  }

  function cancelWire(e) {
    if (e.button === 2 && opin) {
      e.preventDefault();
      setoPin(null);
      setMouse(null);
    }
  }

  function stopDrag() {
    setdraginfo(null);
    setPan(null);
  }

  function startPan(e) {
    if (e.button !== 1) return;

    e.preventDefault();

    setPan({
      startX: e.clientX,
      startY: e.clientY,
      viewX: view.x,
      viewY: view.y
    });
  }

  let [undoStack, setUndoStack] = useState([])
  let [redoStack, setRedoStack] = useState([])

  // ─── ADD TO UNDO ───
  function addToUndoStack(graph, delays) {
    let newUndoStack = [...undoStack];
    newUndoStack.push({
      graph: structuredClone(graph),
      clock_delays: delays.map(clock => ({
        id: clock.id,
        delay: clock.delay
      }))
    });
    setUndoStack(newUndoStack);
    setRedoStack([]);
  }

  // ─── UNDO ───
  function undo() {
    if (undoStack.length === 0) return;

    let newUndoStack = [...undoStack];
    let state = newUndoStack.pop();

    // Save current to redo
    let newRedoStack = [...redoStack];
    newRedoStack.push({
      graph: structuredClone(graph),
      clock_delays: clock_delays.map(c => ({ id: c.id, delay: c.delay }))
    });

    // Restore graph
    let restoredGraph = state.graph;

    // Rebuild clock delays with fresh next_delay
    const now = performance.now();
    let restoredDelays = state.clock_delays.map(clock => ({
      id: clock.id,
      delay: clock.delay,
      next_delay: now + clock.delay
    }));
    setSelectedGate(null);
    setSelectedWire(null);
    setGraph(restoredGraph);
    setClockDelays(restoredDelays);
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
  }

  // ─── REDO ───
  function redo() {
    if (redoStack.length === 0) return;

    let newRedoStack = [...redoStack];
    let state = newRedoStack.pop();

    // Save current to undo
    let newUndoStack = [...undoStack];
    newUndoStack.push({
      graph: structuredClone(graph),
      clock_delays: clock_delays.map(c => ({ id: c.id, delay: c.delay }))
    });

    // Restore graph
    let restoredGraph = state.graph;

    // Rebuild clock delays with fresh next_delay
    const now = performance.now();
    let restoredDelays = state.clock_delays.map(clock => ({
      id: clock.id,
      delay: clock.delay,
      next_delay: now + clock.delay
    }));
    setSelectedGate(null);
    setSelectedWire(null);
    setGraph(restoredGraph);
    setClockDelays(restoredDelays);
    setRedoStack(newRedoStack);
    setUndoStack(newUndoStack);
  }

  function downloadCircuit() {
    const data = {
      graph: graph,
      clock_delays: clock_delays.map(c => ({
        id: c.id,
        delay: c.delay
      }))
    };

    // ✅ Ask user for file name
    const fileName = window.prompt("Enter file name:", "circuit.json");

    // If user clicks Cancel or leaves empty, use default
    if (fileName === null) return;

    const finalName = fileName.trim() || "circuit.json";

    // Ensure .json extension
    const fullName = finalName.endsWith(".json") ? finalName : finalName + ".json";

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fullName;
    a.click();
    URL.revokeObjectURL(url);
  }

  const fileInputRef = useRef(null);

  function loadCircuit(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        let loadedGraph;
        let loadedDelays = [];

        // ✅ Handle both old and new formats
        if (Array.isArray(data)) {
          // Old format: just the graph array
          loadedGraph = data;
        } else if (data.graph && Array.isArray(data.graph)) {
          // New format: { graph, clock_delays }
          loadedGraph = data.graph;
          loadedDelays = data.clock_delays || [];
        } else {
          throw new Error("Invalid circuit file format");
        }

        // ✅ Reindex the loaded graph
        let [newGraph, newClockDelays] = topologicalOrderAndReindex(loadedGraph);

        // ✅ Rebuild clock delays with fresh next_delay
        const now = performance.now();
        const restoredDelays = newClockDelays.map(clock => {
          // Find the clock's new ID after reindexing
          const newId = newGraph.find(g => g.id === clock.id)?.id;
          return {
            id: newId !== undefined ? newId : clock.id,
            delay: clock.delay,
            next_delay: now + clock.delay // ✅ Fresh!
          };
        });



        // ✅ Evaluate the circuit
        for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
          evaluate(newGraph);
        }

        // ✅ Clear undo/redo on load
        setUndoStack([]);
        setRedoStack([]);

        setGraph(newGraph);
        setClockDelays(restoredDelays);

        console.log("✅ Circuit loaded successfully!");

      } catch (error) {
        console.error("Load error:", error);
        alert("Invalid circuit file. Please check the file format.");
      }
    };

    reader.readAsText(file);
    e.target.value = "";
  }

  function resetView() {
    setView({ x: 0, y: 0, width: 1500, height: 1200 })

  }

  const [showAbout, setShowAbout] = useState(false);

  function showabout() {
    setShowAbout(true);
  }

  function closeAbout() {
    setShowAbout(false);
  }

  return (
    <div className="homepage">
      <div className="utilites">
        <button onClick={showTutorial} >
          TUTORIAL
        </button>
        <button onClick={downloadCircuit}>
          DOWNLOAD CIRCUIT
        </button>
        <button onClick={() => fileInputRef.current.click()}>
          LOAD CIRCUIT
        </button>
        <button onClick={() => { resetView() }}>RESET VIEW</button>
        <button onClick={() => { clearGraph() }}>CLEAR CIRCUIT</button>
        <button onClick={() => undo()} style={{ fontSize: '20px' }}>↶</button>
        <button onClick={() => redo()} style={{ fontSize: '20px' }}>↷</button>
        <button onClick={togglePauseSim}>
  {pauseSim ? '▶ START CLOCKS' : '⏸ PAUSE CLOCKS'}
</button>
        <button onClick={showabout} style={{

        }}>
          ABOUT
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={loadCircuit}
        />
      </div>
      <div className="tools-and-canvas">
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
          {/* <div><button onClick={() => { sortgraph(graph) }}>sort</button></div> */}

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
          {/* <div>
            <button onClick={() => {
              console.log(JSON.stringify(graph, null, 2));
              console.log(JSON.stringify(clock_delays, null, 2));
            }}>
              print
            </button>
          </div> */}

        </div>
        <div className="canvas-wrapper">
        <div className="canvas">
          <svg
            width="100%"
            height="100%"
            ref={svgRef}
            viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
            style={{
              backgroundColor: CONSTANTS.CANVAS_BACKGROUND,
              border: '2px solid #4a5568',
              boxSizing: 'border-box'
            }}
            onMouseDown={startPan}
            onMouseMove={drag}
            onMouseUp={stopDrag}
            onWheel={zoom}
            onContextMenu={cancelWire}
          >

            {graph.map(node =>
              node.inputs.map((input, index) => {
                if (input === -1) return
                let start = getWireStart(graph, input)
                let end = getWireEnd(node, index)

                // console.log(`Wire key=${node.id} - ${index}`)
                return (<Wire
                  key={`${node.id}-${index}`}
                  start={[
                    start.x,
                    start.y
                  ]}
                  end={[
                    end.x,
                    end.y
                  ]}
                  from={input}
                  to={node.id}
                  style={{ pointerEvents: "stroke" }}
                  inputIndex={index}
                  onClick={selectWire}
                  isSelected={
                    selectedWire?.from === input &&
                    selectedWire?.to === node.id &&
                    selectedWire?.inputIndex === index
                  }
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
                isSelected={selectedGate?.id === node.id}
              />)
            })}

          </svg>
        </div>
        </div>
      </div>
      {showAbout && <AboutModal onClose={closeAbout} />}

    </div>
  )
}

export default App; 