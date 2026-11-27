import { useState, useEffect, memo } from "react";
import { busNodeSize } from "../utils/busUtils";

/* ───────── viewport culling helpers ───────── */

const MARGIN = 100;
const boxCache = new WeakMap(); // node object -> wire bbox (nodes are immutable now)

function wireBox(node) {
  let b = boxCache.get(node);
  if (b) return b;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of node.path ?? []) {
    if (p.x < x0) x0 = p.x;
    if (p.x > x1) x1 = p.x;
    if (p.y < y0) y0 = p.y;
    if (p.y > y1) y1 = p.y;
  }
  b = { x0, y0, x1, y1 };
  boxCache.set(node, b);
  return b;
}

function isVisible(node, vx0, vy0, vx1, vy1) {
  if (node.type === "WIRE") {
    const b = wireBox(node);
    if (b.x0 === Infinity) return true;
    return !(b.x1 < vx0 || b.x0 > vx1 || b.y1 < vy0 || b.y0 > vy1);
  }
  if (typeof node.x !== "number") return true;
  const dims = busNodeSize(node);
  const pad = dims ? Math.max(dims.w, dims.h) + 60 : 500;
  return (
    node.x > vx0 - pad && node.x < vx1 + pad &&
    node.y > vy0 - pad && node.y < vy1 + pad
  );
}

/* ───────── memoized node renderer ───────── */

const GateItem = memo(
  function GateItem({
    node, isSelected, Gate, toggle, didDrag, startDrag,
    setoutputpin, setinputpin, setSelectedGate, setSelectedWire,
    selectWire, openTextEditor, setEditingText, onHoverNode, onEditConstant
  }) {
    return (
      <g
        onMouseEnter={() => onHoverNode && onHoverNode(node.id)}
        onMouseLeave={() => onHoverNode && onHoverNode(null)}
      >
        <Gate
          node={node}
          toggle={toggle}
          didDrag={didDrag}
          startDrag={startDrag}
          setoutputpin={setoutputpin}
          setinputpin={setinputpin}
          setSelectedGate={setSelectedGate}
          setSelectedWire={setSelectedWire}
          isSelected={isSelected}
          selectWire={selectWire}
          onEditText={openTextEditor}
          setEditingText={setEditingText}
          onEditConstant={onEditConstant}
        />
      </g>
    );
  },
  // Handlers are stable (see App), so only these two can change what's drawn.
  (a, b) => a.node === b.node && a.isSelected === b.isSelected
);

/* ───────── grid ───────── */

function GridLines({ view, CONSTANTS, gridSize, pxWidth }) {
  const { x, y, width, height } = view;

  const screenScale = pxWidth && width ? pxWidth / width : 1;
  const pxPerCell = gridSize * screenScale;

  // Zoomed far out: lines would be a blur and cost thousands of DOM nodes.
  if (pxPerCell < 4) return null;

  const startX = Math.floor(x / gridSize) * gridSize;
  const startY = Math.floor(y / gridSize) * gridSize;
  const endX = x + width;
  const endY = y + height;

  const verticals = [];
  for (let gx = startX; gx <= endX; gx += gridSize) verticals.push(gx);

  const horizontals = [];
  for (let gy = startY; gy <= endY; gy += gridSize) horizontals.push(gy);

  const stroke = CONSTANTS.GRID_COLOR ?? "#e0e0e0";
  const strokeWidth = CONSTANTS.GRID_STROKE_WIDTH ?? 0.5;

  const N = Math.max(1, Math.round(70 / Math.max(pxPerCell, 1e-6)));
  const labelStep = N * gridSize;
  const fontSize = 10 / Math.max(screenScale, 1e-6);
  const pad = 6 / Math.max(screenScale, 1e-6);

  const xLabels = [];
  for (let lx = Math.ceil(x / labelStep) * labelStep; lx <= endX; lx += labelStep) xLabels.push(lx);
  const yLabels = [];
  for (let ly = Math.ceil(y / labelStep) * labelStep; ly <= endY; ly += labelStep) yLabels.push(ly);

  const labelColor = "rgb(111, 111, 111)";

  return (
    <g pointerEvents="none">
      {verticals.map((gx) => (
        <line key={`v-${gx}`} x1={gx} y1={startY} x2={gx} y2={endY} stroke={stroke} strokeWidth={strokeWidth} />
      ))}
      {horizontals.map((gy) => (
        <line key={`h-${gy}`} x1={startX} y1={gy} x2={endX} y2={gy} stroke={stroke} strokeWidth={strokeWidth} />
      ))}
      {xLabels.map((lx) => (
        <text key={`lx-${lx}`} x={lx} y={endY - pad} textAnchor="middle" fontFamily="monospace" fontSize={fontSize} fill={labelColor}>
          {lx}
        </text>
      ))}
      {yLabels.map((ly) => (
        <text key={`ly-${ly}`} x={x + pad} y={ly + fontSize * 0.35} textAnchor="start" fontFamily="monospace" fontSize={fontSize} fill={labelColor}>
          {ly}
        </text>
      ))}
    </g>
  );
}

/* ───────── canvas ───────── */

export function CanvasArea({
  svgRef,
  view,
  CONSTANTS,
  startPan,
  drag,
  stopDrag,
  zoom,
  cancelWire,
  opin,
  mouse,
  wirePath,
  graph,
  toggle,
  didDrag,
  startDrag,
  setoutputpin,
  setinputpin,
  setSelectedGate,
  setSelectedWire,
  selectedGate,
  tempGraphIds,
  selectWire,
  branchDots,
  openTextEditor,
  selectionRect,
  LiveWire,
  RenderUncommitedWire,
  Gate,
  SelectionRectangle,
  setEditingText,
  onHoverNode,
  onEditConstant
}) {
  const [svgWidth, setSvgWidth] = useState(0);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const measure = () => setSvgWidth(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [svgRef]);

  // visible region (with margin)
  const vx0 = view.x - MARGIN;
  const vy0 = view.y - MARGIN;
  const vx1 = view.x + view.width + MARGIN;
  const vy1 = view.y + view.height + MARGIN;

  const wires = [];
  const gates = [];
  for (const node of graph) {
    const sel = selectedGate?.id === node.id || tempGraphIds.has(node.id);
    if (!sel && !isVisible(node, vx0, vy0, vx1, vy1)) continue;
    (node.type === "WIRE" ? wires : gates).push({ node, sel });
  }
  gates.sort((a, b) => (a.node.z ?? 0) - (b.node.z ?? 0));

  const itemProps = {
    Gate, toggle, didDrag, startDrag, setoutputpin, setinputpin,
    setSelectedGate, setSelectedWire, selectWire, openTextEditor,
    setEditingText, onHoverNode, onEditConstant
  };

  return (
    <div className="canvas">
      <svg
        width="100%"
        height="100%"
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
        style={{
          backgroundColor: CONSTANTS.CANVAS_BACKGROUND,
          border: "2px solid #4a5568",
          boxSizing: "border-box"
        }}
        onMouseDown={startPan}
        onMouseMove={drag}
        onMouseUp={stopDrag}
        onWheel={zoom}
        onContextMenu={cancelWire}
      >
        <GridLines view={view} CONSTANTS={CONSTANTS} gridSize={CONSTANTS.GRID_SIZE} pxWidth={svgWidth} />

        {opin && mouse && (
          <LiveWire
            start={[opin.pinX, opin.pinY]}
            end={[mouse.x, mouse.y]}
            color={CONSTANTS.WIRE_COLOR}
            strokeWidth={CONSTANTS.WIRE_STROKE_WIDTH}
          />
        )}

        {opin && <RenderUncommitedWire path={wirePath} />}

        {/* LAYER 1: WIRES */}
        {wires.map(({ node, sel }) => (
          <GateItem key={node.id} node={node} isSelected={sel} {...itemProps} />
        ))}

        {branchDots.map((point, i) =>
          point.x < vx0 || point.x > vx1 || point.y < vy0 || point.y > vy1 ? null : (
            <circle
              key={`branch-dot-${i}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={point.value ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_STROKE_COLOR}
              pointerEvents="none"
            />
          )
        )}

        {/* LAYER 2: GATES */}
        {gates.map(({ node, sel }) => (
          <GateItem key={node.id} node={node} isSelected={sel} {...itemProps} />
        ))}

        {selectionRect && <SelectionRectangle selectionRect={selectionRect} />}
      </svg>
    </div>
  );
}