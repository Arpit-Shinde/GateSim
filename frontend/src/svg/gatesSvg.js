import * as CONSTANTS from "../constants/constants";
import * as GATE from "../components/gate";

export function RenderINPUT() {
  const localX = CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X - 25;
  const localY = CONSTANTS.TOGGLE_HEIGHT / 2;
  const size = CONSTANTS.TOGGLE_HEIGHT; // square: width === height

  return (
    <g style={{ cursor: "pointer" }} transform="translate(14,0)">
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

export function RenderBULB() {
  const size = CONSTANTS.TOGGLE_HEIGHT; // square: width === height

  return (
    <g style={{ cursor: "pointer" }} transform="translate(14,0)">
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
        cx={0}
        cy={CONSTANTS.GRID_SIZE}
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
      <path
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH}
        cy={CONSTANTS.OUTPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderOR() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH}
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
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE}
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
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE}
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
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH}
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
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE}
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
  const s = 0.5;
  return (
    <g transform="translate(18,0)">
      <path
        d={GATE.not_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        transform={`scale(${s})`}
      />

      <circle
        cx={CONSTANTS.GATE_WIDTH / 2 + CONSTANTS.NAND_PIN_RADIUS}
        cy={CONSTANTS.OUTPUT_PIN_Y / 2}
        r={CONSTANTS.NAND_PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.TWO_INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      <circle
        className="render-gate-pin"
        cx={(3 * CONSTANTS.GATE_WIDTH) / 4}
        cy={CONSTANTS.OUTPUT_PIN_Y / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}

export function RenderCLOCK() {
  const localX = CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X - 25;
  const localY = CONSTANTS.TOGGLE_HEIGHT / 2;
  const size = CONSTANTS.TOGGLE_HEIGHT; // square: width === height

  const wfW = size * 0.55;
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
      <line
        x1={size}
        y1={size / 2}
        x2={size - CONSTANTS.INPUT_PIN_X}
        y2={size / 2}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Body: identical to toggle */}
      <rect
        width={size}
        height={size}
        rx={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        ry={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Waveform glyph */}
      <path
        d={waveform}
        fill="none"
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={1.2}
        strokeLinejoin="round"
        strokeLinecap="round"
        pointerEvents="none"
        style={{ userSelect: "none" }}
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

export function RenderNAND3() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
        cx={0}
        cy={CONSTANTS.GRID_SIZE}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE}
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
      <path
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH}
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
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH}
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
        cx={0}
        cy={CONSTANTS.GRID_SIZE}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE}
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
        cx={0}
        cy={CONSTANTS.GRID_SIZE}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH}
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
        cx={0}
        cy={CONSTANTS.GRID_SIZE}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={0}
        cy={CONSTANTS.GRID_SIZE * 3}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE}
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
      <path
        d={GATE.and_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle className="render-gate-pin" cx={0} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={(3 * CONSTANTS.GATE_HEIGHT) / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderNAND4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
      <circle className="render-gate-pin" cx={0} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={(3 * CONSTANTS.GATE_HEIGHT) / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      <path
        d={GATE.or_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle className="render-gate-pin" cx={0} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={(3 * CONSTANTS.GATE_HEIGHT) / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderNOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
      <circle className="render-gate-pin" cx={0} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={(3 * CONSTANTS.GATE_HEIGHT) / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderXOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
      <circle className="render-gate-pin" cx={0} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={(3 * CONSTANTS.GATE_HEIGHT) / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
    </g>
  );
}

export function RenderXNOR4() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
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
      <circle className="render-gate-pin" cx={0} cy={0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={(3 * CONSTANTS.GATE_HEIGHT) / 4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={0} cy={CONSTANTS.GATE_HEIGHT} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH + CONSTANTS.GRID_SIZE} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
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
        x={0}
        y={0}
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
        fill="#626b78"
        fontWeight="bold"
        pointerEvents="none"
      >
        MUX2
      </text>

      {/* Input pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">D0</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 2} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.GATE_HEIGHT / 2 + 4} fontSize={8} fill="#a0aec0">D1</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">S</text>

      {/* Output pin + label */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.OUTPUT_PIN_Y + 4} fontSize={8} fill="#a0aec0">Y</text>
    </g>
  );
}

export function RenderMUX4() {
  const y0 = 0;
  const y1 = CONSTANTS.GATE_HEIGHT / 5;
  const y2 = (2 * CONSTANTS.GATE_HEIGHT) / 5;
  const y3 = (3 * CONSTANTS.GATE_HEIGHT) / 5;
  const y4 = (4 * CONSTANTS.GATE_HEIGHT) / 5;
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
        x={0}
        y={0}
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
        fill="#626b78"
        fontWeight="bold"
        pointerEvents="none"
      >
        MUX 4:1
      </text>

      {/* Input pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y0} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={y0 + 4} fontSize={8} fill="#a0aec0">D0</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y1} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={y1 + 4} fontSize={8} fill="#a0aec0">D1</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y2} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={y2 + 4} fontSize={8} fill="#a0aec0">D2</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y3} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={y3 + 4} fontSize={8} fill="#a0aec0">D3</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y4} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={y4 + 4} fontSize={8} fill="#a0aec0">S0</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={y5} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={y5 + 4} fontSize={8} fill="#a0aec0">S1</text>

      {/* Output pin + label */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.OUTPUT_PIN_Y} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.OUTPUT_PIN_Y + 4} fontSize={8} fill="#a0aec0">Y</text>
    </g>
  );
}

export function RenderHALF_ADDER() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stubs */}
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

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
        HA
      </text>

      {/* Input pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">A</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">B</text>

      {/* Output pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">S</text>

      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 12} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">C</text>
    </g>
  );
}

export function RenderFULL_ADDER() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 2} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 2} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stubs */}
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

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
        FA
      </text>

      {/* Input pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">A</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 2} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.GATE_HEIGHT / 2 + 4} fontSize={8} fill="#a0aec0">B</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">Cin</text>

      {/* Output pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 14} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">S</text>

      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 14} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">Co</text>
    </g>
  );
}

export function RenderJK() {
  return (
    <g transform={`scale(${0.7}) translate(20,0)`}>
      {/* Input wire stubs */}
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.GATE_HEIGHT / 2} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.GATE_HEIGHT / 2} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={10} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

      {/* Output wire stubs */}
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_TOP} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_TOP} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <line x1={CONSTANTS.GATE_WIDTH} y1={CONSTANTS.INPUT_PIN_Y_BOTTOM} x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} y2={CONSTANTS.INPUT_PIN_Y_BOTTOM} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />

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
      />

      {/* Label */}
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

      {/* Input pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">J</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.GATE_HEIGHT / 2} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.GATE_HEIGHT / 2 + 4} fontSize={8} fill="#a0aec0">CLK</text>

      <circle className="render-gate-pin" cx={CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={5} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">K</text>

      {/* Output pins + labels */}
      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_TOP} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 15} y={CONSTANTS.INPUT_PIN_Y_TOP + 4} fontSize={8} fill="#a0aec0">Q</text>

      <circle className="render-gate-pin" cx={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X} cy={CONSTANTS.INPUT_PIN_Y_BOTTOM} r={CONSTANTS.PIN_RADIUS} fill={CONSTANTS.GATE_FILL_COLOR} stroke={CONSTANTS.GATE_STROKE_COLOR} strokeWidth={CONSTANTS.GATE_STROKE_WIDTH} />
      <text pointerEvents="none" x={CONSTANTS.GATE_WIDTH - 15} y={CONSTANTS.INPUT_PIN_Y_BOTTOM + 4} fontSize={8} fill="#a0aec0">Q'</text>
    </g>
  );
}

export function RenderCUSTOM({ node }) {
  const inputCount = node?.inputs?.length ?? 2;
  const outputCount = node?.ext_outputs?.length ?? node?.value?.length ?? 2;

  const minGrids = Math.max(
    2,
    Math.ceil(CONSTANTS.GATE_HEIGHT / CONSTANTS.GRID_SIZE)
  );
  const maxPins = Math.max(inputCount, outputCount, minGrids);

  const inOffset = Math.floor((maxPins - inputCount) / 2) * CONSTANTS.GRID_SIZE;
  const outOffset = Math.floor((maxPins - outputCount) / 2) * CONSTANTS.GRID_SIZE;
  const bodyHeight = maxPins * CONSTANTS.GRID_SIZE;
  const totalHeight = bodyHeight + CONSTANTS.GRID_SIZE;

  const inputPinNames = [];
  const seenSources = new Set();
  for (const entry of node?.ext_inputs ?? []) {
    if (seenSources.has(entry.sourceId)) continue;
    seenSources.add(entry.sourceId);
    inputPinNames.push(entry.name ?? "");
  }

  const inputNames = Array.from({ length: inputCount }, (_, i) => {
    const name = inputPinNames[i] || `I${i}`;
    return name + ((node?.inWidths?.[i] ?? 1) > 1 ? `[${node.inWidths[i]}]` : "");
  });

  const outputNames = Array.from({ length: outputCount }, (_, i) => {
    const name = node?.ext_outputs?.[i]?.name ?? `O${i + 1}`;
    return name + ((node?.outWidths?.[i] ?? 1) > 1 ? `[${node.outWidths[i]}]` : "");
  });

  const inputTextWidth = Math.max(0, ...inputNames.map((name) => name.length * 6));
  const outputTextWidth = Math.max(0, ...outputNames.map((name) => name.length * 6));
  const componentName = node?.name || "CUSTOM";
  const componentNameWidth = componentName.length * 7.5;

  const requiredWidth = Math.max(
    CONSTANTS.MIN_CUSTOM_COMPONENT_WIDTH,
    inputTextWidth + outputTextWidth + 40,
    componentNameWidth + 40
  );

  const width = Math.ceil(requiredWidth / CONSTANTS.GRID_SIZE) * CONSTANTS.GRID_SIZE;

  // Scale down proportionally if the custom IC is larger than a standard gate card
  const scale = Math.min(
    0.7,
    (CONSTANTS.GATE_WIDTH / width) * 0.7,
    (CONSTANTS.GATE_HEIGHT / totalHeight) * 0.7
  );

  return (
    <g transform={`scale(${scale}) translate(20,${CONSTANTS.GRID_SIZE})`}>
      {/* Component body */}
      <rect
        x={0}
        y={-CONSTANTS.GRID_SIZE}
        width={width}
        height={totalHeight}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

      {/* Component name */}
      <text
        x={width / 2}
        y={(bodyHeight - CONSTANTS.GRID_SIZE) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={CONSTANTS.CUSTOM_GATE_BODY_TEXT_COLOR}
        fontSize="12"
        pointerEvents="none"
      >
        {componentName}
      </text>

      {/* Input pins */}
      {Array.from({ length: inputCount }).map((_, i) => {
        const y = inOffset + i * CONSTANTS.GRID_SIZE;
        return (
          <g key={`input-${i}`}>
            <text
              x={10}
              y={y}
              textAnchor="start"
              dominantBaseline="middle"
              fill={CONSTANTS.CUSTOM_GATE_PINS_TEXT_COLOR}
              fontSize="10"
              pointerEvents="none"
            >
              {inputNames[i]}
            </text>

            <line
              x1={0}
              y1={y}
              x2={CONSTANTS.INPUT_PIN_X}
              y2={y}
              stroke={CONSTANTS.GATE_STROKE_COLOR}
              strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
            />

            <circle
              className="render-gate-pin"
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
      {Array.from({ length: outputCount }).map((_, i) => {
        const y = outOffset + i * CONSTANTS.GRID_SIZE;
        return (
          <g key={`output-${i}`}>
            <text
              x={width - 10}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fill={CONSTANTS.CUSTOM_GATE_PINS_TEXT_COLOR}
              fontSize="10"
              pointerEvents="none"
            >
              {outputNames[i]}
            </text>

            <line
              x1={width}
              y1={y}
              x2={width - CONSTANTS.INPUT_PIN_X}
              y2={y}
              stroke={CONSTANTS.GATE_STROKE_COLOR}
              strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
            />

            <circle
              className="render-gate-pin"
              cx={width}
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

export function RenderCONSTANT() {
  const value = [false, false, true, false]; // value[0] = LSB on the right ("0 1 0 0")
  const n = value.length;
  const B = 16;
  const W = n * B;

  const cells = [];
  for (let i = 0; i < n; i++) {
    const x = (n - 1 - i) * B; // value[0] = LSB on the right
    const on = !!value[i];
    cells.push(
      <g key={i}>
        <rect
          x={x}
          y={0}
          width={B}
          height={B}
          fill={on ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <text
          x={x + B / 2}
          y={B / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={B * 0.5}
          fontFamily="monospace"
          fill={CONSTANTS.GATE_STROKE_COLOR}
          pointerEvents="none"
        >
          {on ? "1" : "0"}
        </text>
        <text
          x={x + B - 1.5}
          y={B - 1.5}
          textAnchor="end"
          fontSize={5.5}
          fill="#8a8a8a"
          opacity={0.75}
          pointerEvents="none"
        >
          {i}
        </text>
      </g>
    );
  }

  return (
    <g transform="translate(8,8)">
      {cells}
      <line
        x1={W}
        y1={B / 2}
        x2={W - CONSTANTS.INPUT_PIN_X}
        y2={B / 2}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={W}
        cy={B / 2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
    </g>
  );
}
