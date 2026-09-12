import { useState, useEffect, useRef } from "react";
import { evaluate } from "./utils/evaluate"
import { topologicalOrderAndReindex } from "./utils/topologicalSort"
import { Gate } from "./components/gate"
import { LiveWire } from "./components/wire"
import { showTutorial } from "./components/tutorial_modal";
import * as CONSTANTS from "./constants/constants";
import { GateCard } from "./components/gatecard";
import { getSVGPoint } from "./utils/svgHelpers";
import { useCircuit } from "./hooks/useCircuit";
import { AboutModal } from "./components/about_modal";
import {
  inputGateRenderList, twoInputGateRenderList,
  threeInputGateRenderList, fourInputGateRenderList,
  sequentialGateRenderList,
  MuxGateRenderList, AdderGateRenderList,
  outputGateRenderList
} from "./constants/gates";
import logo from './gatesim-logo2.png';
import { RenderUncommitedWire } from "./components/wire";
import { RenderCUSTOM } from "./svg/gates_svg";
import { LearnSidebar } from "./components/learnSideBar";


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
  let pausedClocksRef = useRef([]);
  let [wirePath, setWirePath] = useState([]); //to store bending points of wire which is being drawn 
  let [tempGraph, setTempGraph] = useState([])
  let [creatingComponent, setCreatingComponent] = useState(false)
  let [showComponentDialog, setShowComponentDialog] = useState(false);
  let [componentGraph, setComponentGraph] = useState([]);
  let [componentInputs, setComponentInputs] = useState([]);
  let [componentOutputs, setComponentOutputs] = useState([]);
  let [componentName, setComponentName] = useState("");
  let [customComponents, setCustomComponents] = useState([]);
  let [specifyingInputs, setSpecifyingInputs] = useState(false);
  let [pinPhase, setPinPhase] = useState("input"); // "input" | "output"
  let [pinIndex, setPinIndex] = useState(0);
  let [inputOrder, setInputOrder] = useState([]);
  let [showComponentIO, setShowComponentIO] = useState(false);
  let componentIdMapRef = useRef(new Map());
  let [showLearnSidebar, setShowLearnSidebar] = useState(false);


  let { toggle, Add, clearGraph } = useCircuit(
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


  useEffect(() => {
    graphRef.current = graph;
  }, [graph]);

  useEffect(() => {
    clockDelaysRef.current = clock_delays;
  }, [clock_delays]);

  useEffect(() => { //disable ctrl mousewheel zoom
    function preventBrowserZoom(e) {
      if (e.ctrlKey || e.metaKey) {
        if (
          e.key === "+" ||
          e.key === "-" ||
          e.key === "=" ||
          e.key === "0"
        ) {
          e.preventDefault();
        }
      }
    }

    function preventWheelZoom(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", preventBrowserZoom);
    window.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      window.removeEventListener("keydown", preventBrowserZoom);
      window.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

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
    const now = performance.now();

    if (newPauseState) {
      // PAUSING
      const remainingTimes = clockDelaysRef.current.map(clock => ({
        id: clock.id,
        remaining: Math.max(0, clock.next_delay - now),
        delay: clock.delay
      }));

      pausedClocksRef.current = remainingTimes;
      setPausedClocks(remainingTimes);

    } else {
      // RESUMING
      const newClockDelays = clockDelaysRef.current.map(clock => {
        const paused = pausedClocksRef.current.find(
          p => p.id === clock.id
        );

        if (paused) {
          return {
            ...clock,
            next_delay: now + paused.remaining
          };
        }

        return {
          ...clock,
          next_delay: now + clock.delay
        };
      });

      clockDelaysRef.current = newClockDelays;
      setClockDelays(newClockDelays);
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
      if (selectedGate === null) return;

      addToUndoStack(graph, clock_delays);

      const newGraph = structuredClone(graph);

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
            if (!node.inputs || node.inputs.length === 0) continue;

            const input = node.inputs[0];

            if (
              input &&
              input.index !== -1 &&
              idsToDelete.has(input.id)
            ) {
              if (!idsToDelete.has(node.id)) {
                idsToDelete.add(node.id);
                changed = true;
              }
            }
          }
        }

        // Disconnect references to deleted wires
        for (const node of newGraph) {

          if (!node.inputs) continue;

          node.inputs = node.inputs.map(input =>
            input &&
              input.index !== -1 &&
              idsToDelete.has(input.id)
              ? { id: -1, index: -1 }
              : input
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

        // Collect connected wires
        while (changed) {

          changed = false;

          for (const node of newGraph) {

            if (node.type !== "WIRE") continue;

            // -----------------------------------------
            // Child wire: this wire's source is a to-be-deleted node
            // -----------------------------------------
            if (node.inputs && node.inputs.length > 0) {
              const input = node.inputs[0];

              if (
                input &&
                input.index !== -1 &&
                idsToDelete.has(input.id)
              ) {
                if (!idsToDelete.has(node.id)) {
                  idsToDelete.add(node.id);
                  changed = true;
                }
              }
            }

            // -----------------------------------------
            // Parent wire: the to-be-deleted node takes input from this wire
            // -----------------------------------------
            if (
              nodeToDelete.inputs &&
              nodeToDelete.inputs.some(
                input =>
                  input &&
                  input.index !== -1 &&
                  input.id === node.id
              )
            ) {
              if (!idsToDelete.has(node.id)) {
                idsToDelete.add(node.id);
                changed = true;
              }
            }
          }
        }

        // Disconnect references to deleted nodes/wires
        for (const node of newGraph) {

          if (!node.inputs) continue;

          node.inputs = node.inputs.map(input =>
            input &&
              input.index !== -1 &&
              idsToDelete.has(input.id)
              ? { id: -1, index: -1 }
              : input
          );
        }

        // Delete gate + all collected wires
        for (let i = newGraph.length - 1; i >= 0; i--) {
          if (idsToDelete.has(newGraph[i].id)) {
            newGraph.splice(i, 1);
          }
        }
      }

      // =====================================================
      // REORDER + REINDEX
      // =====================================================

      const [newGraph2, new_clock_delays] =
        topologicalOrderAndReindex(newGraph);

      // =====================================================
      // RE-EVALUATE
      // =====================================================

      for (
        let i = 0;
        i < CONSTANTS.MAX_EVALUATION_ITERATIONS;
        i++
      ) {
        evaluate(newGraph2);
      }

      // =====================================================
      // UPDATE STATE
      // =====================================================

      setGraph(newGraph2);
      setClockDelays(new_clock_delays);
      setSelectedGate(null);
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };

  }, [selectedGate, graph, clock_delays]);

  useEffect(() => {

    if (pauseSim) return;

    const intervalId = setInterval(() => {

      const now = performance.now();

      const graph = graphRef.current;
      const clocks = clockDelaysRef.current;

      const newGraph = structuredClone(graph);
      let changed = false;

      const newClockDelays = clocks.map(clock => {

        if (now >= clock.next_delay) {

          const clockNode = newGraph.find(
            node => node.id === clock.id
          );

          if (!clockNode) {
            return clock;
          }

          clockNode.value[0] = !clockNode.value[0];

          changed = true;

          console.log("tick");

          return {
            ...clock,
            next_delay: clock.next_delay + clock.delay
          };
        }

        return clock;
      });

      if (!changed) return;

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

    }, CONSTANTS.MIN_FRAME_TIME);

    return () => clearInterval(intervalId);

  }, [pauseSim]);


  function setoutputpin(id, index, pinX, pinY) {
    setoPin({
      gateId: id,
      outputIndex: index,
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
    console.log(`setinputpin fired. currently, id=${id}, index=${index}`)
    Add(
      "WIRE",
      {
        path: [...wirePath, { x: endx, y: endy }],
        inputId: opin.gateId,
        outputIndex: opin.outputIndex
      },
      {
        gateId: id,
        gateIndex: index

      }
    );

    setoPin(null)


  }

  function selectWire(e, id) {
    if (e.button === 1) {
      setSelectedGate({ id: id });
    }
    else if (e.button === 0) {
      //branching logic
      const point = getSVGPoint(e, svgRef, view);

      setoPin({
        gateId: id,
        outputIndex: 0,
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
      if (wirePath.length >= 2) {
        Add(
          "WIRE",
          {
            path: wirePath,
            inputId: opin.gateId,
            outputIndex: opin.outputIndex
          }
        );
      }


      setoPin(null)

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

  function RotateGate() {
    if (!selectedGate) return;

    const newGraph = structuredClone(graph);

    const node = newGraph.find(
      node => node.id === selectedGate.id
    );

    if (!node || node.type === "WIRE") return;

    const oldRotation = node.rotation ?? 0;
    const newRotation = (oldRotation + 90) % 360;

    const oldWidth = CONSTANTS.GATE_WIDTH;
    const oldHeight = CONSTANTS.GATE_HEIGHT;

    const newWidth =
      newRotation % 180 === 0 ? oldWidth : oldHeight;

    const newHeight =
      newRotation % 180 === 0 ? oldHeight : oldWidth;

    // Keep the center in the same place
    const centerX = node.x + oldWidth / 2;
    const centerY = node.y + oldHeight / 2;

    node.rotation = newRotation;

    node.x = centerX - newWidth / 2;
    node.y = centerY - newHeight / 2;

    setGraph(newGraph);
  }

  function createComponent() {
    setTempGraph([]);
    setComponentGraph([]);
    setComponentInputs([]);
    setComponentOutputs([]);
    setComponentName("");
    setInputOrder([]);
    setCreatingComponent(!creatingComponent)
  }

  function PushToTempGraph() {

    if (creatingComponent && selectedGate) {

      const alreadyAdded = tempGraph.some(
        node => node.id === selectedGate.id
      );

      if (alreadyAdded) {
        console.log("already added");
        return;
      }

      setTempGraph(prev => [
        ...prev,
        graph[selectedGate.id]
      ]);

    } else {
      console.log("didnt select a gate. not adding to temp graph");
    }
  }
  function abstractGraph(tempGraph) {

    const abstractedGraph = structuredClone(tempGraph);

    for (let node of abstractedGraph) {

      if (
        node.type === "INPUT" ||
        node.type === "CLOCK" ||
        node.type === "WIRE"
      ) {
        continue;
      }

      for (let i = 0; i < node.inputs.length; i++) {

        let input = node.inputs[i];

        if (input === null || input.id === -1) {
          continue;
        }

        let connection = graph.find(
          n => n.id === input.id
        );

        if (!connection) {
          console.log("Connection not found:", input.id);
          continue;
        }

        let connection_index = input.index;

        while (connection.type === "WIRE") {

          const wireInput = connection.inputs[0];

          if (
            wireInput === null ||
            wireInput.id === -1
          ) {
            console.log(
              "Wire has no source:",
              connection.id
            );
            break;
          }

          connection_index = wireInput.index;

          connection = graph.find(
            n => n.id === wireInput.id
          );

          if (!connection) {
            console.log(
              "Wire source not found:",
              wireInput.id
            );
            break;
          }
        }

        node.inputs[i] = {
          id: connection.id,
          index: connection_index
        };
      }
    }

    const [reindexedGraph, , idMap] = topologicalOrderAndReindex(
      abstractedGraph.filter(node => node.type !== "WIRE")
    );

    return [reindexedGraph, idMap];
  }


  function findExtInputs(graph) {

    let inputs = [];

    for (let node of graph) {

      if (!node.inputs) continue;

      for (let i = 0; i < node.inputs.length; i++) {

        let input = node.inputs[i];

        if (!input) continue;

        let source = graph.find(n => n.id === input.id);

        if (source && source.type === "INPUT") {

          inputs.push({
            id: node.id,
            index: i,
            sourceId: source.id
          });

        }
      }
    }

    return inputs;
  }

  function findExtOutputs(graph) {

    let outputs = [];

    for (let node of graph) {

      if (node.type === "BULB") {
        outputs.push({
          id: node.inputs[0].id,
          index: node.inputs[0].index,
          bulbId: node.id
        })
      }
    }

    return outputs;
  }


  function FinaliseComponentCreation() {

    setCreatingComponent(false);

    const [abstractedGraph, idMap] = abstractGraph(tempGraph);
    componentIdMapRef.current = idMap;

    const inputs = findExtInputs(abstractedGraph);
    const outputs = findExtOutputs(abstractedGraph);

    console.table(inputs);
    console.log(outputs);

    const componentGraph = abstractedGraph.filter(
      node =>
        node.type !== "INPUT" &&
        node.type !== "BULB"
    );

    setComponentGraph(componentGraph);
    setComponentInputs(inputs);
    setComponentOutputs(outputs);

    // Unique external toggles
    const uniqueInputSources = [
      ...new Set(
        inputs.map(entry => entry.sourceId)
      )
    ];

    setInputOrder(uniqueInputSources);

    setPinIndex(0);

    if (uniqueInputSources.length > 0) {
      setPinPhase("input");
    }
    else if (outputs.length > 0) {
      setPinPhase("output");
    }
    else {
      setPinPhase("input");
    }

    setSpecifyingInputs(true);
  }

  function saveComponent(component) {
  if (!component) return;

  // Only serialize the component — not the whole customComponents array
  const payload = {
    kind: "gatesim-component",
    version: 1,
    component
  };

  const safeName =
    (component.name || "component").replace(/[^a-z0-9_\-]+/gi, "_");

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const componentFileInputRef = useRef(null);

function loadComponent(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      // ── Strict validation ──
      if (!data || typeof data !== "object") {
        throw new Error("File is not a JSON object.");
      }

      if (data.kind !== "gatesim-component") {
        throw new Error(
          "File is not a single component. Expected kind: 'gatesim-component'."
        );
      }

      const c = data.component;

      if (!c || typeof c !== "object") {
        throw new Error("Missing 'component' field.");
      }

      if (
        c.type !== "CUSTOM" ||
        typeof c.name !== "string" ||
        !Array.isArray(c.inputs) ||
        !Array.isArray(c.outputs) ||
        !Array.isArray(c.ref_graph)
      ) {
        throw new Error("Component is malformed or missing required fields.");
      }

      // Dedupe by name if a component with that name already exists
      let finalName = c.name;
      let n = 1;
      const existingNames = new Set(customComponents.map(x => x.name));
      while (existingNames.has(finalName)) {
        finalName = `${c.name} (${n++})`;
      }

      const incoming = { ...c, name: finalName };

      setCustomComponents(prev => [...prev, incoming]);

      console.log("✅ Component loaded:", incoming.name);

    } catch (err) {
      console.error("Component load error:", err);
      alert(
        "Invalid component file.\n\n" +
        "This file must contain exactly one GateSim component. " +
        "Circuit files or other JSON files are not accepted.\n\n" +
        `Reason: ${err.message}`
      );
    }
  };

  reader.readAsText(file);
  e.target.value = "";
}


  return (
    <div className="homepage">
      <div className="utilities">
        <img
          src={logo}
          alt="GateSim Logo"
          width={55}
          height={75}
          className="logo"
          style={{ marginRight: '8px' }}
          onClick={showabout}
        />
        <button className="utilities-button" onClick={showTutorial} >
          TUTORIAL
        </button>
        <button className="utilities-button" onClick={downloadCircuit}>
          DOWNLOAD CIRCUIT
        </button>
        <button className="utilities-button" onClick={() => fileInputRef.current.click()}>
          LOAD CIRCUIT
        </button>
        <button className="utilities-button" onClick={() => { resetView() }}>RESET VIEW</button>
        <button className="utilities-button" onClick={() => { clearGraph() }}>CLEAR CIRCUIT</button>
        <button className="utilities-button" onClick={() => undo()} style={{ fontSize: '20px' }}>↶</button>
        <button className="utilities-button" onClick={() => redo()} style={{ fontSize: '20px' }}>↷</button>
        <button className="utilities-button" onClick={togglePauseSim}>
          {pauseSim ? '▶ START CLOCKS' : '⏸ PAUSE CLOCKS'}
        </button>
        <button className="utilities-button" onClick={() => {
          setTheme(!theme)
          CONSTANTS.toggleTheme(document, theme)
        }}>TOGGLE THEME</button>
        <button
          className="utilities-button"
          onClick={() => {
            console.table(graph);

          }}
        >
          print
        </button>
        <button className="utilities-button" onClick={() => { RotateGate() }}>ROTATE</button>
        <button className="utilities-button" onClick={() => createComponent()}>CREATE</button>
        {creatingComponent && (() => {
          return (
            <button className="utilities-button" onClick={() => { PushToTempGraph() }}>ADD</button>
          );
        })()}
        {creatingComponent && (() => {
          return (
            <button className="utilities-button" onClick={() => { FinaliseComponentCreation() }}>DONE</button>
          );
        })()}
        <button
  className="utilities-button"
  onClick={() => setShowComponentIO(true)}
>
  COMPONENTS
</button>
<button
  className="utilities-button"
  onClick={() => setShowLearnSidebar(v => !v)}
>
  {showLearnSidebar ? "HIDE GUIDE" : "LEARN"}
</button>

<input
  ref={componentFileInputRef}
  type="file"
  accept=".json"
  style={{ display: "none" }}
  onChange={loadComponent}
/>

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

          <details className="toolSection">
            <summary className="toolButton">
              <span>Input</span>
              <span>▼</span>
            </summary>

            <div className="toolGateCards">
              {inputGateRenderList.map((object) => (
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
          </details>


          <details className="toolSection">
            <summary className="toolButton">
              <span>Gates</span>
              <span>▼</span>
            </summary>

            <div className="gateCategories">

              <details className="gateCategory">
                <summary className="categoryButton">
                  2-INPUT
                </summary>

                <div className="toolGateCards">
                  {twoInputGateRenderList.map((object) => (
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
              </details>


              <details className="gateCategory">
                <summary className="categoryButton">
                  3-INPUT
                </summary>

                <div className="toolGateCards">
                  {threeInputGateRenderList.map((object) => (
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
              </details>




              <details className="gateCategory">
                <summary className="categoryButton">
                  4-INPUT
                </summary>

                <div className="toolGateCards">
                  {fourInputGateRenderList.map((object) => (
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
              </details>

            </div>
          </details>

          <details className="toolSection">
            <summary className="toolButton">
              <span>Sequential</span>
              <span>▼</span>
            </summary>

            <div className="gateCategories">

              <details className="gateCategory">
                <summary className="categoryButton">
                  FLIP-FLOPS
                </summary>

                <div className="toolGateCards">
                  {sequentialGateRenderList.map((object) => (
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
              </details>

            </div>
          </details>

          <details className="toolSection">
            <summary className="toolButton">
              <span>Combinational</span>
              <span>▼</span>
            </summary>

            <div className="gateCategories">

              <details className="gateCategory">
                <summary className="categoryButton">
                  MuX
                </summary>

                <div className="toolGateCards">
                  {MuxGateRenderList.map((object) => (
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
              </details>
              <details className="gateCategory">
                <summary className="categoryButton">
                  Adder
                </summary>

                <div className="toolGateCards">
                  {AdderGateRenderList.map((object) => (
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
              </details>

            </div>
          </details>


          <details className="toolSection">
            <summary className="toolButton">
              <span>Output</span>
              <span>▼</span>
            </summary>

            <div className="toolGateCards">
              {outputGateRenderList.map((object) => (
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
          </details>
          <details className="toolSection">
  <summary className="toolButton">
    <span>Custom</span>
    <span>▼</span>
  </summary>

  <div className="toolGateCards">
    {customComponents.map((component, index) => (
      <div
        key={`${component.name}-${index}`}
        onClick={() => Add("CUSTOM", null, null, null, component)}
      >
        <GateCard
          renderFxn={() => <RenderCUSTOM node={component} />}
          gateType={component.name}
        />
      </div>
    ))}
  </div>
</details>


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
              {[...graph]
                .filter(node => node.type !== "WIRE")
                .sort((a, b) => a.z - b.z)
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
      {showComponentDialog && (
        <div className="component-dialog-overlay">

          <div className="component-dialog">

            <h2>Create Component</h2>

            <input
              className="component-name-input"
              placeholder="Component name"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
            />

            <div className="component-graph-preview">
              {/* render componentGraph here */}
            </div>

            <div>
              <h3>Input Pins</h3>

              <div className="component-pin-list">
                {componentInputs.map((input, index) => (
                  <div className="component-pin" key={index}>
                    Input {index} → Node {input.nodeId}, pin {input.index}
                  </div>
                ))}
              </div>
            </div>



            <div className="component-dialog-buttons">

              <button
                onClick={() => {
                  setShowComponentDialog(false);
                }}
              >
                CANCEL
              </button>

              <button
                onClick={() => {

                  if (!componentName.trim()) {
                    alert("Please enter a component name.");
                    return;
                  }

                  if (componentOutputs.length === 0) {
                    alert("Please select at least one output pin.");
                    return;
                  }

                  const customComponent = {
                    type: "CUSTOM",
                    name: componentName.trim(),

                    inputs: structuredClone(componentInputs),
                    outputs: structuredClone(componentOutputs),

                    ref_graph: structuredClone(componentGraph)
                  };

                  console.log("Created component:", customComponent);

                  setCustomComponents(prev => [
                    ...prev,
                    customComponent
                  ]);

                  // Reset
                  setComponentGraph([]);
                  setComponentInputs([]);
                  setComponentOutputs([]);
                  setComponentName("");

                  setShowComponentDialog(false);

                }}
              >
                CREATE
              </button>

            </div>

          </div>

        </div>
      )}
      {specifyingInputs && (
        <div className="right-sidebar">
          <div className="right-sidebar-content">

            <input
              className="component-name-input"
              placeholder="Component name"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
            />

            {pinPhase === "input" ? (
              <>
                <p>Specify input {pinIndex}</p>
                <p className="pin-counter">
                  {pinIndex + 1} / {inputOrder.length}
                </p>
              </>
            ) : (
              <>
                <p>Specify output {pinIndex}</p>
                <p className="pin-counter">
                  {pinIndex + 1} / {componentOutputs.length}
                </p>
              </>
            )}

          </div>

          <div className="right-sidebar-footer">
            <button
              className="utilities-button"
              onClick={() => {

                if (pinPhase === "input") {

                  const newOrder = [...inputOrder];
                  const mappedId = componentIdMapRef.current.get(selectedGate?.id);
                  const idx = newOrder.indexOf(mappedId);

                  if (idx === -1) {
                    alert("Please select a valid input toggle.");
                    return;
                  }

                  // Move that toggle to the current pin position.
                  const [moved] = newOrder.splice(idx, 1);

                  newOrder.splice(pinIndex, 0, moved);

                  // Save the new ordering.
                  setInputOrder(newOrder);


                  // Still have more component inputs to specify.
                  if (pinIndex + 1 < newOrder.length) {

                    setPinIndex(pinIndex + 1);
                    return;
                  }


                  // Input specification finished.
                  if (componentOutputs.length > 0) {

                    setPinPhase("output");
                    setPinIndex(0);
                    return;
                  }


                  // No outputs → create component.
                  if (!componentName.trim()) {

                    alert("Please enter a component name.");
                    return;
                  }


                  // Expand the component-level ordering
                  // back into all internal mappings.
                  const orderedInputs = newOrder.flatMap(
                    sourceId =>
                      componentInputs.filter(
                        entry => entry.sourceId === sourceId
                      )
                  );


                  const customComponent = {

                    type: "CUSTOM",

                    name: componentName.trim(),

                    inputs: structuredClone(orderedInputs),

                    outputs: structuredClone(componentOutputs),

                    ref_graph: structuredClone(componentGraph)

                  };


                  setCustomComponents(prev => [
                    ...prev,
                    customComponent
                  ]);


                  // Reset component creation state.
                  setComponentGraph([]);
                  setComponentInputs([]);
                  setComponentOutputs([]);
                  setInputOrder([]);
                  setComponentName("");
                  setSpecifyingInputs(false);
                } else {

                  const mappedId = componentIdMapRef.current.get(selectedGate?.id);

  setComponentOutputs(prev => {
    const idx = prev.findIndex(
      (entry, i) => i >= pinIndex && entry.bulbId === mappedId
    );
    if (idx === -1) return prev;

    const copy = [...prev];
    const [moved] = copy.splice(idx, 1);
    copy.splice(pinIndex, 0, moved);
    return copy;
  });

                  if (pinIndex + 1 < componentOutputs.length) {

                    setPinIndex(pinIndex + 1);

                  } else {

                    if (!componentName.trim()) {
                      alert("Please enter a component name.");
                      return;
                    }

                    const orderedInputs = inputOrder.flatMap(sourceId =>
                      componentInputs.filter(
                        entry => entry.sourceId === sourceId
                      )
                    );

                    const customComponent = {
                      type: "CUSTOM",
                      name: componentName.trim(),
                      inputs: structuredClone(orderedInputs),
                      outputs: structuredClone(componentOutputs),
                      ref_graph: structuredClone(componentGraph)
                    };

                    setCustomComponents(prev => [...prev, customComponent]);

                    setComponentGraph([]);
                    setComponentInputs([]);
                    setComponentOutputs([]);
                    setInputOrder([]);
                    setComponentName("");
                    setSpecifyingInputs(false);
                  }
                }
              }}
            >
              DONE
            </button>
          </div>
        </div>
      )}

      {showComponentIO && (
  <div className="component-dialog-overlay">
    <div className="component-dialog">

      <h2>Custom Components</h2>

      {customComponents.length === 0 ? (
        <p className="component-empty">
          No custom components yet.
        </p>
      ) : (
        <div className="component-io-list">
          {customComponents.map((component, index) => (
            <div
              className="component-io-item"
              key={`${component.name}-${index}`}
            >
              <span className="component-io-name">
                {component.name}
              </span>

              <button
                className="utilities-button"
                onClick={() => saveComponent(component)}
              >
                SAVE
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="component-dialog-buttons">

        <button
          className="utilities-button"
          onClick={() => componentFileInputRef.current.click()}
        >
          LOAD COMPONENT
        </button>

        <button
          className="utilities-button"
          onClick={() => setShowComponentIO(false)}
        >
          CLOSE
        </button>

      </div>

    </div>
  </div>
)}

{showLearnSidebar && (
  <LearnSidebar onClose={() => setShowLearnSidebar(false)} />
)}

    </div>
  )
}

export default App; 