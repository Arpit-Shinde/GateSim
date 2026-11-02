function GridLines({ view, CONSTANTS, gridSize = 20 }) {
  const { x, y, width, height } = view;

  // Snap to grid so lines don't "crawl" as you pan
  const startX = Math.floor(x / gridSize) * gridSize;
  const startY = Math.floor(y / gridSize) * gridSize;
  const endX   = x + width;
  const endY   = y + height;

  const verticals = [];
  for (let gx = startX; gx <= endX; gx += gridSize) {
    verticals.push(gx);
  }

  const horizontals = [];
  for (let gy = startY; gy <= endY; gy += gridSize) {
    horizontals.push(gy);
  }

  const stroke = CONSTANTS.GRID_COLOR ?? '#e0e0e0';
  const strokeWidth = CONSTANTS.GRID_STROKE_WIDTH ?? 0.5;

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
          x2={endX}   y2={gy}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
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
  setEditingText
}) {
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
        <GridLines view={view} CONSTANTS={CONSTANTS} gridSize={20} />
        
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
          ))}

        {selectionRect && (
          <SelectionRectangle selectionRect={selectionRect} />
        )}
      </svg>
    </div>
  );
}