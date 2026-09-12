import * as CONSTANTS from "../constants/constants";

const r = CONSTANTS.GATE_HEIGHT / 2;

function rotatePoint(localX, localY, rotationDeg) {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: localX * cos - localY * sin,
    y: localX * sin + localY * cos
  };
}

export const and_path = `
  M 0 0
  H ${CONSTANTS.GATE_WIDTH - r}
  A ${r} ${r} 0 0 1 ${CONSTANTS.GATE_WIDTH} ${r}
  A ${r} ${r} 0 0 1 ${CONSTANTS.GATE_WIDTH - r} ${CONSTANTS.GATE_HEIGHT}
  H 0
  Z
`;

export const bulb_path = `
  M 0 ${CONSTANTS.BULB_WIDTH}
  V ${CONSTANTS.BULB_WIDTH / 2}
  A ${CONSTANTS.BULB_WIDTH / 2} ${CONSTANTS.BULB_WIDTH / 2} 0 0 1 ${CONSTANTS.BULB_WIDTH} ${CONSTANTS.BULB_WIDTH / 2}
  V ${CONSTANTS.BULB_WIDTH}
  Z
`;

export const nand_path = `
  M 0 0
  H ${CONSTANTS.GATE_WIDTH - (CONSTANTS.GATE_HEIGHT / 2) - 8}
  A ${CONSTANTS.GATE_HEIGHT / 2} ${CONSTANTS.GATE_HEIGHT / 2} 0 0 1 ${CONSTANTS.GATE_WIDTH - 8} ${CONSTANTS.GATE_HEIGHT / 2}
  A ${CONSTANTS.GATE_HEIGHT / 2} ${CONSTANTS.GATE_HEIGHT / 2} 0 0 1 ${CONSTANTS.GATE_WIDTH - (CONSTANTS.GATE_HEIGHT / 2) - 8} ${CONSTANTS.GATE_HEIGHT}
  H 0
  Z
`;

export const or_path = `
  M 0 0
  H ${CONSTANTS.GATE_WIDTH * 0.4}
  C ${CONSTANTS.GATE_WIDTH * 0.8} 0, ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.2}, ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.5}
  C ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.8}, ${CONSTANTS.GATE_WIDTH * 0.8} ${CONSTANTS.GATE_HEIGHT}, ${CONSTANTS.GATE_WIDTH * 0.4} ${CONSTANTS.GATE_HEIGHT}
  H 0
  Q ${CONSTANTS.GATE_WIDTH * 0.3} ${CONSTANTS.GATE_HEIGHT * 0.5}, 0 0
  Z
`;

export const not_path = `
  M 0 0
  L ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.5}
  L 0 ${CONSTANTS.GATE_HEIGHT}
  Z
`;

export const xor_extra_curve_path = `
  M ${CONSTANTS.GATE_WIDTH * -0.08} 0
  Q ${CONSTANTS.GATE_WIDTH * 0.17} ${CONSTANTS.GATE_HEIGHT * 0.5}, ${CONSTANTS.GATE_WIDTH * -0.08} ${CONSTANTS.GATE_HEIGHT}
`;


export function Gate({ node, toggle, didDrag, startDrag, setoutputpin, setinputpin, setSelectedGate, isSelected, selectWire = null }) {

  const gateClass = `actual-gate ${isSelected ? 'selected-gate' : ''}`;
  const rot = node.rotation ?? 0;

  // Convert a local pin coordinate into world space using the node's rotation.
  const outPos = (localX, localY) => {
    const p = rotatePoint(localX, localY, rot);
    return { x: node.x + p.x, y: node.y + p.y };
  };

  if (node.type === "WIRE") {
    const path = node.path
      .map((point, i) =>
        `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`
      )
      .join(" ");

    return (
      <g className={gateClass}>
        <path
          d={path}
          stroke={node.value[0] ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.WIRE_COLOR}
          strokeWidth={CONSTANTS.WIRE_STROKE_WIDTH}
          fill="none"
          className={gateClass}
          style={{ pointerEvents: "stroke" }}
          onMouseDown={(e) => {
            e.stopPropagation();
            selectWire(e, node.id)
          }}
        />
      </g>
    );
  }

  else if (node.type === "INPUT") {
    const localX = CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X;
    const localY = CONSTANTS.TOGGLE_HEIGHT / 2;

    return (
      <g
        transform={`translate(${node.x}, ${node.y}) rotate(${rot})`}
        className={gateClass}
        onClick={() => {
          setSelectedGate({ id: node.id })
          return true
        }}
      >
        <line
          x1={CONSTANTS.TOGGLE_WIDTH}
          y1={CONSTANTS.TOGGLE_HEIGHT / 2}
          x2={CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.TOGGLE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <rect
          width={CONSTANTS.TOGGLE_WIDTH}
          height={CONSTANTS.TOGGLE_HEIGHT}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
        />

        <rect
          x={CONSTANTS.TOGGLE_WIDTH / 4}
          y={CONSTANTS.TOGGLE_HEIGHT / 4}
          width={CONSTANTS.TOGGLE_WIDTH / 2}
          height={CONSTANTS.TOGGLE_HEIGHT / 2}
          fill={node.value[0] ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          rx={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
          ry={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        />

        <circle
          cx={node.value[0] ? 3 * CONSTANTS.TOGGLE_WIDTH / 4 - CONSTANTS.TOGGLE_CAPSULE_RADIUS : CONSTANTS.TOGGLE_WIDTH / 4 + CONSTANTS.TOGGLE_CAPSULE_RADIUS}
          cy={CONSTANTS.TOGGLE_HEIGHT / 2}
          r={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onMouseUp={() => {
            if (!didDrag) toggle(node.id);
          }}
        />

        <circle
          className="pin"
          onClick={() => {
            const p = outPos(localX, localY);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={localX}
          cy={localY}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    );
  }

  else if (node.type === "BULB") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={CONSTANTS.BULB_PIN_X}
          y1={CONSTANTS.BULB_PIN_Y}
          x2={CONSTANTS.BULB_PIN_X}
          y2={CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        <path
          d={bulb_path}
          fill={node.value[0] ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />

        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation(); //when input pin clicked, prevent stopDrag call
          }}
          onClick={(e) => {
            const p = outPos(
              CONSTANTS.BULB_PIN_X,
              CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH
            );
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.BULB_PIN_X}
          cy={CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "AND") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={and_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "OR") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "NAND") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={and_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "NOR") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "XOR") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <path
          d={xor_extra_curve_path}
          fill="none"
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          pointerEvents="none"
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "XNOR") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <path
          d={xor_extra_curve_path}
          fill="none"
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          pointerEvents="none"
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "NOT") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        <line
          x1={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS * 2}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X + CONSTANTS.NAND_PIN_RADIUS * 2}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        <path
          d={not_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />

        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        <circle
          className="pin"
          onClick={() => {
            const p = outPos(
              CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X + CONSTANTS.NAND_PIN_RADIUS * 2 - 2,
              CONSTANTS.OUTPUT_PIN_Y
            );
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X + CONSTANTS.NAND_PIN_RADIUS * 2 - 2}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "CLOCK") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <rect
          x={0}
          y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={CONSTANTS.GATE_HEIGHT}
          fill={node.value[0] ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <path
          d="
    
    M 20 40
    L 20 18
    L 35 18
    L 35 40
    L 50 40
    L 50 18
  
  "
          fill="none"
          stroke="#a0aec0"
          strokeWidth="3"
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "NAND3") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.GATE_HEIGHT / 2}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.GATE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={and_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 2, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "AND3") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.GATE_HEIGHT / 2}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.GATE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={and_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 2, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "OR3") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.GATE_HEIGHT / 2}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.GATE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 2, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "NOR3") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.GATE_HEIGHT / 2}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.GATE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 2, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "XOR3") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.GATE_HEIGHT / 2}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.GATE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <path
          d={xor_extra_curve_path}
          fill="none"
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          pointerEvents="none"
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 2, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "XNOR3") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.GATE_HEIGHT / 2}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.GATE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            return true
          }}
        />
        <path
          d={xor_extra_curve_path}
          fill="none"
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          pointerEvents="none"
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP);
            setinputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2);
            setinputpin(node.id, 1, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM);
            setinputpin(node.id, 2, p.x, p.y);
          }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => {
            const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y);
            setoutputpin(node.id, 0, p.x, p.y);
          }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
      </g>
    )
  }

  else if (node.type === "AND4") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={and_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 0); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={0}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 2 * CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT); setinputpin(node.id, 3, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      </g>
    )
  }

  else if (node.type === "NAND4") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={and_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 0); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={0}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 2 * CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT); setinputpin(node.id, 3, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      </g>
    )
  }

  else if (node.type === "OR4") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 0); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={0}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 2 * CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT); setinputpin(node.id, 3, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      </g>
    )
  }

  else if (node.type === "NOR4") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 0); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={0}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 2 * CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT); setinputpin(node.id, 3, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      </g>
    )
  }

  else if (node.type === "XOR4") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />
        <path
          d={xor_extra_curve_path}
          fill="none"
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          pointerEvents="none"
        />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 0); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={0}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 2 * CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT); setinputpin(node.id, 3, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      </g>
    )
  }

  else if (node.type === "XNOR4") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />
        <path
          d={xor_extra_curve_path}
          fill="none"
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          pointerEvents="none"
        />
        <circle
          cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
          cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.NAND_PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 0); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={0}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, 2 * CONSTANTS.GATE_HEIGHT / 3); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT); setinputpin(node.id, 3, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      </g>
    )
  }

  else if (node.type === "MUX2") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        {/* Input wire stubs */}
        <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 2} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 2} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

        {/* Output wire stub */}
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        {/* Body */}
        <rect
          x={0}
          y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={CONSTANTS.GATE_HEIGHT}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          rx={3}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />

        {/* Label */}
        <text
          x={CONSTANTS.GATE_WIDTH / 2}
          y={CONSTANTS.GATE_HEIGHT / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fill="#626b78"
          fontWeight="bold"
          pointerEvents="none"
        >
          MUX2
        </text>

        {/* Input pins + labels */}
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">D0</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.GATE_HEIGHT / 2 + 4} fontSize={8} fill="#a0aec0">D1</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">S</text>

        {/* Output pin + label */}
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.OUTPUT_PIN_Y + 4} fontSize={8} fill="#a0aec0">Y</text>
      </g>
    );
  }

  else if (node.type === "MUX4") {
    const y0 = 0;
    const y1 = CONSTANTS.GATE_HEIGHT / 5;
    const y2 = 2 * CONSTANTS.GATE_HEIGHT / 5;
    const y3 = 3 * CONSTANTS.GATE_HEIGHT / 5;
    const y4 = 4 * CONSTANTS.GATE_HEIGHT / 5;
    const y5 = CONSTANTS.GATE_HEIGHT;

    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        {/* Input wire stubs */}
        <line x1={10} y1={y0} x2={CONSTANTS.INPUT_PIN_X} y2={y0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={y1} x2={CONSTANTS.INPUT_PIN_X} y2={y1} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={y2} x2={CONSTANTS.INPUT_PIN_X} y2={y2} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={y3} x2={CONSTANTS.INPUT_PIN_X} y2={y3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={y4} x2={CONSTANTS.INPUT_PIN_X} y2={y4} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={y5} x2={CONSTANTS.INPUT_PIN_X} y2={y5} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

        {/* Output wire stub */}
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.OUTPUT_PIN_Y}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.OUTPUT_PIN_Y}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        {/* Body */}
        <rect
          x={0} y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={CONSTANTS.GATE_HEIGHT}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          rx={3}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />

        {/* Label */}
        <text
          x={CONSTANTS.GATE_WIDTH / 2}
          y={CONSTANTS.GATE_HEIGHT / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fill="#626b78"
          fontWeight="bold"
          pointerEvents="none"
        >
          MUX 4:1
        </text>

        {/* Input pins + labels */}
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, y0); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={y0}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={y0 + 4} fontSize={8} fill="#a0aec0">D0</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, y1); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={y1}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={y1 + 4} fontSize={8} fill="#a0aec0">D1</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, y2); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={y2}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={y2 + 4} fontSize={8} fill="#a0aec0">D2</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, y3); setinputpin(node.id, 3, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={y3}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={y3 + 4} fontSize={8} fill="#a0aec0">D3</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, y4); setinputpin(node.id, 4, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={y4}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={y4 + 4} fontSize={8} fill="#a0aec0">S0</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, y5); setinputpin(node.id, 5, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={y5}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={y5 + 4} fontSize={8} fill="#a0aec0">S1</text>

        {/* Output pin + label */}
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.OUTPUT_PIN_Y); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.OUTPUT_PIN_Y + 4} fontSize={8} fill="#a0aec0">Y</text>
      </g>
    );
  }

  else if (node.type === "HALF_ADDER") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        {/* Input wire stubs */}
        <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

        {/* Output wire stubs */}
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        {/* Body */}
        <rect
          x={0} y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={CONSTANTS.GATE_HEIGHT}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          rx={3}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />

        {/* Label */}
        <text x={CONSTANTS.GATE_WIDTH / 2} y={CONSTANTS.GATE_HEIGHT / 2 + 4}
          textAnchor="middle" fontSize={11} fill="#626b78" fontWeight="bold" pointerEvents="none">HA</text>

        {/* Input pins + labels */}
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">A</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">B</text>

        {/* Output pins + labels */}
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">S</text>

        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM); setoutputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">C</text>
      </g>
    );
  }

  else if (node.type === "FULL_ADDER") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        {/* Input wire stubs */}
        <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 2} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 2} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

        {/* Output wire stubs */}
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        {/* Body */}
        <rect
          x={0} y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={CONSTANTS.GATE_HEIGHT}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          rx={3}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => { setSelectedGate({ id: node.id }); return true }}
        />

        {/* Label */}
        <text x={CONSTANTS.GATE_WIDTH / 2} y={CONSTANTS.GATE_HEIGHT / 2 + 4}
          textAnchor="middle" fontSize={11} fill="#626b78" fontWeight="bold" pointerEvents="none">FA</text>

        {/* Input pins + labels */}
        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">A</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.GATE_HEIGHT / 2 + 4} fontSize={8} fill="#a0aec0">B</text>

        <circle className="pin" onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">Cin</text>

        {/* Output pins + labels */}
        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={CONSTANTS.GATE_WIDTH - 14} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">S</text>

        <circle className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM); setoutputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
        <text x={CONSTANTS.GATE_WIDTH - 14} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">Co</text>
      </g>
    );
  }


  else if (node.type === "JK") {
    return (
      <g transform={`translate(${node.x}, ${node.y}) rotate(${rot})`} className={gateClass}>
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.GATE_HEIGHT / 2}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.GATE_HEIGHT / 2}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={10}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.INPUT_PIN_Y_TOP}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_TOP}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <line
          x1={CONSTANTS.GATE_WIDTH}
          y1={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          y2={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <rect
          x={0}
          y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={CONSTANTS.GATE_HEIGHT}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          rx={3}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id });
          }}
        />

        <text
          x={CONSTANTS.GATE_WIDTH / 2}
          y={CONSTANTS.GATE_HEIGHT / 2 + 4}
          textAnchor="middle"
          fontSize={14}
          fill="#626b78"
          fontWeight="bold"
          pointerEvents="none"
        >
          JK
        </text>

        <circle
          className="pin"
          onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP); setinputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">J</text>

        <circle
          className="pin"
          onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.GATE_HEIGHT / 2); setinputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text pointerEvents="none" x={5} y={CONSTANTS.GATE_HEIGHT / 2 + 4} fontSize={8} fill="#a0aec0">CLK</text>

        <circle
          className="pin"
          onMouseUp={(e) => e.stopPropagation()}
          onClick={() => { const p = outPos(CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM); setinputpin(node.id, 2, p.x, p.y); }}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">K</text>

        <circle
          className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_TOP); setoutputpin(node.id, 0, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 15} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">Q</text>

        <circle
          className="pin"
          onClick={() => { const p = outPos(CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, CONSTANTS.INPUT_PIN_Y_BOTTOM); setoutputpin(node.id, 1, p.x, p.y); }}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 15} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">Q'</text>
      </g>
    );
  }

  else if (node.type === "CUSTOM") {

    const inputCount = node.inputs?.length ?? 0;
    const outputCount = node.value?.length ?? 0;

    const height = Math.max(
      CONSTANTS.GATE_HEIGHT,
      Math.max(inputCount, outputCount) * 20
    );

    return (
      <g
        transform={`translate(${node.x}, ${node.y}) rotate(${rot})`}
        className={gateClass}
      >

        {/* Component body */}
        <rect
          x={0}
          y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={height}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id });
            return true;
          }}
        />

        {/* Component name */}
        <text
          x={CONSTANTS.GATE_WIDTH / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={CONSTANTS.GATE_STROKE_COLOR}
          fontSize="12"
          pointerEvents="none"
        >
          {node.name}
        </text>

        {/* Input pins */}
        {node.inputs?.map((_, i) => {

          const y = height / 2 +
            (i - (inputCount - 1) / 2) * 20;

          return (
            <g key={`input-${i}`}>
              <line
                x1={0}
                y1={y}
                x2={CONSTANTS.INPUT_PIN_X}
                y2={y}
                stroke={CONSTANTS.GATE_STROKE_COLOR}
                strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
              />

              <circle
                className="pin"
                onMouseUp={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  setinputpin(
                    node.id,
                    i,
                    outPos(0, y).x,
                    outPos(0, y).y
                  );
                }}
                cx={0}
                cy={y}
                r={CONSTANTS.PIN_RADIUS}
                fill={CONSTANTS.GATE_FILL_COLOR}
                stroke={CONSTANTS.GATE_STROKE_COLOR}
                strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
              />
            </g>
          );
        })}

        {/* Output pins */}
        {node.value?.map((_, i) => {

          const y = height / 2 +
            (i - (outputCount - 1) / 2) * 20;

          return (
            <g key={`output-${i}`}>
              <line
                x1={CONSTANTS.GATE_WIDTH}
                y1={y}
                x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
                y2={y}
                stroke={CONSTANTS.GATE_STROKE_COLOR}
                strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
              />

              <circle
                className="pin"
                onMouseUp={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  const p = outPos(
                    CONSTANTS.GATE_WIDTH,
                    y
                  );

                  setoutputpin(
                    node.id,
                    i,
                    p.x,
                    p.y
                  );
                }}
                cx={CONSTANTS.GATE_WIDTH}
                cy={y}
                r={CONSTANTS.PIN_RADIUS}
                fill={CONSTANTS.GATE_FILL_COLOR}
                stroke={CONSTANTS.GATE_STROKE_COLOR}
                strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
              />
            </g>
          );
        })}

      </g>
    );
  }

  return null;
}