import * as CONSTANTS from "../constants/constants";

const r = CONSTANTS.GATE_HEIGHT / 2;

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
          stroke={node.value ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.WIRE_COLOR}
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
    return (
      <g
        transform={`translate(${node.x}, ${node.y})`}
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
          fill={node.value ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          rx={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
          ry={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        />

        <circle
          cx={node.value ? 3 * CONSTANTS.TOGGLE_WIDTH / 4 - CONSTANTS.TOGGLE_CAPSULE_RADIUS : CONSTANTS.TOGGLE_WIDTH / 4 + CONSTANTS.TOGGLE_CAPSULE_RADIUS}
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
            console.log(`outputpin set \n node id:${node.id} x=${node.x + CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X}, y=${node.y + CONSTANTS.TOGGLE_HEIGHT / 2}`)
            setoutputpin(
              node.id,
              node.x + CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X,
              node.y + CONSTANTS.TOGGLE_HEIGHT / 2
            )
          }}
          cx={CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.TOGGLE_HEIGHT / 2}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          fill={node.value ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={(e) => {
            setinputpin(
              node.id,
              0,
              node.x + CONSTANTS.BULB_PIN_X,
              node.y + CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH
            );
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />

        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X + CONSTANTS.NAND_PIN_RADIUS * 2 - 2, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
        <rect
          x={0}
          y={0}
          width={CONSTANTS.GATE_WIDTH}
          height={CONSTANTS.GATE_HEIGHT}
          fill={node.value ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
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
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.GATE_HEIGHT / 2)}
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
            e.stopPropagation(); //when input pin clicked, prevent stopdDrag call
          }}
          onClick={() => setinputpin(node.id, 2, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.GATE_HEIGHT / 2)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 2, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.GATE_HEIGHT / 2)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 2, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.GATE_HEIGHT / 2)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 2, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.GATE_HEIGHT / 2)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 2, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.GATE_HEIGHT / 2)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 2, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.OUTPUT_PIN_Y)}
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

  else if (node.type === "JK") {
    return (
      <g transform={`translate(${node.x}, ${node.y})`} className={gateClass}>
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
          fill="#a0aec0"
          fontWeight="bold"
        >
          JK
        </text>

        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 0, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text x={0} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">J</text>

        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.GATE_HEIGHT / 2)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.GATE_HEIGHT / 2}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text x={0} y={CONSTANTS.GATE_HEIGHT / 2 + 4} fontSize={8} fill="#a0aec0">CLK</text>

        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 2, node.x + CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text x={0} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">K</text>

        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, 0, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_TOP)}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text x={CONSTANTS.GATE_WIDTH - 10} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">Q</text>

        <circle
          className="pin"
          onClick={() => setoutputpin(node.id, 1, node.x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X, node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM)}
          cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text x={CONSTANTS.GATE_WIDTH - 10} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">Q'</text>
      </g>
    );
  }

  return null;
}