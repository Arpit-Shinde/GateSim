import { useState, useEffect } from "react";

function GridLines({ view, CONSTANTS, gridSize, pxWidth }) {
  const { x, y, width, height } = view;

  // ── existing grid lines (unchanged) ──
  const startX = Math.floor(x / gridSize) * gridSize;
  const startY = Math.floor(y / gridSize) * gridSize;
  const endX = x + width;
  const endY = y + height;

  const verticals = [];
  for (let gx = startX; gx <= endX; gx += gridSize) verticals.push(gx);

  const horizontals = [];
  for (let gy = startY; gy <= endY; gy += gridSize) horizontals.push(gy);

  const stroke = "red";
  const strokeWidth = CONSTANTS.GRID_STROKE_WIDTH ?? 0.5;

  // ── axis labels ──

  // screen px per world unit (fallback: 1 before first measure)
  const screenScale = pxWidth && width ? pxWidth / width : 1;

  // aim for ~70 screen px between labels, snapped to a multiple of gridSize
  const pxPerCell = gridSize * screenScale;
  const N = Math.max(1, Math.round(70 / Math.max(pxPerCell, 1e-6)));
  const labelStep = N * gridSize;

  // 10 screen px font, 6 screen px inset from the edge
  const fontSize = 10 / Math.max(screenScale, 1e-6);
  const pad = 6 / Math.max(screenScale, 1e-6);

  const xLabels = [];
  for (let lx = Math.ceil(x / labelStep) * labelStep; lx <= endX; lx += labelStep) {
    xLabels.push(lx);
  }
  const yLabels = [];
  for (let ly = Math.ceil(y / labelStep) * labelStep; ly <= endY; ly += labelStep) {
    yLabels.push(ly);
  }

  const labelColor = "rgb(111, 111, 111)";

  return (
    <g pointerEvents="none">
      {verticals.map((gx) => (
        <line
          key={`v-${gx}`}
          x1={gx} y1={startY}
          x2={gx} y2={endY}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
      {horizontals.map((gy) => (
        <line
          key={`h-${gy}`}
          x1={startX} y1={gy}
          x2={endX} y2={gy}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}

      {/* x-axis labels along the bottom of the view */}
      {xLabels.map((lx) => (
        <text
          key={`lx-${lx}`}
          x={lx}
          y={endY - pad}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={fontSize}
          fill={labelColor}
        >
          {lx}
        </text>
      ))}

      {/* y-axis labels along the left of the view */}
      {yLabels.map((ly) => (
        <text
          key={`ly-${ly}`}
          x={x + pad}
          y={ly + fontSize * 0.35}
          textAnchor="start"
          fontFamily="monospace"
          fontSize={fontSize}
          fill={labelColor}
        >
          {ly}
        </text>
      ))}
    </g>
  );
}

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
  onHoverNode
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

  const hoverProps = (id) => ({
    onMouseEnter: () => onHoverNode && onHoverNode(id),
    onMouseLeave: () => onHoverNode && onHoverNode(null)
  });
  return (

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
        <GridLines view={view} CONSTANTS={CONSTANTS} gridSize={CONSTANTS.GRID_SIZE} pxWidth={svgWidth} />
        
        {opin && (
          <LiveWire
            start={[opin.pinX, opin.pinY]}
            end={[mouse.x, mouse.y]}
            color={CONSTANTS.WIRE_COLOR}
            strokeWidth={CONSTANTS.WIRE_STROKE_WIDTH}
          />
        )}

        {opin && (
          <RenderUncommitedWire path={wirePath} />
        )}

        {/*LAYER 1: WIRES (rendered first, behind gates)*/}
        {graph
          .filter((node) => node.type === "WIRE")
          .map((node) => (
            <g key = {node.id} {...hoverProps(node.id)}>
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
              isSelected={
                selectedGate?.id === node.id || tempGraphIds.has(node.id)
              }
              path={node.path}
              selectWire={selectWire}
            />
            </g>
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

        {/*LAYER 2: GATES (rendered second, on top of wires)*/}
        {graph
          .filter((node) => node.type !== "WIRE")
          .sort((a, b) => a.z - b.z)
          .map((node) => (
            <g key={node.id} {...hoverProps(node.id)}>
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
              isSelected={
                selectedGate?.id === node.id || tempGraphIds.has(node.id)
              }
              onEditText={openTextEditor}
              setEditingText={setEditingText}
            />
            </g>
          ))}

        {selectionRect && (
          <SelectionRectangle selectionRect={selectionRect} />
        )}
      </svg>
    </div>
  );
}