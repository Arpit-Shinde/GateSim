import * as CONSTANTS from "../constants/constants";
import * as GATE from "../components/gate"


export function RenderINPUT() {
  const size = CONSTANTS.TOGGLE_HEIGHT; // square: width === height

  return (
    <g
      style={{ cursor: "pointer" }} transform="translate(14,0)"
    >
      <line
        x1={size}
        y1={size / 2}
        x2={size - CONSTANTS.INPUT_PIN_X}
        y2={size / 2}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Square with rounded corners */}
      <rect
        width={size}
        height={size}
        rx={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        ry={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* 0 / 1 text in center */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.6}
        fontFamily="monospace"
        fill={CONSTANTS.GATE_STROKE_COLOR}
        pointerEvents="none"
        style={{ userSelect: "none" }}
      >
        0
      </text>

      <circle
        className="render-gate-pin"
        cx={size - CONSTANTS.INPUT_PIN_X}
        cy={size / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  )
}

export function RenderBULB() {
  return (
    <g
      style={{ cursor: "pointer" }}
      transform={`translate(25,-5)`}
    >
      <line
        x1={CONSTANTS.BULB_PIN_X}
        y1={CONSTANTS.BULB_PIN_Y}
        x2={CONSTANTS.BULB_PIN_X}
        y2={CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      <path
        d={GATE.bulb_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      <circle
        className="render-gate-pin"
        cx={CONSTANTS.BULB_PIN_X}
        cy={CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderAND() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      <line
        x1={0}
        y1={CONSTANTS.INPUT_PIN_Y_TOP}
        x2={CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.INPUT_PIN_Y_TOP}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <line
        x1={0}
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
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
};

export function RenderOR() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderNAND() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
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
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderNOR() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
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
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderXOR() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <path
        d={GATE.xor_extra_curve_path}
        fill="none"
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        pointerEvents="none"
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderXNOR() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <path
        d={GATE.xor_extra_curve_path}
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
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderNOT() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stub */}
      <line
        x1={10}
        y1={CONSTANTS.INPUT_PIN_Y}
        x2={CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.INPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output wire stub - from bubble to pin */}
      <line
        x1={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS * 2}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X + CONSTANTS.NAND_PIN_RADIUS * 2}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* NOT triangle */}
      <path
        d={GATE.not_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Inversion Bubble at output */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pin */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output pin (after bubble) */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X + CONSTANTS.NAND_PIN_RADIUS * 2}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

// gates_svg.js

export function RenderCLOCK() {
  const size = CONSTANTS.TOGGLE_HEIGHT; // square body, same as canvas
  const localX = CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X - 25;
  const localY = CONSTANTS.TOGGLE_HEIGHT / 2;

  // Same waveform geometry as the canvas CLOCK branch
  const wfW = size * 0.65;
  const wfH = size * 0.45;
  const wfX = (size - wfW) / 2 + 3;
  const wfY = (size - wfH) / 2;
  const waveform = `
    M ${wfX} ${wfY + wfH}
    L ${wfX} ${wfY}
    L ${wfX + wfW * 0.35} ${wfY}
    L ${wfX + wfW * 0.35} ${wfY + wfH}
    L ${wfX + wfW * 0.7} ${wfY + wfH}
    L ${wfX + wfW * 0.7} ${wfY}
  `;

  return (
    <g transform="translate(15,0)">
      {/* Output wire stub */}
      <line
        x1={size}
        y1={size / 2}
        x2={size - CONSTANTS.INPUT_PIN_X}
        y2={size / 2}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Body — identical shape language to the canvas CLOCK */}
      <rect
        width={size}
        height={size}
        rx={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        ry={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Waveform glyph — same weight + colour as the canvas version */}
      <path
        d={waveform}
        fill="none"
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        pointerEvents="none"
      />

      {/* Output pin */}
      <circle
        className="render-gate-pin"
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

// gates_svg.js

export function RenderNAND3() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs - TOP, MIDDLE, BOTTOM */}
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

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* NAND3 gate shape - AND shape with 3 inputs */}
      <path
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* NAND bubble (inverter circle at output) */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins - TOP, MIDDLE, BOTTOM */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.GATE_HEIGHT / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output pin */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderAND3() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs - TOP, MIDDLE, BOTTOM */}
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

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* AND3 gate shape */}
      <path
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins - TOP, MIDDLE, BOTTOM */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.GATE_HEIGHT / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output pin */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}
export function RenderOR3() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs - TOP, MIDDLE, BOTTOM */}
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

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* OR3 gate shape */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins - TOP, MIDDLE, BOTTOM */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.GATE_HEIGHT / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output pin */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderNOR3() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs - TOP, MIDDLE, BOTTOM */}
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

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* NOR3 gate shape - OR shape with 3 inputs */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Inversion Bubble */}
      <circle
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins - TOP, MIDDLE, BOTTOM */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.GATE_HEIGHT / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output pin */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderXOR3() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs - TOP, MIDDLE, BOTTOM */}
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

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* XOR3 gate shape - OR shape with 3 inputs */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Extra XOR Curve */}
      <path
        d={GATE.xor_extra_curve_path}
        fill="none"
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        pointerEvents="none"
      />

      {/* Input pins - TOP, MIDDLE, BOTTOM */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.GATE_HEIGHT / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output pin */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderXNOR3() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs - TOP, MIDDLE, BOTTOM */}
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

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* XNOR3 gate shape - OR shape with 3 inputs */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Extra XOR Curve */}
      <path
        d={GATE.xor_extra_curve_path}
        fill="none"
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        pointerEvents="none"
      />

      {/* Inversion Bubble */}
      <circle
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins - TOP, MIDDLE, BOTTOM */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_TOP}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.GATE_HEIGHT / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Output pin */}
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderAND4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Gate shape */}
      <path
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderNAND4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Gate shape */}
      <path
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Inversion Bubble */}
      <circle
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Gate shape */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderNOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Gate shape */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Inversion Bubble */}
      <circle
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderXOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Gate shape */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Extra XOR Curve */}
      <path
        d={GATE.xor_extra_curve_path}
        fill="none"
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        pointerEvents="none"
      />

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderXNOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={0} x2={CONSTANTS.INPUT_PIN_X} y2={0} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={2 * CONSTANTS.GATE_HEIGHT / 3} x2={CONSTANTS.INPUT_PIN_X} y2={2 * CONSTANTS.GATE_HEIGHT / 3} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Gate shape */}
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Extra XOR Curve */}
      <path
        d={GATE.xor_extra_curve_path}
        fill="none"
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        pointerEvents="none"
      />

      {/* Inversion Bubble */}
      <circle
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={2 * CONSTANTS.GATE_HEIGHT / 3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderMUX2() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
        x={0} y={0}
        width={CONSTANTS.GATE_WIDTH}
        height={CONSTANTS.GATE_HEIGHT}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        rx={3}
      />

      {/* Label */}
      <text
        x={CONSTANTS.GATE_WIDTH / 2}
        y={CONSTANTS.GATE_HEIGHT / 2 + 4}
        textAnchor="middle"
        fontSize={11}
        fill="#a0aec0"
        fontWeight="bold"
      >
        MUX
      </text>

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 2} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderMUX4() {
  const y0 = 0;
  const y1 = CONSTANTS.GATE_HEIGHT / 5;
  const y2 = 2 * CONSTANTS.GATE_HEIGHT / 5;
  const y3 = 3 * CONSTANTS.GATE_HEIGHT / 5;
  const y4 = 4 * CONSTANTS.GATE_HEIGHT / 5;
  const y5 = CONSTANTS.GATE_HEIGHT;

  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
      />

      {/* Label */}
      <text
        x={CONSTANTS.GATE_WIDTH / 2}
        y={CONSTANTS.GATE_HEIGHT / 2 + 4}
        textAnchor="middle"
        fontSize={11}
        fill="#a0aec0"
        fontWeight="bold"
      >
        MUX 4:1
      </text>

      {/* Input pins */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y1} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y2} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y5} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output pin */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderHALF_ADDER() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      <rect x={0} y={0} width={CONSTANTS.GATE_WIDTH} height={CONSTANTS.GATE_HEIGHT}
        fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} rx={3} />

      <text x={CONSTANTS.GATE_WIDTH / 2} y={CONSTANTS.GATE_HEIGHT / 2 + 4}
        textAnchor="middle" fontSize={11} fill="#a0aec0" fontWeight="bold">HA</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderFULL_ADDER() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 2} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 2} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      <rect x={0} y={0} width={CONSTANTS.GATE_WIDTH} height={CONSTANTS.GATE_HEIGHT}
        fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} rx={3} />

      <text x={CONSTANTS.GATE_WIDTH / 2} y={CONSTANTS.GATE_HEIGHT / 2 + 4}
        textAnchor="middle" fontSize={11} fill="#a0aec0" fontWeight="bold">FA</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 2} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderJK() {
  const w = 50;
  const h = 40;

  return (
    <g transform="scale(0.65) translate(25, 5)">
      {/* JK Flip-Flop Box */}
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        rx={3}
      />

      {/* Label */}
      <text
        x={w / 2}
        y={h / 2 + 4}
        textAnchor="middle"
        fontSize={14}
        fill="#a0aec0"
        fontWeight="bold"
      >
        JK
      </text>

      {/* Input pins with labels */}
      {/* J (top) */}
      <circle
        className="render-gate-pin"
        cx={0}
        cy={10}
        r={4}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <text x={-12} y={13} fontSize={8} fill="#a0aec0" textAnchor="end">J</text>

      {/* CLK (middle) */}
      <circle
        className="render-gate-pin"
        cx={0}
        cy={20}
        r={4}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <text x={-12} y={23} fontSize={8} fill="#a0aec0" textAnchor="end">CLK</text>

      {/* K (bottom) */}
      <circle
        className="render-gate-pin"
        cx={0}
        cy={30}
        r={4}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <text x={-12} y={33} fontSize={8} fill="#a0aec0" textAnchor="end">K</text>

      {/* Output pins with labels */}
      {/* Q (top) */}
      <circle
        className="render-gate-pin"
        cx={w}
        cy={10}
        r={4}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <text x={w + 8} y={13} fontSize={8} fill="#a0aec0">Q</text>

      {/* Q' (bottom) */}
      <circle
        className="render-gate-pin"
        cx={w}
        cy={30}
        r={4}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <text x={w + 8} y={33} fontSize={8} fill="#a0aec0">Q'</text>
    </g>
  );
}

export function RenderCUSTOM({ node }) {
  const inputCount = node?.inputs?.length ?? 2;
  const outputCount = node?.value?.length ?? 2;

  const height = Math.max(
    CONSTANTS.GATE_HEIGHT,
    Math.max(inputCount, outputCount) * 20
  );

  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>

      {/* Input wire stubs */}
      {Array.from({ length: inputCount }).map((_, i) => {
        const y = height / 2 + (i - (inputCount - 1) / 2) * 20;
        return (
          <line
            key={`in-stub-${i}`}
            x1={10}
            y1={y}
            x2={CONSTANTS.INPUT_PIN_X}
            y2={y}
            stroke={CONSTANTS.GATE_STROKE_COLOR}
            strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          />
        );
      })}

      {/* Output wire stubs */}
      {Array.from({ length: outputCount }).map((_, i) => {
        const y = height / 2 + (i - (outputCount - 1) / 2) * 20;
        return (
          <line
            key={`out-stub-${i}`}
            x1={CONSTANTS.GATE_WIDTH}
            y1={y}
            x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
            y2={y}
            stroke={CONSTANTS.GATE_STROKE_COLOR}
            strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          />
        );
      })}

      {/* Body */}
      <rect
        x={0}
        y={0}
        width={CONSTANTS.GATE_WIDTH}
        height={height}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        rx={3}
      />

      {/* Label */}
      <text
        x={CONSTANTS.GATE_WIDTH / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fill="#a0aec0"
        fontWeight="bold"
      >
        {node?.name ?? "CUSTOM"}
      </text>

      {/* Input pins */}
      {Array.from({ length: inputCount }).map((_, i) => {
        const y = height / 2 + (i - (inputCount - 1) / 2) * 20;
        return (
          <circle
            key={`in-pin-${i}`}
            className="render-gate-pin"
            cx={CONSTANTS.INPUT_PIN_X}
            cy={y}
            r={CONSTANTS.PIN_RADIUS}
            fill={CONSTANTS.GATE_FILL_COLOR}
            stroke={CONSTANTS.GATE_STROKE_COLOR}
            strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          />
        );
      })}

      {/* Output pins */}
      {Array.from({ length: outputCount }).map((_, i) => {
        const y = height / 2 + (i - (outputCount - 1) / 2) * 20;
        return (
          <circle
            key={`out-pin-${i}`}
            className="render-gate-pin"
            cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
            cy={y}
            r={CONSTANTS.PIN_RADIUS}
            fill={CONSTANTS.GATE_FILL_COLOR}
            stroke={CONSTANTS.GATE_STROKE_COLOR}
            strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          />
        );
      })}

    </g>
  );
}