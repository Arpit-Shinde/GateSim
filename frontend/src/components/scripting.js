// CodeSidebar.jsx
import {
    useRef,
    useState,
    useCallback,
    useEffect,
    memo
} from "react";

import * as CONSTANTS from "../constants/constants"

import { computeDeletion } from "../utils/deleteNode";
import { evaluate, propagate, sameBits } from "../utils/evaluate";
import { compactAndReindex } from "../utils/reindex";
import { outPinWidth, inPinWidth, BUS_BIT_SIZE as B } from "../utils/busUtils";

export const CodeSidebar = memo(function CodeSidebar({
    onClose,
    graphRef,
    Add,
    setGraph,
    setClockDelays,
    remapTimingSignals,
    clockDelaysRef,
    addToUndoStack
}) {
    const sidebarRef = useRef(null);
    const widthRef = useRef(480);
    const draggingRef = useRef(false);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);
    // Same helper used inside Gate.jsx
    function rotatePoint(localX, localY, rotationDeg) {
        const rad = (rotationDeg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return {
            x: localX * cos - localY * sin,
            y: localX * sin + localY * cos,
        };
    }

    /**
     * Local (unrotated) pin coordinates for a node.
     *  - `index` is the pin index within its group (inputs OR outputs)
     *  - `isOutput` selects which group
     */
    function getLocalPin(node, index, isOutput) {
        const C = CONSTANTS;
        const t = node.type;

        // ---- single-pin sources ----
        if (t === "INPUT" || t === "CLOCK") {
            if (!isOutput) return null;
            return { x: C.TOGGLE_WIDTH - C.INPUT_PIN_X - 25, y: C.TOGGLE_HEIGHT / 2 };
        }
        if (t === "BULB") {
            if (isOutput) return null;
            return { x: 0, y: C.GRID_SIZE };
        }

        // ---- 2-input gates ----
        if (t === "AND") {
            if (isOutput) return { x: C.GATE_WIDTH, y: C.OUTPUT_PIN_Y };
            return { x: 0, y: index === 0 ? C.TWO_INPUT_PIN_Y : C.TWO_INPUT_PIN_Y * 3 };
        }
        if (t === "OR" || t === "XOR") {
            if (isOutput) return { x: C.GATE_WIDTH, y: C.OUTPUT_PIN_Y };
            return { x: 0, y: index === 0 ? C.TWO_INPUT_PIN_Y : C.TWO_INPUT_PIN_Y * 3 };
        }
        if (t === "NAND" || t === "NOR" || t === "XNOR") {
            if (isOutput) return { x: C.GATE_WIDTH + C.GRID_SIZE, y: C.OUTPUT_PIN_Y };
            return { x: 0, y: index === 0 ? C.TWO_INPUT_PIN_Y : C.TWO_INPUT_PIN_Y * 3 };
        }
        if (t === "NOT") {
            if (isOutput) return { x: 3 * C.GATE_WIDTH / 4, y: C.OUTPUT_PIN_Y / 2 };
            return { x: 0, y: C.TWO_INPUT_PIN_Y };
        }

        // ---- 3-input gates ----
        if (t === "AND3" || t === "OR3" || t === "XOR3") {
            if (isOutput) return { x: C.GATE_WIDTH, y: C.OUTPUT_PIN_Y };
            const ys = [C.GRID_SIZE, C.GRID_SIZE * 2, C.GRID_SIZE * 3];
            return { x: 0, y: ys[index] };
        }
        if (t === "NAND3" || t === "NOR3" || t === "XNOR3") {
            if (isOutput) return { x: C.GATE_WIDTH + C.GRID_SIZE, y: C.OUTPUT_PIN_Y };
            const ys = [C.GRID_SIZE, C.GRID_SIZE * 2, C.GRID_SIZE * 3];
            return { x: 0, y: ys[index] };
        }

        // ---- 4-input gates ----
        if (t === "AND4" || t === "OR4" || t === "XOR4") {
            if (isOutput) return { x: C.GATE_WIDTH, y: C.OUTPUT_PIN_Y };
            const ys = [0, C.GATE_HEIGHT / 4, 3 * C.GATE_HEIGHT / 4, C.GATE_HEIGHT];
            return { x: 0, y: ys[index] };
        }
        if (t === "NAND4" || t === "NOR4" || t === "XNOR4") {
            if (isOutput) return { x: C.GATE_WIDTH + C.GRID_SIZE, y: C.OUTPUT_PIN_Y };
            const ys = [0, C.GATE_HEIGHT / 4, 3 * C.GATE_HEIGHT / 4, C.GATE_HEIGHT];
            return { x: 0, y: ys[index] };
        }

        // ---- muxes ----
        if (t === "MUX2") {
            if (isOutput) return { x: C.GATE_WIDTH - C.INPUT_PIN_X, y: C.OUTPUT_PIN_Y };
            const ys = [C.INPUT_PIN_Y_TOP, C.GATE_HEIGHT / 2, C.INPUT_PIN_Y_BOTTOM];
            return { x: C.INPUT_PIN_X, y: ys[index] };
        }
        if (t === "MUX4") {
            if (isOutput) return { x: C.GATE_WIDTH - C.INPUT_PIN_X, y: C.OUTPUT_PIN_Y };
            return { x: C.INPUT_PIN_X, y: (index * C.GATE_HEIGHT) / 5 };
        }

        // ---- adders / flip-flop ----
        if (t === "HALF_ADDER") {
            const ys = [C.INPUT_PIN_Y_TOP, C.INPUT_PIN_Y_BOTTOM];
            return {
                x: isOutput ? C.GATE_WIDTH - C.INPUT_PIN_X : C.INPUT_PIN_X,
                y: ys[index],
            };
        }
        if (t === "FULL_ADDER" || t === "JK") {
            if (isOutput) {
                const ys = [C.INPUT_PIN_Y_TOP, C.INPUT_PIN_Y_BOTTOM];
                return { x: C.GATE_WIDTH - C.INPUT_PIN_X, y: ys[index] };
            }
            const ys = [C.INPUT_PIN_Y_TOP, C.GATE_HEIGHT / 2, C.INPUT_PIN_Y_BOTTOM];
            return { x: C.INPUT_PIN_X, y: ys[index] };
        }

        // ---- custom component ----
        if (t === "CUSTOM") {
            const inputCount = node.inputs?.length ?? 0;
            const outputCount = node.ext_outputs?.length ?? node.value?.length ?? 0;

            const minGrids = Math.max(2, Math.ceil(C.GATE_HEIGHT / C.GRID_SIZE));
            const maxPins = Math.max(inputCount, outputCount, minGrids);

            const inOffset = Math.floor((maxPins - inputCount) / 2) * C.GRID_SIZE;
            const outOffset = Math.floor((maxPins - outputCount) / 2) * C.GRID_SIZE;

            // Width calculation — must match Gate.jsx exactly
            const inputPinNames = [];
            const seenSources = new Set();
            for (const entry of node.ext_inputs ?? []) {
                if (seenSources.has(entry.sourceId)) continue;
                seenSources.add(entry.sourceId);
                inputPinNames.push(entry.name ?? "");
            }

            const inputNames = Array.from({ length: inputCount }, (_, i) => {
                const name = inputPinNames[i] || `I${i}`;
                return name + ((node.inWidths?.[i] ?? 1) > 1 ? `[${node.inWidths[i]}]` : "");
            });

            const outputNames = Array.from({ length: outputCount }, (_, i) => {
                const name = node.ext_outputs?.[i]?.name ?? `O${i + 1}`;
                return name + ((node.outWidths?.[i] ?? 1) > 1 ? `[${node.outWidths[i]}]` : "");
            });

            const inputTextWidth = Math.max(0, ...inputNames.map(n => n.length * 6));
            const outputTextWidth = Math.max(0, ...outputNames.map(n => n.length * 6));
            const componentNameWidth = (node.name || "").length * 7.5;

            const requiredWidth = Math.max(
                C.MIN_CUSTOM_COMPONENT_WIDTH,
                inputTextWidth + outputTextWidth + 40,
                componentNameWidth + 40
            );
            const width = Math.ceil(requiredWidth / C.GRID_SIZE) * C.GRID_SIZE;

            if (isOutput) {
                return { x: width, y: outOffset + index * C.GRID_SIZE };
            }
            return { x: 0, y: inOffset + index * C.GRID_SIZE };
        }

        // ---- bus nodes ----
        if (t === "BUS_IN") {
            if (!isOutput) return null;
            return { x: node.width * B, y: B / 2 };
        }
        if (t === "BUS_OUT") {
            if (isOutput) return null;
            return { x: 0, y: B / 2 };
        }
        if (t === "SPLITTER") {
            if (isOutput) {
                return { x: C.GRID_SIZE * 2, y: index * C.GRID_SIZE };
            }
            const n = node.outWidths?.length ?? 0;
            const inY = Math.round((n - 1) / 2) * C.GRID_SIZE;
            return { x: 0, y: inY };
        }
        if (t === "JOINER") {
            if (isOutput) {
                const n = node.inWidths?.length ?? 0;
                const outY = Math.round((n - 1) / 2) * C.GRID_SIZE;
                return { x: C.GRID_SIZE * 2, y: outY };
            }
            return { x: 0, y: index * C.GRID_SIZE };
        }

        if (t === "CONSTANT") {
            if (!isOutput) return null;
            return { x: node.width * B, y: B / 2 };
        }

        return null;
    }
    function nodeById(graph, id) {
        if (!Array.isArray(graph)) return null;
        if (!Number.isInteger(id) || id < 0 || id >= graph.length) return null;
        return graph[id] ?? null;   // guards holes / null slots in the array
    }

    /**
     * World-space location of a pin.
     *
     * @param {number} id       - node id, looked up as graph[id]
     * @param {number} index    - pin index within the chosen group
     * @param {boolean} [isOutput=false] - true → output pins, false → input pins
     * @returns {{x:number, y:number} | null}
     */

    function getPinLocation(graph, id, index, isOutput = false) {
        const node = nodeById(graph, id);
        if (!node) return null;
        if (!Number.isInteger(index) || index < 0) return null;

        const local = getLocalPin(node, index, isOutput);
        if (!local) return null;

        const rot = node.rotation ?? 0;
        const p = rotatePoint(local.x, local.y, rot);
        return { x: node.x + p.x, y: node.y + p.y };
    }

    // stubs — wire these up later
    let [code, setCode] = useState(() => {
        return localStorage.getItem("gatesim-dev-code") || "";
    });

    useEffect(() => {
        localStorage.setItem("gatesim-dev-code", code);
    }, [code]);
    let [log, setLog] = useState(``);

    const onMouseDown = useCallback((e) => {
        draggingRef.current = true;
        startXRef.current = e.clientX;
        startWidthRef.current = widthRef.current;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "ew-resize";
    }, []);

    useEffect(() => {
        function onMouseMove(e) {
            if (!draggingRef.current) return;
            const delta = startXRef.current - e.clientX;
            let next = startWidthRef.current + delta;
            if (next < 320) next = 320;
            if (next > window.innerWidth - 200) next = window.innerWidth - 200;
            widthRef.current = next;
            if (sidebarRef.current) {
                sidebarRef.current.style.width = `${next}px`;
            }
        }
        function onMouseUp() {
            if (!draggingRef.current) return;
            draggingRef.current = false;
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);


    function add(type, x = null, y = null, busConfig = null) {
        Add(type, null, null, null, null, busConfig, x, y);
        return graphRef.current.length - 1;
    }

    function connect(id1, index1, id2, index2) {
        let p1 = getPinLocation(graphRef.current, id1, index1, true);
        let p2 = getPinLocation(graphRef.current, id2, index2, false);
        // console.log(x1,y1);
        Add("WIRE", { path: [{ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y }], inputId: id1, outputIndex: index1 }, { gateId: id2, gateIndex: index2 })

    }

    function remove(id) {
        const result = computeDeletion(graphRef.current, clockDelaysRef.current, id, {
            CONSTANTS, compactAndReindex, evaluate,
        });

        if (!result) return;
        addToUndoStack(graphRef.current, clockDelaysRef.current);
        remapTimingSignals(result.idMap);
        graphRef.current = result.graph;
        clockDelaysRef.current = result.clockDelays;
        setGraph(result.graph);
        setClockDelays(result.clockDelays);
    }

    function branchwire(id, x, y, id2, index2) {
        const graph = graphRef.current;

        const parent = nodeById(graph, id);
        if (!parent || parent.type !== "WIRE") {
            throw new Error(`branchwire: node ${id} is not a wire`);
        }

        const target = nodeById(graph, id2);
        if (!target) {
            throw new Error(`branchwire: node ${id2} does not exist`);
        }

        // Resolve the physical endpoint of the branch: the target pin's world position.
        const end = getPinLocation(graph, id2, index2, false);
        if (!end) {
            throw new Error(
                `branchwire: node ${id2} (${target.type}) has no input pin ${index2}`
            );
        }

        // Width compatibility — mirrors what setinputpin does for user drags.
        const srcW = outPinWidth(parent, 0);
        const dstW = inPinWidth(target, index2);
        if (srcW !== dstW) {
            throw new Error(
                `branchwire: cannot connect ${srcW}-bit signal to ${dstW}-bit pin ` +
                `(wire ${id} → node ${id2} pin ${index2})`
            );
        }

        Add(
            "WIRE",
            {
                // The branch physically starts at the user-supplied point on the parent wire.
                path: [{ x, y }, { x: end.x, y: end.y }],
                // Logical connection: this new wire is fed by the parent wire.
                inputId: id,
                outputIndex: 0,
            },
            {
                gateId: id2,
                gateIndex: index2,
            }
        );

        return graphRef.current.length - 1;
    }

    function get(id) {
        return nodeById(graphRef.current, id);
    }

    const update = (nodeId) => {
        const currentGraph = graphRef.current;
        propagate(currentGraph, nodeId);
        setGraph(structuredClone(currentGraph));
    };
    function generatewire(id, index, endx, endy) {
        const graph = graphRef.current;

        const node = nodeById(graph, id);
        if (!node) {
            throw new Error(`generatewire: node ${id} does not exist`);
        }

        const start = getPinLocation(graph, id, index, true);
        if (!start) {
            throw new Error(
                `generatewire: node ${id} (${node.type}) has no output pin ${index}`
            );
        }

        Add(
            "WIRE",
            {
                path: [
                    { x: start.x, y: start.y },
                    { x: endx, y: endy },
                ],
                inputId: id,
                outputIndex: index,
            }
        );

        return graphRef.current.length - 1;
    }
    function laywire(id, x1, y1, x2, y2) {
        const graph = graphRef.current;

        const parent = nodeById(graph, id);
        if (!parent || parent.type !== "WIRE") {
            throw new Error(`laywire: node ${id} is not a wire`);
        }

        Add(
            "WIRE",
            {
                path: [
                    { x: x1, y: y1 },
                    { x: x2, y: y2 },
                ],
                inputId: id,
                outputIndex: 0,
            }
        );

        return graphRef.current.length - 1;
    }

    function formatLog(value) {
        if (typeof value === "string") return value;

        if (value === undefined) return "undefined";
        if (value === null) return "null";

        if (typeof value === "object") {
            try {
                return JSON.stringify(value, null, 2);
            } catch {
                return String(value);
            }
        }

        return String(value);
    }

    function appendLog(...values) {
        const message = values.map(formatLog).join(" ");

        setLog(prev => prev + message + "\n");
    }


    function run() {
        // Clear previous execution output
        setLog("");

        const print = (...values) => {
            appendLog(...values);
        };

        const clearLog = () => {
            setLog("");
        };

        // Allow console.log(), console.warn(), etc. inside scripts
        const scriptConsole = {
            log: (...args) => appendLog(...args),
            info: (...args) => appendLog("[INFO]", ...args),
            warn: (...args) => appendLog("[WARN]", ...args),
            error: (...args) => appendLog("[ERROR]", ...args)
        };

        try {
            // 1. Snapshot values using the CURRENT graph before the script runs
            const oldValues = new Map();

            for (const node of graphRef.current) {
                if (!node) continue;
                oldValues.set(node.id, node.value ? [...node.value] : []);
            }



            // 2. Run user script
            const func = new Function(
                "graph",
                "add",
                "connect",
                "remove",
                "branchwire",
                "get",
                "update",
                "generatewire",
                "laywire",
                "print",
                "clearLog",
                "console",
                code
            );

            func(
                graphRef.current,
                add,
                connect,
                remove,
                branchwire,
                get,
                update,
                generatewire,
                laywire,
                print,
                clearLog,
                scriptConsole
            );

            // 3. FETCH THE LATEST GRAPH
            const currentGraph = graphRef.current;

            // 4. Find modified values and propagate
            for (const node of currentGraph) {
                if (!node) continue;

                const oldVal = oldValues.get(node.id) || [];
                const newVal = node.value || [];

                if (!sameBits(oldVal, newVal)) {
                    propagate(currentGraph, node.id);
                }
            }

            // 5. Commit final state
            setGraph(structuredClone(currentGraph));



        } catch (err) {
            appendLog("[ERROR]", err.stack || err.message || String(err));
            console.error(err);
        }
    }

    return (
        <div
            className="learn-sidebar"
            ref={sidebarRef}
            style={{ width: `${widthRef.current}px` }}
        >
            <div
                className="learn-resize-handle"
                onMouseDown={onMouseDown}
            />

            <div className="learn-header">
                <span className="learn-title">Code</span>
                <button className="learn-close" onClick={onClose}>
                    ✕
                </button>
            </div>

            {/* ---- code panel ---- */}
            <div className="code-panel">
                <div className="code-editor-row">
                    <textarea
                        className="code-editor"
                        spellCheck={false}
                        value={code}
                        onChange={(e) => { setCode(e.target.value) }}
                        onKeyDown={(e) => {
                            // Let the textarea fully own Ctrl/Cmd+C/V/X/A/Z etc.
                            if (e.ctrlKey || e.metaKey) {
                                e.stopPropagation();
                                return;
                            }

                            if (e.key === "Tab") {
                                e.preventDefault();

                                const textarea = e.target;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;

                                const tab = "    "; // 4 spaces

                                const newValue =
                                    code.substring(0, start) +
                                    tab +
                                    code.substring(end);

                                setCode(newValue);

                                // Restore cursor position after React updates
                                requestAnimationFrame(() => {
                                    textarea.selectionStart = textarea.selectionEnd =
                                        start + tab.length;
                                });
                            }
                        }}
                        onPaste={(e) => e.stopPropagation()}
                        onCopy={(e) => e.stopPropagation()}
                        onCut={(e) => e.stopPropagation()}
                    />
                    <button className="code-run-btn" onClick={run}>
                        ▶ Run
                    </button>
                </div>

                {/* ---- log window ---- */}
                <div className="code-log">
                    <div className="code-log-header">
                        <span>Output</span>
                        <button className="code-log-clear" onClick={() => setLog(``)}>
                            Clear
                        </button>
                    </div>
                    <pre className="code-log-body">
                        {log}
                    </pre>
                </div>
            </div>
        </div>
    );
});