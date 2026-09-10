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
import logo from './gatesim-logo2.png';
import { RenderUncommitedWire } from "./components/wire";


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
  let [theme, setTheme] = useState(false)
  let [pauseSim, setPauseSim] = useState(false)
  let [showClockWindow, setShowClockWindow] = useState(false);
  let [clockDelayInput, setClockDelayInput] = useState("");
  let [pausedClocks, setPausedClocks] = useState([]); //to store remaining time for clock tick after pause
  let [wirePath, setWirePath] = useState([]); //to store bending points of wire which is being drawn 
  let { toggle, Add, Connect, clearGraph } = useCircuit(
    graph,
    setGraph,
    clock_delays,
    setClockDelays,
    view,
    addToUndoStack,
    setoPin,
    setSelectedGate,
    setSelectedWire,
    setShowClockWindow,
    setClockDelayInput
  );

  let [openTool, setOpenTool] = useState(null);

  function ToolSection({ name, list }) {
    const isOpen = openTool === name;

    return (
      <div className="toolSection">

        <button
          className="toolButton"
          onClick={() =>
            setOpenTool(isOpen ? null : name)
          }
        >
          <span>{name}</span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="toolGateCards">
            {list.map((object) => (
              <div
                key={object.type}
                onClick={() => Add(object.type)}
              >
                <GateCard
                  renderFxn={object.render}
                  gateType={object.type}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

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

  function confirmClock() {
    if (clockDelayInput.trim() === "") return;

    const delay = Number(clockDelayInput);

    if (!Number.isFinite(delay)) {
      alert("Enter a valid number");
      return;
    }

    if (delay < CONSTANTS.MIN_FRAME_TIME) {
      alert(`Delay entered less than ${CONSTANTS.MIN_FRAME_TIME}`);
      return;
    }

    setShowClockWindow(false);
    setClockDelayInput("");

    Add("CLOCK", null, null, delay);
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key !== "Delete") return;

      addToUndoStack(graph, clock_delays);

      const newGraph = structuredClone(graph);

      if (selectedGate !== null) {

        const idToDelete = selectedGate.id;

        const deleteIndex = newGraph.findIndex(
          node => node.id === idToDelete
        );

        if (deleteIndex === -1) {
          setSelectedGate(null);
          return;
        }

        const nodeToDelete = newGraph[deleteIndex];

        // =====================================================
        // DELETE WIRE
        // =====================================================
        if (nodeToDelete.type === "WIRE") {

          const idsToDelete = new Set([idToDelete]);

          let changed = true;

          // Find all downstream child wires recursively
          while (changed) {
            changed = false;

            for (const node of newGraph) {

              if (node.type !== "WIRE") continue;

              // Child wire gets its signal from
              // a wire that is already being deleted
              if (
                node.inputs &&
                node.inputs.length > 0 &&
                idsToDelete.has(node.inputs[0])
              ) {
                if (!idsToDelete.has(node.id)) {
                  idsToDelete.add(node.id);
                  changed = true;
                }
              }
            }
          }

          // Disconnect everything referencing
          // any wire that is being deleted
          for (const node of newGraph) {

            if (!node.inputs) continue;

            node.inputs = node.inputs.map(input =>
              idsToDelete.has(input) ? -1 : input
            );
          }

          // Delete all collected wires
          for (let i = newGraph.length - 1; i >= 0; i--) {

            if (idsToDelete.has(newGraph[i].id)) {
              newGraph.splice(i, 1);
            }
          }
        }

        // =====================================================
        // DELETE GATE / COMPONENT
        // =====================================================
        else {

          const idsToDelete = new Set([idToDelete]);

          let changed = true;

          // -------------------------------------------------
          // Collect connected wires
          // -------------------------------------------------
          while (changed) {

            changed = false;

            for (const node of newGraph) {

              if (node.type !== "WIRE") continue;

              // -----------------------------------------
              // Child wire
              // -----------------------------------------
              if (
                node.inputs &&
                node.inputs.length > 0 &&
                idsToDelete.has(node.inputs[0])
              ) {
                if (!idsToDelete.has(node.id)) {

                  idsToDelete.add(node.id);
                  changed = true;
                }
              }

              // -----------------------------------------
              // Parent wire
              //
              // Gate contains the wire ID in its inputs
              // -----------------------------------------
              if (
                nodeToDelete.inputs &&
                nodeToDelete.inputs.includes(node.id)
              ) {
                if (!idsToDelete.has(node.id)) {

                  idsToDelete.add(node.id);
                  changed = true;
                }
              }
            }
          }

          // -------------------------------------------------
          // Disconnect references to deleted nodes
          // -------------------------------------------------
          for (const node of newGraph) {

            if (!node.inputs) continue;

            node.inputs = node.inputs.map(input =>
              idsToDelete.has(input) ? -1 : input
            );
          }

          // -------------------------------------------------
          // Delete gate + all collected wires
          // -------------------------------------------------
          for (let i = newGraph.length - 1; i >= 0; i--) {

            if (idsToDelete.has(newGraph[i].id)) {
              newGraph.splice(i, 1);
            }
          }
        }

        setSelectedGate(null);
      }

      // =========================================================
      // REORDER + REINDEX
      // =========================================================
      let [newGraph2, new_clock_delays] =
        topologicalOrderAndReindex(newGraph);

      // =========================================================
      // RE-EVALUATE
      // =========================================================
      for (
        let i = 0;
        i < CONSTANTS.MAX_EVALUATION_ITERATIONS;
        i++
      ) {
        evaluate(newGraph2);
      }

      // =========================================================
      // UPDATE STATE
      // =========================================================
      setGraph(newGraph2);
      setClockDelays(new_clock_delays);
      setSelectedGate(null);
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };

  }, [selectedGate, graph, clock_delays]);

  useEffect(() => {  //for clocks

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


  function setoutputpin(id, pinX, pinY) {
    setoPin({
      gateId: id,
      pinX: pinX,
      pinY: pinY
    });
    setMouse({
      x: pinX,
      y: pinY
    });
    setWirePath([

      { x: pinX, y: pinY }
    ]);

  }

  function setinputpin(id, index, endx, endy) {
    if (opin === null) return
    console.log(`setinputpin fired. currently, startx=${opin.pinX}, endx=${endx}`)
    Add(
      "WIRE",
      {
        path: [...wirePath, { x: endx, y: endy }],
        inputId: opin.gateId
      },
      {
        gateId: id,
        gateIndex: index
      }
    );

    setoPin(null)


  }

  function selectWire(e, id) {
    if (e.button === 0) {
      setSelectedGate({ id: id });
    }
    else if (e.button === 1) {
      //branching logic
      const point = getSVGPoint(e, svgRef, view);

      setoPin({
        gateId: id,
        pinX: point.x,
        pinY: point.y
      });
      setMouse({
        x: point.x,
        y: point.y
      });
      setWirePath([{ x: point.x, y: point.y }]);

      console.log("added point to live wire");


    }

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

  function stopDrag(e) {
    if (e.button === 0 && opin) { // live wire + left click = add bend

      let point = getSVGPoint(e, svgRef, view);

      setWirePath(prev => [
        ...prev,
        { x: point.x, y: point.y }
      ]);

      console.log("added point to live wire");
      setoPin(prev => ({
        ...prev,
        pinX: point.x,
        pinY: point.y
      }));
    }
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

  CONSTANTS.toggleTheme(document, theme)



  return (
    <div className="homepage">
      <div className="utilites">
        <img
          src={logo}
          alt="GateSim Logo"
          width={55}
          height={75}
          className="logo"
          style={{ marginRight: '8px' }}
          onClick={showabout}
        />
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
        <button onClick={() => {
          setTheme(!theme)
          CONSTANTS.toggleTheme(document, theme)
        }}>TOGGLE THEME</button>
        <button onClick={() => {
          console.log(graph)
          console.log(opin)
        }}>print</button>
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

          <ToolSection
            name="Input"
            list={inputGateRenderList}
          />

          <ToolSection
            name="Gates"
            list={logicGateRenderList}
          />

          <ToolSection
            name="Output"
            list={outputGateRenderList}
          />

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



              {opin && (() => {

                return (
                  <LiveWire
                    start={[
                      opin.pinX,
                      opin.pinY
                    ]}
                    end={[mouse.x, mouse.y]}
                    color={CONSTANTS.WIRE_COLOR}
                    strokeWidth={CONSTANTS.WIRE_STROKE_WIDTH}
                  />

                );
              })()}

              {opin && (() => {

                return (
                  <RenderUncommitedWire path={wirePath}></RenderUncommitedWire>

                );
              })()}


              {/* ─── LAYER 1: WIRES (rendered first, behind gates) ─── */}
              {graph
                .filter(node => node.type === "WIRE")
                .map((node) => (
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
                    isSelected={selectedGate?.id === node.id}
                    path={node.path}
                    selectWire={selectWire}
                  />
                ))}

              {/* ─── LAYER 2: GATES (rendered second, on top of wires) ─── */}
              {graph
                .filter(node => node.type !== "WIRE")
                .map((node) => (
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
                    isSelected={selectedGate?.id === node.id}
                  />
                ))}

            </svg>
          </div>
        </div>
      </div>
      {showAbout && <AboutModal onClose={closeAbout} />}

      {showClockWindow && (
        <div className="clock-window-overlay">
          <div className="clock-window">

            <div className="clock-window-title">
              Add Clock
            </div>

            <div className="clock-window-content">

              <label>
                Clock Delay
              </label>

              <div className="clock-input-row">
                <input
                  type="number"
                  min={CONSTANTS.MIN_FRAME_TIME}
                  value={clockDelayInput}
                  autoFocus
                  onChange={(e) =>
                    setClockDelayInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      confirmClock();
                    }

                    if (e.key === "Escape") {
                      setShowClockWindow(false);
                      setClockDelayInput("");
                    }
                  }}
                />

                <span>ms</span>
              </div>

              <div className="clock-minimum">
                Minimum: {CONSTANTS.MIN_FRAME_TIME} ms
              </div>

            </div>

            <div className="clock-window-buttons">

              <button
                onClick={() => {
                  setShowClockWindow(false);
                  setClockDelayInput("");
                }}
              >
                Cancel
              </button>

              <button onClick={confirmClock}>
                Add Clock
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default App; 