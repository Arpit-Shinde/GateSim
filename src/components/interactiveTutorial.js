import { useEffect, useRef, useState } from "react";

/* ───────────── helpers ───────────── */

const nodeAt = (g, id) => g[id] ?? g.find((n) => n.id === id);
const count = (g, type) => g.filter((n) => n.type === type).length;

// follow wires back to the real source node
function traceSource(g, input) {
  let cur = input;
  const seen = new Set();
  while (cur && cur.id !== -1 && cur.index !== -1 && !seen.has(cur.id)) {
    seen.add(cur.id);
    const n = nodeAt(g, cur.id);
    if (!n) return null;
    if (n.type !== "WIRE") return n;
    cur = n.inputs?.[0];
  }
  return null;
}

// number of input pins of dstType gates that are fed (through wires) by srcType
function linked(g, srcType, dstType) {
  let c = 0;
  for (const n of g) {
    if (n.type !== dstType) continue;
    for (const inp of n.inputs ?? []) {
      if (traceSource(g, inp)?.type === srcType) c++;
    }
  }
  return c;
}

// find a DOM element: {sel, text?}
function findEl(t) {
  if (!t) return null;
  const list = [...document.querySelectorAll(t.sel)];
  if (!t.text) return list[0] ?? null;
  return (
    list.find(
      (e) => e.textContent.trim().toUpperCase() === t.text.toUpperCase()
    ) ?? null
  );
}

const TOOL = (text) => ({ sel: ".toolsBar summary", text });
const MENU = (text) => ({ sel: ".utilities-menu > summary", text });
const BTN = (text) => ({ sel: ".utilities-button", text });
const CARD = (type) => ({ sel: `[data-tut="card-${type}"]` });
const CANVAS = { sel: ".canvas" };

/* ───────────── steps ─────────────
   target : element to spotlight
   open   : <details> summaries to open for this step
   check  : (graph) => bool  → action step, auto-advances when true
   guard  : if true, tutorial jumps back here when check() becomes false
   status : (graph) => string shown while waiting
*/
const STEPS = [
  {
    id: "welcome",
    title: "Welcome to GateSim ",
    text: "This walkthrough builds a real circuit: two switches, an AND gate and a bulb. You'll do every click yourself, and I'll check your work as you go.",
  },
  {
    id: "toolsbar",
    title: "The tools bar",
    target: { sel: ".toolsBar" },
    text: "Everything you can place lives here: inputs, gates, flip-flops, multiplexers, adders, outputs, labels and your own custom components.",
  },
  {
    id: "addToggles",
    title: "Add two toggles",
    target: CARD("INPUT"),
    open: [TOOL("Input")],
    text: "Click the INPUT card twice. Each click drops a toggle switch in the middle of the canvas.",
    check: (g) => count(g, "INPUT") >= 2,
    guard: true,
    status: (g) => `Toggles on canvas: ${count(g, "INPUT")}/2`,
  },
  {
    id: "addAnd",
    title: "Add an AND gate",
    target: CARD("AND"),
    open: [TOOL("Gates"), TOOL("2-INPUT")],
    text: "Open Gates → 2-INPUT and click the AND card.",
    check: (g) => count(g, "AND") >= 1,
    guard: true,
    status: (g) => `AND gates on canvas: ${count(g, "AND")}/1`,
  },
  {
    id: "addBulb",
    title: "Add a bulb",
    target: CARD("BULB"),
    open: [TOOL("Output")],
    text: "Open Output and click the BULB card. The bulb will show the result.",
    check: (g) => count(g, "BULB") >= 1,
    guard: true,
    status: (g) => `Bulbs on canvas: ${count(g, "BULB")}/1`,
  },
  {
    id: "arrange",
    title: "Arrange them",
    target: CANVAS,
    text: "New parts appear stacked near the centre. Drag each one by its body: toggles on the left, the AND gate in the middle, the bulb on the right. Click Next when there's room between them.",
  },
  {
    id: "wireToggles",
    title: "Wire the toggles to the AND gate",
    target: CANVAS,
    text: "Click the small circle on the right of a toggle (its output pin). A wire follows your mouse. Click empty canvas to add bends, then click an input pin on the AND gate to finish. Right-click to cancel a wire in mid-air. Do this for both toggles, using different input pins.",
    check: (g) => linked(g, "INPUT", "AND") >= 2,
    guard: true,
    status: (g) => `Toggle → AND connections: ${Math.min(linked(g, "INPUT", "AND"), 2)}/2`,
  },
  {
    id: "wireBulb",
    title: "Wire the AND gate to the bulb",
    target: CANVAS,
    text: "Same idea: click the AND gate's output pin, then click the bulb's input pin.",
    check: (g) => linked(g, "AND", "BULB") >= 1,
    guard: true,
    status: (g) => `AND → bulb connections: ${linked(g, "AND", "BULB")}/1`,
  },
  {
    id: "lightUp",
    title: "Light the bulb!",
    target: CANVAS,
    text: "Click a toggle to flip it on or off. An AND gate outputs 1 only when both inputs are 1, so turn both toggles on.",
    check: (g) => g.some((n) => n.type === "BULB" && n.value?.[0]),
    guard: true,
    status: () => "Waiting for the bulb to light up…",
  },
  {
    id: "truth",
    title: "Nice, that's a working circuit",
    target: CANVAS,
    text: "Switch one toggle off and watch the bulb go dark. Try all four combinations: that's the AND truth table. Then click Next.",
  },
  {
    id: "panzoom",
    title: "Moving around",
    target: CANVAS,
    text: "Scroll the wheel to zoom at the cursor. Pan by dragging with the middle mouse button (or switch the interaction mode to PAN in the top bar). VIEW → RESET VIEW brings you back.",
  },
  {
    id: "delete",
    title: "Selecting & deleting",
    target: CANVAS,
    text: "Click a gate to select it (it glows), then press Delete to remove it along with its wires. Wires are selected with the middle mouse button. ROTATE in the TOOLS menu turns the selected gate. Everything is undoable.",
  },
  {
    id: "file",
    title: "FILE menu",
    target: MENU("FILE"),
    open: [MENU("FILE")],
    text: "Download your circuit as a .json file, load one back, or manage your custom components.",
  },
  {
    id: "edit",
    title: "EDIT menu",
    target: MENU("EDIT"),
    open: [MENU("EDIT")],
    text: "Undo/redo, clear the canvas, deselect everything, and BEAUTIFY, which straightens your wires into neat horizontal and vertical lines.",
  },
  {
    id: "view",
    title: "VIEW menu",
    target: MENU("VIEW"),
    open: [MENU("VIEW")],
    text: "Reset the camera or toggle between light and dark themes.",
  },
  {
    id: "clock",
    title: "Clocks",
    target: CARD("CLOCK"),
    open: [TOOL("Input")],
    text: "A CLOCK is a switch that flips by itself. Click it, enter a delay in ms, and it ticks forever. Pause or resume every clock from the SIMULATION menu.",
  },
  {
    id: "more",
    title: "More building blocks",
    target: { sel: ".toolsBar" },
    text: "Sequential has the JK flip-flop. Combinational has multiplexers and half/full adders. Gates also come in 3- and 4-input versions.",
  },
  {
    id: "label",
    title: "Labels",
    target: { sel: ".toolsBar .toolButton", text: "LABEL" },
    text: "Add text labels to document your circuit. Double-click a label to edit it.",
  },
  {
    id: "copy",
    title: "Copy area",
    target: BTN("COPY AREA"),
    text: "Click COPY AREA, drag a rectangle around part of your circuit, then move the mouse where you want it and press Ctrl+V to paste.",
  },
  {
    id: "component",
    title: "Create your own components",
    target: BTN("CREATE COMPONENT"),
    text: "Build a circuit with toggles as inputs and bulbs as outputs. Click CREATE COMPONENT, select everything (SELECT MODE, or ADD one by one), then DONE. Name it, pick each toggle/bulb in order to name its pins, and click DONE again.",
  },
  {
    id: "custom",
    title: "Your components",
    target: TOOL("Custom"),
    open: [TOOL("Custom")],
    text: "Finished components appear here and can be placed like any gate. You can even nest them inside other components.",
  },
  {
    id: "timing",
    title: "Timing diagram",
    target: BTN("TIMING DIAGRAM"),
    text: "Select a gate, ADD SIGNAL, then START to record waveforms: perfect for watching clocks and flip-flops.",
  },
  {
    id: "learn",
    title: "Self-learn guide",
    target: BTN("SELF-LEARN"),
    text: "Stuck on the theory? The guide explains the logic gates, truth tables and more.",
  },
  {
    id: "done",
    title: "You're ready!",
    text: "That's the whole tour. Experiment freely. Undo has your back. You can restart this walkthrough any time from TUTORIAL.",
  },
];

const LAST_GUARD = STEPS.findIndex((s) => s.id === "lightUp");
const TIP_W = 340;

function place(rect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!rect) return { left: (vw - TIP_W) / 2, top: vh / 3 };
  if (rect.top < 100 && rect.height < 80) {
    return {
      left: Math.min(Math.max(rect.left, 8), vw - TIP_W - 8),
      top: rect.bottom + 14,
    };
  }
  if (rect.width > 500) {
    // big target (canvas): tuck the card into its bottom-right corner
    return {
      right: Math.max(16, vw - Math.min(rect.right, vw) + 16),
      bottom: Math.max(16, vh - Math.min(rect.bottom, vh) + 16),
    };
  }
  return {
    left: Math.min(rect.right + 16, vw - TIP_W - 8),
    top: Math.min(Math.max(rect.top - 8, 8), vh - 300),
  };
}

/* ───────────── component ───────────── */

export function InteractiveTutorial({ graph, onClose }) {
  const [idx, setIdx] = useState(0);
  const [notice, setNotice] = useState("");
  const [rect, setRect] = useState(null);
  const skipped = useRef(new Set());

  const step = STEPS[idx];
  const isAction = !!step.check;
  const isLast = idx === STEPS.length - 1;

  // 1) retry logic + auto-advance
  useEffect(() => {
    if (idx <= LAST_GUARD) {
      for (let j = 0; j < idx; j++) {
        const s = STEPS[j];
        if (s.guard && !skipped.current.has(j) && !s.check(graph)) {
          setNotice(`Something changed. "${s.title}" isn't satisfied anymore, so let's redo it.`);
          setIdx(j);
          return;
        }
      }
    }
    if (step.check && step.check(graph)) {
      setNotice("");
      setIdx((i) => Math.min(i + 1, STEPS.length - 1));
    }
  }, [graph, idx]); // eslint-disable-line

  // 2) open the <details> this step needs, close them when leaving
  useEffect(() => {
    const opened = [];
    for (const t of step.open ?? []) {
      const d = findEl(t)?.closest("details");
      if (d && !d.open) {
        d.open = true;
        opened.push(d);
      }
    }
    return () => opened.forEach((d) => (d.open = false));
  }, [idx]); // eslint-disable-line

  // 3) keep the spotlight glued to its target
  useEffect(() => {
    const tick = () => {
      const el = findEl(step.target);
      if (!el) return setRect(null);
      const r = el.getBoundingClientRect();
      setRect((p) =>
        p && p.left === r.left && p.top === r.top && p.width === r.width && p.height === r.height
          ? p
          : { left: r.left, top: r.top, width: r.width, height: r.height, right: r.right, bottom: r.bottom }
      );
    };
    tick();
    const id = setInterval(tick, 150);
    window.addEventListener("resize", tick);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", tick);
    };
  }, [idx]); // eslint-disable-line

  function next() {
    if (isLast) return onClose();
    if (isAction) skipped.current.add(idx);
    setNotice("");
    setIdx(idx + 1);
  }

  function back() {
    // go to the previous *info* step (action steps would just auto-advance again)
    for (let j = idx - 1; j >= 0; j--) {
      if (!STEPS[j].check) {
        setNotice("");
        setIdx(j);
        return;
      }
    }
  }

  const canGoBack = STEPS.slice(0, idx).some((s) => !s.check);
  const pos = place(rect);

  const btn = {
    padding: "7px 14px",
    borderRadius: 6,
    border: "1px solid #4a5568",
    background: "#2d3748",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: 13,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, pointerEvents: "none" }}>
      {/* dim everything except the target; never blocks clicks */}
      {rect ? (
        <div
          style={{
            position: "fixed",
            left: rect.left - 6,
            top: rect.top - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            borderRadius: 8,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 3px #4299e1",
            transition: "all 0.2s ease",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)" }} />
      )}

      <div
        style={{
          position: "fixed",
          width: TIP_W,
          boxSizing: "border-box",
          padding: 16,
          background: "#1a1d23",
          color: "#e2e8f0",
          border: "1px solid #4a5568",
          borderRadius: 10,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          pointerEvents: "auto",
          fontSize: 14,
          lineHeight: 1.5,
          ...pos,
        }}
      >
        <div style={{ fontSize: 11, color: "#718096", marginBottom: 4 }}>
          Step {idx + 1} / {STEPS.length}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{step.title}</div>

        {notice && (
          <div style={{ color: "#f6ad55", marginBottom: 8, fontSize: 13 }}>⚠ {notice}</div>
        )}

        <div style={{ color: "#cbd5e0" }}>{step.text}</div>

        {isAction && (
          <div style={{ marginTop: 10, color: "#68d391", fontSize: 13 }}>
            ⏳ {step.status?.(graph) ?? "Waiting for you…"}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
          <button style={{ ...btn, background: "transparent", color: "#a0aec0" }} onClick={onClose}>
            Exit
          </button>
          <div style={{ flex: 1 }} />
          {canGoBack && (
            <button style={btn} onClick={back}>
              Back
            </button>
          )}
          <button
            style={isAction ? btn : { ...btn, background: "#d3d3d3", borderColor: "#d3d3d3", color: "#262626" }}
            onClick={next}
          >
            {isLast ? "Finish" : isAction ? "Skip step" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}