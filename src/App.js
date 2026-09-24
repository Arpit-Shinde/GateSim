import { useState, useEffect, useRef, useMemo } from "react";
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
import { isNodeFullyContained } from "./utils/selectionBox";
import { TimingDiagram, defaultSignalLabel } from "./components/timingDiagram";
import "./components/timingDiagram.css";

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
  let [selectMode, setSelectMode] = useState(false);
  let [selectionRect, setSelectionRect] = useState(null); // {x0,y0,x1,y1} while dragging, else null
  let [pinName, setPinName] = useState("");
  let [editingText, setEditingText] = useState(null);
  let [showDownloadDialog, setShowDownloadDialog] = useState(false);
  let [downloadFileName, setDownloadFileName] = useState("circuit");
  let [timingSignals, setTimingSignals] = useState([]); // [{id, gateId, outputIndex, label, disconnected}]
  let [timingHistory, setTimingHistory] = useState([]); // [{t, values: {[signalId]: bool|null}}]
  let [isCapturing, setIsCapturing] = useState(false);
  let [showTimingDiagram, setShowTimingDiagram] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState(null);
const [isBenchmarking, setIsBenchmarking] = useState(false);
  let timingHistoryRef = useRef([]);
  let timingCaptureStartRef = useRef(null);
  let timingSignalsRef = useRef([]);

  let { toggle, Add, clearGraph,runBenchmark } = useCircuit(
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
    setClockDelayInput,
    remapTimingSignals
  );

  const branchDots = useMemo(() => {
    const dots = [];

    for (const parent of graph) {
      if (parent.type !== "WIRE") continue;
      if (!parent.path?.length) continue;

      for (const child of graph) {
        if (child.type !== "WIRE") continue;

        const branchesFromParent = child.inputs?.some(
          input => input?.id === parent.id
        );

        if (!branchesFromParent) continue;

        const point = child.path?.[0];

        if (!point) continue;

        dots.push({
          x: point.x,
          y: point.y,
          value: parent.value?.[0] ?? false
        });
      }
    }

    return dots;
  }, [graph]);

  const tutorialShownRef = useRef(false);

  useEffect(() => {
    if (tutorialShownRef.current) return;
    tutorialShownRef.current = true;
    showTutorial();
  }, []);
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

  function openTextEditor(id, currentText) {
    setEditingText({ id, draft: currentText ?? "" });
  }
  function handleBenchmark() {
  if (!graph || graph.length === 0) {
    alert("Circuit is empty.");
    return;
  }

  setIsBenchmarking(true);

  // Allow the UI to update before starting the benchmark.
  setTimeout(() => {
    const result = runBenchmark({
      warmupRuns: 10,
      benchmarkRuns: 500,
      evaluateIterations: CONSTANTS.MAX_EVALUATION_ITERATIONS
    });

    setBenchmarkResult(result);
    setIsBenchmarking(false);
  }, 50);
}

  function commitTextEdit() {
    if (!editingText) return;

    const trimmed = editingText.draft.trim();
    if (trimmed === "") {
      // treat empty as cancel
      setEditingText(null);
      return;
    }

    updateTextLabel(editingText.id, trimmed);
    setEditingText(null);
  }

  function cancelTextEdit() {
    setEditingText(null);
  }

  function updateTextLabel(id, newText) {
    addToUndoStack(graph, clock_delays);

    setGraph(prev => {
      const next = structuredClone(prev);
      const node = next.find(n => n.id === id);
      if (node && node.type === "TEXT") {
        node.text = newText;
      }
      return next;
    });
  }

  function startDrag(e, id) {
    if (e.button === 1) return;
    if (selectMode) return;
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

      const [newGraph2, new_clock_delays, idMap2] =
        topologicalOrderAndReindex(newGraph);

      remapTimingSignals(idMap2);

      // =====================================================
      // RE-EVALUATE
      // =====================================================

      for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
    const changed = evaluate(newGraph);

    if (!changed) {
        break;
    }
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

      for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
    const changed = evaluate(newGraph);

    if (!changed) {
        break;
    }
}

      graphRef.current = newGraph;
      clockDelaysRef.current = newClockDelays;

      setGraph(newGraph);
      setClockDelays(newClockDelays);

    }, CONSTANTS.MIN_FRAME_TIME);

    return () => clearInterval(intervalId);

  }, [pauseSim]);


  // Mirror timingSignals into a ref so the capture interval below always
  // reads the latest signal list without needing to restart on every add/
  // remove/rename — same pattern as graphRef/clockDelaysRef above.
  useEffect(() => {
    timingSignalsRef.current = timingSignals;
  }, [timingSignals]);

  useEffect(() => {
    if (!isCapturing) return;

    if (timingCaptureStartRef.current === null) {
      timingCaptureStartRef.current = performance.now();
    }

    const captureIntervalId = setInterval(() => {
      const now = performance.now();
      const t = now - timingCaptureStartRef.current;
      const currentGraph = graphRef.current;

      const values = {};
      for (const sig of timingSignalsRef.current) {
        if (sig.disconnected || sig.gateId === null) {
          values[sig.id] = null;
          continue;
        }
        const node = currentGraph.find(n => n.id === sig.gateId);
        values[sig.id] = node?.value?.[sig.outputIndex] ?? null;
      }

      let updated = [...timingHistoryRef.current, { t, values }];

      if (updated.length > CONSTANTS.TIMING_MAX_SAMPLES) {
        updated = updated.slice(updated.length - CONSTANTS.TIMING_MAX_SAMPLES);
      }

      timingHistoryRef.current = updated;
      setTimingHistory(updated);

    }, CONSTANTS.MIN_FRAME_TIME);

    return () => clearInterval(captureIntervalId);

  }, [isCapturing]);

  


  function setoutputpin(id, index, pinX, pinY) {
    if (selectMode) return;
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
    if (selectMode) return;
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
    if (selectMode) return;
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

    if (selectionRect) {
      const point = getSVGPoint(e, svgRef, view);
      setSelectionRect(prev => ({ ...prev, x1: point.x, y1: point.y }));
      return;
    }

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
    if (selectionRect) {
      finalizeSelection(selectionRect);
      setSelectionRect(null);
      return;
    }
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
    if (
      e.target === svgRef.current ||           // the <svg> element
      e.target.tagName === "svg"               // safety for browsers that wrap
    ) {
      setSelectedGate(null);
      setSelectedWire(null);
      setTempGraph([])
    }
    if (selectMode && e.button === 0) {
      const point = getSVGPoint(e, svgRef, view);
      setSelectionRect({ x0: point.x, y0: point.y, x1: point.x, y1: point.y });
      return;
    }

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

  function openDownloadDialog() {
    setDownloadFileName("circuit");
    setShowDownloadDialog(true);
  }

  function commitDownload() {
    const trimmed = downloadFileName.trim();
    if (!trimmed) {
      alert("Please enter a file name.");
      return;
    }

    const safeName = trimmed.replace(/[^a-z0-9_\-]+/gi, "_");
    const fullName = safeName.endsWith(".json") ? safeName : `${safeName}.json`;

    const data = {
      graph: graph,
      clock_delays: clock_delays.map(c => ({
        id: c.id,
        delay: c.delay
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fullName;
    a.click();
    URL.revokeObjectURL(url);

    setShowDownloadDialog(false);
  }

  function cancelDownload() {
    setShowDownloadDialog(false);
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

        // Handle both old and new formats
        if (Array.isArray(data)) {
          loadedGraph = data;
        } else if (data.graph && Array.isArray(data.graph)) {
          loadedGraph = data.graph;
          loadedDelays = data.clock_delays || [];
        } else {
          throw new Error("Invalid circuit file format");
        }

        // Reindex the loaded graph
        // A freshly loaded circuit has no relationship to any previously
        // tracked timing signals — start the capture panel clean rather
        // than trying to remap ids across two unrelated graphs.
        resetTimingCapture();

        // Reindex the loaded graph
        let [newGraph, newClockDelays] = topologicalOrderAndReindex(loadedGraph);
        // Rebuild clock delays with fresh next_delay
        const now = performance.now();
        const restoredDelays = newClockDelays.map(clock => {
          const newId = newGraph.find(g => g.id === clock.id)?.id;
          return {
            id: newId !== undefined ? newId : clock.id,
            delay: clock.delay,
            next_delay: now + clock.delay
          };
        });

        // Evaluate the circuit
        for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
    const changed = evaluate(newGraph);

    if (!changed) {
        break;
    }
}

        // Clear undo/redo on load
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
    setSelectMode(false);
    setSelectionRect(null);
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
            sourceId: source.id,
            name: ""
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
          bulbId: node.id,
          name: ""
        })
      }
    }

    return outputs;
  }
  // Returns { ok: true } or { ok: false, reason: string, offenders: [...] }
  function validateNoDanglingInputs(selectedNodes, fullGraph) {
    const selectedIds = new Set(selectedNodes.map(n => n.id));

    const offenders = [];

    for (const node of selectedNodes) {
      if (node.type === "INPUT" || node.type === "CLOCK" || node.type === "WIRE") {
        continue;
      }

      if (!Array.isArray(node.inputs)) continue;

      for (let i = 0; i < node.inputs.length; i++) {
        const input = node.inputs[i];

        // Unconnected slot
        if (!input || input.id === -1) {
          offenders.push({
            gateId: node.id,
            gateType: node.type,
            pinIndex: i,
            reason: "unconnected",
          });
          continue;
        }

        // Connected but the source is outside the selection
        if (!selectedIds.has(input.id)) {
          // Resolve through wires to find the true source
          let cursor = input;
          const seen = new Set();
          let insideSelection = false;

          while (cursor && cursor.id !== -1) {
            if (seen.has(cursor.id)) break; // cycle guard
            seen.add(cursor.id);

            if (selectedIds.has(cursor.id)) {
              insideSelection = true;
              break;
            }

            const src = fullGraph.find(n => n.id === cursor.id);
            if (!src) break;

            if (src.type === "WIRE") {
              cursor = src.inputs?.[0];
              continue;
            }

            // Non-wire source outside selection
            break;
          }

          if (!insideSelection) {
            offenders.push({
              gateId: node.id,
              gateType: node.type,
              pinIndex: i,
              reason: "external",
            });
          }
        }
      }
    }

    if (offenders.length === 0) {
      return { ok: true };
    }

    return {
      ok: false,
      offenders,
      reason:
        `Found ${offenders.length} unconnected pin(s) in the selection. ` +
        `Every pin of every gate inside the selection must be connected ` +
        `to another gate inside the selection. ` +
        `Either extend the selection to include the missing sources, ` +
        `or connect the dangling pins before creating the component.`,
    };
  }


  function FinaliseComponentCreation() {

    setCreatingComponent(false);
    setSelectMode(false);
    setSelectionRect(null);

    const check = validateNoDanglingInputs(tempGraph, graph);
    if (!check.ok) {
      console.warn("Dangling inputs:", check.offenders);
      alert(check.reason);
      return;
    }
    if (!tempGraph || tempGraph.length === 0) {
      alert("No gates selected. Add gates with ADD or select them with SELECT MODE before clicking DONE.");
      return;
    }

    // ── Validate: only WIREs selected ──
    const nonWire = tempGraph.filter(n => n.type !== "WIRE");
    if (nonWire.length === 0) {
      alert("Only wires selected. A component must contain at least one gate.");
      return;
    }

    // ── Validate: no BULB-only selection ──
    const hasNonBulb = nonWire.some(
      n => n.type !== "BULB" && n.type !== "INPUT" && n.type !== "CLOCK"
    );
    if (!hasNonBulb) {
      alert("Component must contain at least one logic gate (AND, OR, NOT, etc.).");
      return;
    }

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
    setTempGraph([]);
  }

  function finalizeSelection(rect) {
    const w = Math.abs(rect.x1 - rect.x0);
    const h = Math.abs(rect.y1 - rect.y0);

    if (w < 4 && h < 4) return; // ignore accidental clicks
    if (!creatingComponent) return;

    const newlySelected = graph.filter(node =>
      node.type !== "WIRE" &&
      isNodeFullyContained(node, rect)
    );

    if (newlySelected.length === 0) return;

    setTempGraph(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const additions = newlySelected.filter(n => !existingIds.has(n.id));
      return [...prev, ...additions];
    });
  }

  function toggleSelectMode() {
    setSelectMode(prev => !prev);
    // clear any in-flight interaction so modes don't bleed into each other
    setoPin(null);
    setMouse(null);
    setWirePath([]);
    setdraginfo(null);
    setPan(null);
    setSelectionRect(null);
  }

  // ── Timing diagram: id-remap / reset ──

  function remapTimingSignals(idMap) {
    setTimingSignals(prev =>
      prev.map(sig => {
        if (sig.gateId === null) return sig; // already disconnected, leave as-is
        const newId = idMap.get(sig.gateId);
        if (newId === undefined) {
          // The node this signal was watching no longer exists.
          // Keep the row (so already-captured history stays visible)
          // but stop it from being sampled going forward.
          return { ...sig, gateId: null, disconnected: true };
        }
        return { ...sig, gateId: newId };
      })
    );
  }

  function resetTimingCapture() {
    timingHistoryRef.current = [];
    timingCaptureStartRef.current = null;
    setTimingSignals([]);
    setTimingHistory([]);
    setIsCapturing(false);
  }

  // ── Timing diagram: signal management ──

  function addSelectedSignalToTiming() {
    if (!selectedGate) {
      alert("Select a gate, wire, input, or clock on the canvas first, then click ADD SIGNAL.");
      return;
    }

    const node = graph.find(n => n.id === selectedGate.id);
    if (!node) return;

    if (node.type === "TEXT") {
      alert("Labels don't carry a signal value.");
      return;
    }

    const outputCount = node.value?.length ?? 1;

    setTimingSignals(prev => {
      const next = [...prev];

      for (let i = 0; i < outputCount; i++) {
        const alreadyTracked = next.some(
          s => s.gateId === node.id && s.outputIndex === i
        );
        if (alreadyTracked) continue;

        next.push({
          id: `sig-${node.id}-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          gateId: node.id,
          outputIndex: i,
          label: defaultSignalLabel(node, i),
          disconnected: false
        });
      }

      return next;
    });
  }

  function removeTimingSignal(signalId) {
    setTimingSignals(prev => prev.filter(s => s.id !== signalId));
  }

  function clearTimingSignals() {
    setTimingSignals([]);
  }

  function renameTimingSignal(signalId, newLabel) {
    setTimingSignals(prev =>
      prev.map(s => (s.id === signalId ? { ...s, label: newLabel } : s))
    );
  }

  // ── Timing diagram: capture control ──

  function startTimingCapture() {
    if (timingSignals.length === 0) {
      alert("Add at least one signal before starting capture.");
      return;
    }
    if (timingCaptureStartRef.current === null) {
      timingCaptureStartRef.current = performance.now();
    }
    setIsCapturing(true);
  }

  function pauseTimingCapture() {
    setIsCapturing(false);
  }

  function clearTimingCapture() {
    timingHistoryRef.current = [];
    timingCaptureStartRef.current = null;
    setTimingHistory([]);
    setIsCapturing(false);
  }

  function beautify(graph) {
    const newGraph = structuredClone(graph);

    for (const node of newGraph) {
      if (node.type !== "WIRE") continue;
      if (!node.path || node.path.length < 2) continue;

      const path = node.path;
      const newPath = [path[0]];

      for (let i = 1; i < path.length; i++) {
        const prev = newPath[newPath.length - 1];
        const curr = path[i];

        if (prev.x === curr.x || prev.y === curr.y) {
          newPath.push(curr);
          continue;
        }

        const dx = Math.abs(curr.x - prev.x);
        const dy = Math.abs(curr.y - prev.y);

        if (dx >= dy) {
          newPath.push({
            x: curr.x,
            y: prev.y
          });
        } else {
          newPath.push({
            x: prev.x,
            y: curr.y
          });
        }

        newPath.push(curr);
      }

      const simplified = [newPath[0]];

      for (let i = 1; i < newPath.length - 1; i++) {
        const a = simplified[simplified.length - 1];
        const b = newPath[i];
        const c = newPath[i + 1];

        const horizontal =
          a.y === b.y &&
          b.y === c.y;

        const vertical =
          a.x === b.x &&
          b.x === c.x;

        if (!horizontal && !vertical) {
          simplified.push(b);
        }
      }

      simplified.push(newPath[newPath.length - 1]);

      node.path = simplified;
    }

    setGraph(newGraph);
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
  function cancelComponentCreation() {
    // Kill the wizard
    setSpecifyingInputs(false);

    // Wipe all in-progress component state
    setTempGraph([]);
    setComponentGraph([]);
    setComponentInputs([]);
    setComponentOutputs([]);
    setInputOrder([]);
    setComponentName("");
    setPinIndex(0);
    setPinPhase("input");

    // Exit component-creation mode
    setCreatingComponent(false);
    setSelectMode(false);
    setSelectionRect(null);

    // Clear any lingering selections that would keep gates glowing
    setSelectedGate(null);
    setSelectedWire(null);

    // Clear pin id map used during ordering
    componentIdMapRef.current = new Map();
  }
  const tempGraphIds = new Set(tempGraph.map(n => n.id));

  function printgraph(graph, title = "GRAPH") {
    console.log(`\n========== ${title} ==========`);

    function printValue(value, indent = "") {
      if (value === null) {
        console.log(indent + "null");
        return;
      }

      if (value === undefined) {
        console.log(indent + "undefined");
        return;
      }

      if (typeof value !== "object") {
        console.log(indent + String(value));
        return;
      }

      if (Array.isArray(value)) {
        console.log(indent + `[Array: ${value.length}]`);

        value.forEach((item, i) => {
          console.log(`${indent}  [${i}]`);
          printValue(item, indent + "    ");
        });

        return;
      }

      const keys = Object.keys(value);

      console.log(indent + `{`);

      keys.forEach(key => {
        const val = value[key];

        if (val !== null && typeof val === "object") {
          console.log(`${indent}  ${key}:`);
          printValue(val, indent + "    ");
        } else {
          console.log(`${indent}  ${key}: ${String(val)}`);
        }
      });

      console.log(indent + `}`);
    }

    printValue(graph);

    console.log(`========== END ${title} ==========\n`);
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

        {/* ── FILE ── */}
        <details className="utilities-menu">
          <summary className="utilities-button">FILE</summary>
          <div className="utilities-menu-content">
            <button onClick={openDownloadDialog}>DOWNLOAD CIRCUIT</button>
            <button onClick={() => fileInputRef.current.click()}>LOAD CIRCUIT</button>
            <button onClick={() => setShowComponentIO(true)}>COMPONENTS</button>
          </div>
        </details>

        {/* ── EDIT ── */}
        <details className="utilities-menu">
          <summary className="utilities-button">EDIT</summary>
          <div className="utilities-menu-content">
            <button onClick={() => undo()}>↶ UNDO</button>
            <button onClick={() => redo()}>↷ REDO</button>
            <button onClick={() => clearGraph()}>CLEAR CIRCUIT</button>
            <button onClick={() => {
              setTempGraph([])
              setSelectedGate(null)
            }}>DESELECT ALL</button>
            <button onClick={() => { beautify(graph) }}>BEAUTIFY</button>
          </div>
        </details>

        {/* ── VIEW ── */}
        <details className="utilities-menu">
          <summary className="utilities-button">VIEW</summary>
          <div className="utilities-menu-content">
            <button onClick={() => resetView()}>RESET VIEW</button>
            <button
              onClick={() => {
                setTheme(!theme);
                CONSTANTS.toggleTheme(document, theme);
              }}
            >
              TOGGLE THEME
            </button>

          </div>
        </details>

        {/* ── SIMULATION ── */}
        <details className="utilities-menu">
          <summary className="utilities-button">SIMULATION</summary>
          <div className="utilities-menu-content">
            <button onClick={togglePauseSim}>
              {pauseSim ? "▶ START CLOCKS" : "⏸ PAUSE CLOCKS"}
            </button>
          </div>
        </details>
        <button className="utilities-button" onClick={showTutorial}>TUTORIAL</button>

        {/* ── TOOLS ── */}
        <details className="utilities-menu">
          <summary className="utilities-button">TOOLS</summary>
          <div className="utilities-menu-content">
            <button onClick={() => RotateGate()}>ROTATE</button>

          </div>
        </details>

        {/* ── CREATE COMPONENT (contextual) ── */}
        {!creatingComponent ? (
          <button className="utilities-button" onClick={createComponent}>
            CREATE COMPONENT
          </button>
        ) : (
          <>
            <button className="utilities-button" onClick={PushToTempGraph}>
              ADD
            </button>
            <button className="utilities-button" onClick={toggleSelectMode}>
              {selectMode ? "EXIT SELECT" : "SELECT MODE"}
            </button>
            <button className="utilities-button" onClick={FinaliseComponentCreation}>
              DONE
            </button>
          </>
        )}
        <button className="utilities-button" onClick={() => setShowLearnSidebar(v => !v)}>
          {showLearnSidebar ? "HIDE GUIDE" : "SELF-LEARN"}
        </button>
        <button className="utilities-button" onClick={() => setShowTimingDiagram(v => !v)}>
          {showTimingDiagram ? "HIDE TIMING" : "TIMING DIAGRAM"}
        </button>
        <button
  onClick={handleBenchmark}
  disabled={isBenchmarking}
>
  {isBenchmarking ? "Benchmarking..." : "Benchmark Circuit"}
</button>

        {/* <button onClick={() => { printgraph(graph) }}>print</button> */}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={loadCircuit}
        />
        <input
          ref={componentFileInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={loadComponent}
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
          <div
            className="toolButton"
            onClick={() => Add("TEXT")}
            style={{ cursor: "pointer" }}
          >
            <span>LABEL</span>

          </div>
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
                    isSelected={selectedGate?.id === node.id || tempGraphIds.has(node.id)}
                    path={node.path}
                    selectWire={selectWire}
                  />
                ))}

              {branchDots.map((point, i) => (
                <circle
                  key={`branch-dot-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill={
                    point.value
                      ? CONSTANTS.BULB_ON_COLOR
                      : CONSTANTS.GATE_STROKE_COLOR
                  }
                  pointerEvents="none"
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
                    isSelected={selectedGate?.id === node.id || tempGraphIds.has(node.id)}
                    onEditText={openTextEditor}
                  />
                ))}
              {selectionRect && (() => {
                const x = Math.min(selectionRect.x0, selectionRect.x1);
                const y = Math.min(selectionRect.y0, selectionRect.y1);
                const w = Math.abs(selectionRect.x1 - selectionRect.x0);
                const h = Math.abs(selectionRect.y1 - selectionRect.y0);

                return (
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={CONSTANTS.SELECTION_FILL_COLOR}
                    stroke={CONSTANTS.SELECTION_STROKE_COLOR}
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
                    pointerEvents="none"
                  />
                );
              })()}


            </svg>
          </div>
        </div>
      </div>
      {showAbout && <AboutModal onClose={closeAbout} />}
      {showDownloadDialog && (
        <div className="text-edit-overlay" onClick={cancelDownload}>
          <div
            className="text-edit-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-edit-title">Download Circuit</div>

            <input
              className="text-edit-input"
              autoFocus
              placeholder="circuit"
              value={downloadFileName}
              onChange={(e) => setDownloadFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitDownload();
                if (e.key === "Escape") cancelDownload();
              }}
            />

            <div className="text-edit-hint">
              Saved as <code>{downloadFileName.trim().replace(/[^a-z0-9_\-]+/gi, "_") || "circuit"}.json</code>
            </div>

            <div className="text-edit-buttons">
              <button className="utilities-button" onClick={cancelDownload}>
                CANCEL
              </button>
              <button className="utilities-button primary" onClick={commitDownload}>
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

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
                <p>Specify input for pin number {pinIndex}</p>

              </>
            ) : (
              <>
                <p>Specify output for pin number{pinIndex}</p>

              </>
            )}

          </div>

          {specifyingInputs && (
            <>
              <label>
                {pinPhase === "input"
                  ? `Input ${pinIndex}`
                  : `Output ${pinIndex + 1}`}
              </label>

              <input
                type="text"
                value={pinName}
                onChange={(e) => setPinName(e.target.value)}
                placeholder={
                  pinPhase === "input"
                    ? `I${pinIndex}`
                    : `O${pinIndex + 1}`
                }
              />
            </>
          )}

          <div className="right-sidebar-footer">
            <button
              className="utilities-button"
              onClick={() => {

                if (pinPhase === "input") {

                  const newOrder = [...inputOrder];

                  const mappedId =
                    componentIdMapRef.current.get(selectedGate?.id);

                  const idx = newOrder.indexOf(mappedId);

                  if (idx === -1) {
                    alert("Please select a valid input toggle.");
                    return;
                  }

                  // Use entered name, or default to I0, I1, I2, ...
                  const name =
                    pinName.trim() || `I${pinIndex}`;

                  // Move that toggle to the current pin position.
                  const [moved] = newOrder.splice(idx, 1);

                  newOrder.splice(pinIndex, 0, moved);

                  // Save the new ordering.
                  setInputOrder(newOrder);

                  // Save the pin name.
                  // This updates every internal mapping belonging
                  // to this external input source.
                  setComponentInputs(prev =>
                    prev.map(entry =>
                      entry.sourceId === mappedId
                        ? { ...entry, name }
                        : entry
                    )
                  );

                  setSelectedGate(null);

                  // Still have more component inputs to specify.
                  if (pinIndex + 1 < newOrder.length) {

                    setPinIndex(pinIndex + 1);

                    // Default name for next input.
                    setPinName(`I${pinIndex + 1}`);

                    return;
                  }

                  // Input specification finished.
                  if (componentOutputs.length > 0) {

                    setPinPhase("output");
                    setPinIndex(0);

                    // Default name for first output.
                    setPinName("O1");

                    return;
                  }

                  // No outputs → create component.
                  if (!componentName.trim()) {
                    alert("Please enter a component name.");
                    return;
                  }

                  // Expand component-level ordering
                  // back into all internal mappings.
                  const orderedInputs = newOrder.flatMap(
                    sourceId =>
                      componentInputs
                        .filter(
                          entry => entry.sourceId === sourceId
                        )
                        .map(entry => ({
                          ...entry,
                          name:
                            entry.sourceId === mappedId
                              ? name
                              : entry.name
                        }))
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
                  setPinName("");
                  setSpecifyingInputs(false);

                } else {

                  const mappedId =
                    componentIdMapRef.current.get(selectedGate?.id);

                  const idx = componentOutputs.findIndex(
                    (entry, i) =>
                      i >= pinIndex &&
                      entry.bulbId === mappedId
                  );

                  if (idx === -1) {
                    alert("Please select a valid output bulb.");
                    return;
                  }

                  // Use entered name, or default to O1, O2, O3, ...
                  const name =
                    pinName.trim() || `O${pinIndex + 1}`;

                  // Create the reordered output array locally.
                  // This is important because React state updates
                  // are asynchronous.
                  const reorderedOutputs = [
                    ...componentOutputs
                  ];

                  const [moved] =
                    reorderedOutputs.splice(idx, 1);

                  const namedOutput = {
                    ...moved,
                    name
                  };

                  reorderedOutputs.splice(
                    pinIndex,
                    0,
                    namedOutput
                  );

                  // Save the updated outputs.
                  setComponentOutputs(reorderedOutputs);
                  setSelectedGate(null);

                  // Still have more component outputs to specify.
                  if (
                    pinIndex + 1 <
                    reorderedOutputs.length
                  ) {

                    setPinIndex(pinIndex + 1);

                    // Default name for next output.
                    setPinName(
                      `O${pinIndex + 2}`
                    );

                    return;
                  }

                  // Output specification finished.
                  if (!componentName.trim()) {
                    alert("Please enter a component name.");
                    return;
                  }

                  const orderedInputs =
                    inputOrder.flatMap(
                      sourceId =>
                        componentInputs.filter(
                          entry =>
                            entry.sourceId === sourceId
                        )
                    );

                  const customComponent = {

                    type: "CUSTOM",

                    name: componentName.trim(),

                    inputs: structuredClone(
                      orderedInputs
                    ),

                    // IMPORTANT:
                    // Use reorderedOutputs rather than
                    // componentOutputs because the state
                    // update above may not have completed yet.
                    outputs: structuredClone(
                      reorderedOutputs
                    ),

                    ref_graph: structuredClone(
                      componentGraph
                    )

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
                  setPinName("");
                  setSpecifyingInputs(false);
                }
              }}
            >
              DONE
            </button>

            <button
              className="utilities-button"
              onClick={cancelComponentCreation}
              style={{ marginRight: "auto" }}
            >
              CANCEL
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

      {editingText && (
        <div className="text-edit-overlay" onClick={cancelTextEdit}>
          <div
            className="text-edit-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-edit-title">Edit Label</div>

            <input
              className="text-edit-input"
              autoFocus
              value={editingText.draft}
              onChange={(e) =>
                setEditingText(prev => ({ ...prev, draft: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTextEdit();
                if (e.key === "Escape") cancelTextEdit();
              }}
            />

            <div className="text-edit-buttons">
              <button
                className="utilities-button"
                onClick={cancelTextEdit}
              >
                CANCEL
              </button>
              <button
                className="utilities-button primary"
                onClick={commitTextEdit}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

            {showTimingDiagram && (
        <TimingDiagram
          signals={timingSignals}
          history={timingHistory}
          isCapturing={isCapturing}
          onStart={startTimingCapture}
          onPause={pauseTimingCapture}
          onClear={clearTimingCapture}
          onAddSelectedSignal={addSelectedSignalToTiming}
          onRemoveSignal={removeTimingSignal}
          onClearSignals={clearTimingSignals}
          onRenameSignal={renameTimingSignal}
          onClose={() => setShowTimingDiagram(false)}
        />
      )}

      {benchmarkResult && benchmarkResult.success && (
  <div className="benchmark-results">
    <h3>Benchmark Results</h3>

    <p>
      Nodes: {benchmarkResult.nodeCount}
    </p>

    <p>
      Benchmark Runs: {benchmarkResult.benchmarkRuns}
    </p>

    <p>
      Evaluation Iterations: {benchmarkResult.evaluateIterations}
    </p>

    <p>
      Average Evaluation Time:{" "}
      {benchmarkResult.averageEvaluationTime.toFixed(4)} ms
    </p>

    <p>
      Minimum Evaluation Time:{" "}
      {benchmarkResult.minimumEvaluationTime.toFixed(4)} ms
    </p>

    <p>
      Maximum Evaluation Time:{" "}
      {benchmarkResult.maximumEvaluationTime.toFixed(4)} ms
    </p>

    <p>
      Average Topological Sort Time:{" "}
      {benchmarkResult.averageSortingTime.toFixed(4)} ms
    </p>

    <p>
      Evaluations per Second:{" "}
      {Number.isFinite(benchmarkResult.evaluationsPerSecond)
        ? benchmarkResult.evaluationsPerSecond.toFixed(2)
        : "∞"}
    </p>

    <p>
      Total Benchmark Time:{" "}
      {benchmarkResult.totalBenchmarkTime.toFixed(2)} ms
    </p>
  </div>
)}



    </div>
  )
}

export default App; 