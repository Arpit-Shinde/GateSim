import { useState, useEffect, useRef, useMemo } from "react";
import { evaluate } from "./utils/evaluate"
import { Gate } from "./components/gate"
import { LiveWire } from "./components/wire"
import { showTutorial } from "./components/tutorial_modal";
import * as CONSTANTS from "./constants/constants";
import { GateCard } from "./components/gatecard";
import { getSVGPoint } from "./utils/svgHelpers";
import { useCircuit } from "./hooks/useCircuit";
import { AboutModal } from "./components/about_modal";
import { compactAndReindex } from "./utils/reindex"
import {
  inputGateRenderList, twoInputGateRenderList,
  threeInputGateRenderList, fourInputGateRenderList,
  sequentialGateRenderList,
  MuxGateRenderList, AdderGateRenderList,
  outputGateRenderList
} from "./constants/gatesList";
import logo from './gatesim-logo2.png';
import { RenderUncommitedWire } from "./components/wire";
import { RenderCUSTOM } from "./svg/gatesSvg";
import { isNodeFullyContained, SelectionRectangle } from "./utils/selectionBox";
import { TimingDiagram, defaultSignalLabel } from "./components/timingDiagram";
import "./components/timingDiagram.css";
import { ClockWindow } from "./components/clockWindow";
import { useClocks, togglePauseSim } from "./hooks/useClocks";
import { TopBar } from "./components/topBar";
import { ToolsBar } from "./components/toolBar";
import { DownloadDialog } from "./components/downloadDialog";
import { ComponentDialog } from "./components/componentDialog";
import { SpecifyInputsSidebar } from "./components/componentRightSidebar";
import { CanvasArea } from "./components/canvas";
import { finalizeCopySelection, pasteCopiedCircuit } from "./utils/copyMode";
import { TextEditDialog, openTextEditor, commitTextEdit, cancelTextEdit } from "./components/textEdit";
import { useDeleteNode } from "./hooks/useDeleteNode";
import { beautify } from "./utils/beautify";
import { commitDownload, loadCircuit } from "./utils/fileIO";
import { redo, undo } from "./utils/undoRedo";
import { LearnSidebar } from "./components/learnSideBar";

function App() {

  let [graph, setGraph] = useState([]);
  let [clock_delays, setClockDelays] = useState([]);
  let [view, setView] = useState({
    x: 0,
    y: 0,
    width: CONSTANTS.CANVAS_INITIAL_VIEW_WIDTH,
    height: CONSTANTS.CANVAS_INITIAL_VIEW_HEIGHT
  });
  let [pan, setPan] = useState(null);
  let svgRef = useRef(null);
  let graphRef = useRef(graph);
  let clockDelaysRef = useRef(clock_delays);
  let [opin, setoPin] = useState(null);
  let [selectedWire, setSelectedWire] = useState(null);
  let [selectedGate, setSelectedGate] = useState(null);
  let [draginfo, setdraginfo] = useState(null);
  let [didDrag, setDidDrag] = useState(false);
  let [mouse, setMouse] = useState(null);
  let [theme, setTheme] = useState(false);
  let [pauseSim, setPauseSim] = useState(false);
  let [showClockWindow, setShowClockWindow] = useState(false);
  let [pausedClocks, setPausedClocks] = useState([]); //to store remaining time for clock tick after pause
  let pausedClocksRef = useRef([]);
  let [wirePath, setWirePath] = useState([]); //to store bending points of wire which is being drawn 
  let [tempGraph, setTempGraph] = useState([]);
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
  let timingHistoryRef = useRef([]);
  let timingCaptureStartRef = useRef(null);
  let timingSignalsRef = useRef([]);
  let [copySelectMode, setCopySelectMode] = useState(false);
  let [copiedGraph, setCopiedGraph] = useState([]);
  let [copiedClockDelays, setCopiedClockDelays] = useState([]);
  let canvasMouseRef = useRef({ x: 0, y: 0 });
  let fileInputRef = useRef(null);
  let { toggle, Add, clearGraph } = useCircuit(
    graph,
    setGraph,
    clock_delays,
    setClockDelays,
    view,
    addToUndoStack,
    setShowClockWindow,
    remapTimingSignals
  );
  let [undoStack, setUndoStack] = useState([]);
  let [redoStack, setRedoStack] = useState([]);
  let [showAbout, setShowAbout] = useState(false);
  let [interactivityMode, setInteractivityMode] = useState("DRAG");
  let tempGraphIds = new Set(tempGraph.map(n => n.id));

  let branchDots = useMemo(() => {
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


  // let prevState = useRef({});
  // useEffect(() => {
  //   const now = {
  //     graph, clock_delays, view, pan, opin, selectedGate, selectedWire,
  //     draginfo, didDrag, mouse, undoStack, redoStack, timingHistory
  //   };
  //   for (const k in now)
  //     if (prevState.current[k] !== now[k]) // console.log("changed:", k);
  //   prevState.current = now;
  // });

  const aboutShownRef = useRef(false);
  useEffect(() => { //for opening custom files through url
    const params = new URLSearchParams(window.location.search);
    const circuitId = params.get("circuit");

    if (!circuitId) return;

    // Sanitize: only allow alphanumeric, dash, underscore.
    // Prevents path traversal via ?circuit=../../etc/passwd
    if (!/^[a-zA-Z0-9_-]+$/.test(circuitId)) {
      console.warn("Invalid circuit id:", circuitId);
      return;
    }

    const url = `${process.env.PUBLIC_URL}/docs/${circuitId}.json`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Accept either {graph, clock_delays} or a raw array
        let loadedGraph;
        let loadedDelays = [];

        if (Array.isArray(data)) {
          loadedGraph = data;
        } else if (data.graph && Array.isArray(data.graph)) {
          loadedGraph = data.graph;
          loadedDelays = data.clock_delays || [];
        } else {
          throw new Error("Invalid circuit file format");
        }

        resetTimingCapture();

        const [newGraph,] = compactAndReindex(loadedGraph);

        for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
          const changed = evaluate(newGraph);
          if (!changed) break;
        }

        setUndoStack([]);
        setRedoStack([]);
        setGraph(newGraph);
        setClockDelays(loadedDelays);

        // console.log(`✅ Loaded circuit "${circuitId}" from URL`);
      })
      .catch(err => {
        console.error("URL circuit load failed:", err);
        alert(`Could not load circuit "${circuitId}" from URL.`);
      });
  }, []);
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.key.toLowerCase() === "v") {
        e.preventDefault();

        pasteCopiedCircuit({
          copiedGraph,
          mousePosition: canvasMouseRef.current,
          graph,
          clock_delays,
          CONSTANTS,
          compactAndReindex,
          evaluate,
          remapTimingSignals,
          setGraph,
          setClockDelays,
          graphRef,
          clockDelaysRef
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [copiedGraph, copiedClockDelays, graph, clock_delays]);
  useEffect(() => {
    if (aboutShownRef.current) return;
    aboutShownRef.current = true;
    showabout();
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

  useDeleteNode({
    selectedGate,
    graph,
    clock_delays,
    addToUndoStack,
    setGraph,
    setClockDelays,
    setSelectedGate,
    compactAndReindex,
    remapTimingSignals,
    evaluate,
    CONSTANTS
  });

  useClocks(
    pauseSim,
    graphRef,
    clockDelaysRef,
    setGraph,
    setClockDelays
  )

  // Mirror timingSignals into a ref so the capture interval below always
  // reads the latest signal list without needing to restart on every add/
  // remove/rename — same pattern as graphRef/clockDelaysRef above.
  useEffect(() => {
    timingSignalsRef.current = timingSignals;
  }, [timingSignals]);

  useEffect(() => { //timing diagrams
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


  function setoutputpin(id, index, pinX, pinY) { //sets information about output pin when clicked on a output pin of node
    if (selectMode) return;
    if (interactivityMode === "PAN") return;
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

  function setinputpin(id, index, endx, endy) { //when pressed on input pin, adds wire and its relevant connection
    if (opin === null) return;
    if (selectMode) return;
    if (interactivityMode === "PAN") return;
    // console.log(`setinputpin fired. currently, id=${id}, index=${index}`)
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

  function selectWire(e, id) { //to select or branch wire
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

      // console.log("added point to live wire");


    }

  }

  function startDrag(e, id) {
    if (e.button === 1) return;
    if (selectMode) return;
    addToUndoStack(graph, clock_delays)
    const point = getSVGPoint(e, svgRef, view); //coordinates of mouse with origin as top of canvas

    setdraginfo({
      gateId: id,
      offsetX: point.x - graph[id].x,
      offsetY: point.y - graph[id].y
    });

    setDidDrag(false);
  }

  function drag(e) {

    const point = getSVGPoint(e, svgRef, view);

    canvasMouseRef.current = point;

    if (selectionRect) {
      setSelectionRect(prev => ({
        ...prev,
        x1: point.x,
        y1: point.y
      }));
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
    else if (draginfo && interactivityMode === "DRAG") {

      setDidDrag(true);

      const point = getSVGPoint(e, svgRef, view);

      const newGraph = structuredClone(graph);

      newGraph[draginfo.gateId].x = point.x - draginfo.offsetX;

      newGraph[draginfo.gateId].y = point.y - draginfo.offsetY;

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
      if (copySelectMode) {
        finalizeCopySelection({
          rect: selectionRect,
          graph,
          clock_delays,
          isNodeFullyContained,
          setCopiedGraph,
          setCopiedClockDelays,
          setCopySelectMode,
          setSelectionRect
        });
      }
      else {
        finalizeSelection(selectionRect);
      }

      setSelectionRect(null);

      return;
    }
    if (e.button === 0 && opin) { // live wire + left click = add bend

      let point = getSVGPoint(e, svgRef, view);

      setWirePath(prev => [
        ...prev,
        { x: point.x, y: point.y }
      ]);

      // console.log("added point to live wire");
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

    const point = getSVGPoint(e, svgRef, view);

    canvasMouseRef.current = point;

    // COPY AREA MODE
    if (copySelectMode && e.button === 0) {

      setSelectionRect({
        x0: point.x,
        y0: point.y,
        x1: point.x,
        y1: point.y
      });

      return;
    }
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
    if (
      (interactivityMode === "PAN" && e.button === 0) ||
      (interactivityMode === "DRAG" && e.button === 1)
    ) {
      e.preventDefault();

      setPan({
        startX: e.clientX,
        startY: e.clientY,
        viewX: view.x,
        viewY: view.y
      });
    };


  }

  function addToUndoStack(graph, delays) {
    let newUndoStack = [...undoStack];
    const now = performance.now();
    newUndoStack.push({
      graph: structuredClone(graph),
      clock_delays: delays.map(clock => ({
        id: clock.id,
        delay: clock.delay,
        next_tick: now + clock.delay
      }))
    });
    // console.log(newUndoStack)
    setUndoStack(newUndoStack);
    setRedoStack([]);
  }

  function openDownloadDialog() {
    setDownloadFileName("circuit");
    setShowDownloadDialog(true);
  }



  function cancelDownload() {
    setShowDownloadDialog(false);
  }

  function resetView() {
    setView({ x: 0, y: 0, width: CONSTANTS.CANVAS_INITIAL_VIEW_WIDTH, height: CONSTANTS.CANVAS_INITIAL_VIEW_HEIGHT })

  }

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

  function beginCreateComponent() { //initialises and sets the creating mode
    setTempGraph([]);
    setComponentGraph([]);
    setComponentInputs([]);
    setComponentOutputs([]);
    setComponentName("");
    setInputOrder([]);
    setSelectMode(false);
    setSelectionRect(null);
    setCreatingComponent(!creatingComponent)
    // console.log("Starting component creation. Initial graph:")
    console.table(graph)
  }

  function PushToTempGraph() { // for manual one by one adding 

    if (creatingComponent && selectedGate) {

      const alreadyAdded = tempGraph.some(
        node => node.id === selectedGate.id
      );

      if (alreadyAdded) {
        // console.log("already added");
        return;
      }

      setTempGraph(prev => [
        ...prev,
        graph[selectedGate.id]
      ]);

    } else {
      // console.log("didnt select a gate. not adding to temp graph");
    }
  }

  function abstractGraph(tempGraph) { //filters out wires and hence restores the connection of nodes, returns reindexed graph
    if (tempGraph.length === 0) return;

    let tempgraph = structuredClone(tempGraph)

    for (let node of tempgraph) {
      if (node.type === "INPUT" || node.type === "CLOCK") continue;
      for (let i = 0; i < node.inputs.length; i++) {
        let input = graph[node.inputs[i].id]; // its a node
        let index = node.inputs[i].index

        while (input.type === "WIRE") { //keep tracing wires until we find a non-wire node
          const wireInput = input.inputs[0];

          input = graph[wireInput.id];
          index = wireInput.index;
        }
        node.inputs[i] = { id: input.id, index: index };
      }
    }

    return compactAndReindex(tempgraph);
  }


  function findExtInputs(graph) {
    let inputs = [];
    for (let node of graph) {
      for (let i = 0; i < node.inputs.length; i++) {

        let input = node.inputs[i]; // {id: , index: }

        if (!input) continue;

        let source = graph[input.id]

        if (source.type === "INPUT") { //if the node is connected to a toggle

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

    // console.log("FinaliseComponentCreation called")

    // console.log("tempGraph = ")
    console.table(tempGraph)

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

    const nonWire = tempGraph.filter(n => n.type !== "WIRE");
    if (nonWire.length === 0) {
      alert("Only wires selected. A component must contain at least one gate.");
      return;
    }

    const hasNonBulb = nonWire.some(
      n => n.type !== "BULB" && n.type !== "INPUT" && n.type !== "CLOCK"
    );
    if (!hasNonBulb) {
      alert("Component must contain at least one logic gate (AND, OR, NOT, etc.).");
      return;
    }

    const [abstractedGraph, idMap] = abstractGraph(tempGraph);
    // console.log("Abstracted Graph = ")
    console.table(abstractedGraph)


    componentIdMapRef.current = idMap;
    // console.log("componentIdMapRef = ");
    console.table(componentIdMapRef.current)

    const inputs = findExtInputs(abstractedGraph);
    const outputs = findExtOutputs(abstractedGraph);

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
    setPinPhase("input");
    setSpecifyingInputs(true);
    setTempGraph([]);

    // console.log("ComponentGraph = ")
    console.table(componentGraph)
    // console.log("ComponentInputs = ")
    console.table(inputs)
    // console.log("ComponentOutputs = ")
    console.table(outputs)
    // console.log("InputOrder = ")
    console.table(uniqueInputSources)
    // console.log("Exiting FinaliseComponentCreation")


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

  function remapTimingSignals(idMap) {
    // console.log("onReindex here")
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

  function saveComponent(component) {
    if (!component) return;

    // Only serialize the component — not the whole customComponents array
    const payload = {
      kind: "gatesim-component",
      version: 1,
      component
    };

    const safeName = (component.name || "component").replace(/[^a-z0-9_\-]+/gi, "_");

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

        // console.log("✅ Component loaded:", incoming.name);

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

  const handleBeautify = () => {
    beautify({
      addToUndoStack,
      graph,
      clock_delays,
      setGraph
    })
  }
  const handleCommitDownload = () => {
    commitDownload(
      downloadFileName,
      graph,
      clock_delays,
      setShowDownloadDialog
    )
  }
  const handleLoadCircuit = (e) => {
    loadCircuit(
      e,
      resetTimingCapture,
      compactAndReindex,
      CONSTANTS,
      evaluate,
      setUndoStack,
      setRedoStack,
      setGraph,
      setClockDelays
    )
  }
  const handleUndo = () => {
    undo(
      undoStack,
      redoStack,
      graph,
      clock_delays,
      setSelectedGate,
      setSelectedWire,
      setGraph,
      setClockDelays,
      setUndoStack,
      setRedoStack
    )
  }
  const handleRedo = () => {
    redo(
      redoStack,
      undoStack,
      graph,
      clock_delays,
      setSelectedGate,
      setSelectedWire,
      setGraph,
      setClockDelays,
      setRedoStack,
      setUndoStack
    )
  }
  const handleTogglePauseSim = () => {
    togglePauseSim({
      pauseSim,
      setPauseSim,
      clockDelaysRef,
      setClockDelays,
      pausedClocksRef,
      setPausedClocks
    });
  };

  return (
    <div className="homepage">
      <TopBar
        logo={logo}
        showabout={showabout}
        openDownloadDialog={openDownloadDialog}
        fileInputRef={fileInputRef}
        setShowComponentIO={setShowComponentIO}
        undo={handleUndo}
        redo={handleRedo}
        clearGraph={clearGraph}
        setTempGraph={setTempGraph}
        setSelectedGate={setSelectedGate}
        beautify={handleBeautify}
        graph={graph}
        resetView={resetView}
        setTheme={setTheme}
        theme={theme}
        CONSTANTS={CONSTANTS}
        togglePauseSim={handleTogglePauseSim}
        pauseSim={pauseSim}
        RotateGate={RotateGate}
        showTutorial={showTutorial}
        creatingComponent={creatingComponent}
        beginCreateComponent={beginCreateComponent}
        PushToTempGraph={PushToTempGraph}
        toggleSelectMode={toggleSelectMode}
        selectMode={selectMode}
        FinaliseComponentCreation={FinaliseComponentCreation}
        setShowLearnSidebar={setShowLearnSidebar}
        showLearnSidebar={showLearnSidebar}
        setShowTimingDiagram={setShowTimingDiagram}
        showTimingDiagram={showTimingDiagram}
        setSelectMode={setSelectMode}
        setoPin={setoPin}
        setMouse={setMouse}
        setWirePath={setWirePath}
        setdraginfo={setdraginfo}
        setPan={setPan}
        setCopySelectMode={setCopySelectMode}
        loadCircuit={handleLoadCircuit}
        componentFileInputRef={componentFileInputRef}
        loadComponent={loadComponent}
        setInteractivityMode={setInteractivityMode}
        interactivityMode={interactivityMode}
      />

      <div className="tools-and-canvas">
        <ToolsBar
          inputGateRenderList={inputGateRenderList}
          twoInputGateRenderList={twoInputGateRenderList}
          threeInputGateRenderList={threeInputGateRenderList}
          fourInputGateRenderList={fourInputGateRenderList}
          sequentialGateRenderList={sequentialGateRenderList}
          MuxGateRenderList={MuxGateRenderList}
          AdderGateRenderList={AdderGateRenderList}
          outputGateRenderList={outputGateRenderList}
          customComponents={customComponents}
          Add={Add}
          GateCard={GateCard}
          RenderCUSTOM={RenderCUSTOM}
        />
        <div className="canvas-wrapper">
          <CanvasArea
            svgRef={svgRef}
            view={view}
            CONSTANTS={CONSTANTS}
            startPan={startPan}
            drag={drag}
            stopDrag={stopDrag}
            zoom={zoom}
            cancelWire={cancelWire}
            opin={opin}
            mouse={mouse}
            wirePath={wirePath}
            graph={graph}
            toggle={toggle}
            didDrag={didDrag}
            startDrag={startDrag}
            setoutputpin={setoutputpin}
            setinputpin={setinputpin}
            setSelectedGate={setSelectedGate}
            setSelectedWire={setSelectedWire}
            selectedGate={selectedGate}
            tempGraphIds={tempGraphIds}
            selectWire={selectWire}
            branchDots={branchDots}
            openTextEditor={openTextEditor}
            selectionRect={selectionRect}
            LiveWire={LiveWire}
            RenderUncommitedWire={RenderUncommitedWire}
            Gate={Gate}
            SelectionRectangle={SelectionRectangle}
            setEditingText={setEditingText}
          />
        </div>
      </div>
      {showAbout && <AboutModal onClose={closeAbout} />}
      {showDownloadDialog && <DownloadDialog
        cancelDownload={cancelDownload}
        downloadFileName={downloadFileName}
        setDownloadFileName={setDownloadFileName}
        commitDownload={handleCommitDownload}
      />}

      {showClockWindow && <ClockWindow
        setShowClockWindow={setShowClockWindow}
        Add={Add}
      />
      }

      {showComponentDialog && <ComponentDialog
        componentName={componentName}
        setComponentName={setComponentName}
        componentGraph={componentGraph}
        setComponentGraph={setComponentGraph}
        componentInputs={componentInputs}
        setComponentInputs={setComponentInputs}
        componentOutputs={componentOutputs}
        setComponentOutputs={setComponentOutputs}
        setShowComponentDialog={setShowComponentDialog}
        setCustomComponents={setCustomComponents}
      />}
      {specifyingInputs && <SpecifyInputsSidebar
        componentName={componentName}
        setComponentName={setComponentName}
        pinPhase={pinPhase}
        pinIndex={pinIndex}
        specifyingInputs={specifyingInputs}
        pinName={pinName}
        setPinName={setPinName}
        inputOrder={inputOrder}
        setInputOrder={setInputOrder}
        componentIdMapRef={componentIdMapRef}
        selectedGate={selectedGate}
        setSelectedGate={setSelectedGate}
        componentInputs={componentInputs}
        setComponentInputs={setComponentInputs}
        componentOutputs={componentOutputs}
        setComponentOutputs={setComponentOutputs}
        componentGraph={componentGraph}
        setComponentGraph={setComponentGraph}
        setCustomComponents={setCustomComponents}
        setPinPhase={setPinPhase}
        setPinIndex={setPinIndex}
        setSpecifyingInputs={setSpecifyingInputs}
        cancelComponentCreation={cancelComponentCreation}
      />}

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

      {editingText && <TextEditDialog
        editingText={editingText}
        setEditingText={setEditingText}
        commitTextEdit={() => commitTextEdit({
          editingText,
          setEditingText,
          graph,
          setGraph,
          clock_delays,
          addToUndoStack
        })}
        cancelTextEdit={() => cancelTextEdit(setEditingText)}
      />}

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
      {showLearnSidebar && <LearnSidebar onClose={() => setShowLearnSidebar(!showLearnSidebar)}></LearnSidebar>}
    </div>
  )
}

export default App;