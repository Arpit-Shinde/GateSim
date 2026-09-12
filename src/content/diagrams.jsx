import * as CONSTANTS from "../constants/constants";
import {
  and_path,
  or_path,
  not_path,
  xor_extra_curve_path,
  bulb_path,
} from "../components/gate";

// Use the same colors the canvas uses, so figures match visually
const STROKE = CONSTANTS.GATE_STROKE_COLOR;
const FILL = CONSTANTS.GATE_FILL_COLOR;
const STROKE_W = CONSTANTS.GATE_STROKE_WIDTH;
const PIN_COLOR = CONSTANTS.GATE_STROKE_COLOR;
const PIN_R = CONSTANTS.PIN_RADIUS;
const BUBBLE_R = CONSTANTS.NAND_PIN_RADIUS;

// ── Layout constants ──
// We draw on a canvas from x=-40 to x=GATE_WIDTH+60, y=-20 to GATE_HEIGHT+20.
// The gate body lives at (0, 0) to (GATE_WIDTH, GATE_HEIGHT) — same as in gate.js.
const W = CONSTANTS.GATE_WIDTH;
const H = CONSTANTS.GATE_HEIGHT;
const PIN_X = CONSTANTS.INPUT_PIN_X;
const Y_TOP = CONSTANTS.INPUT_PIN_Y_TOP;
const Y_BOT = CONSTANTS.INPUT_PIN_Y_BOTTOM;
const Y_MID = CONSTANTS.OUTPUT_PIN_Y;

function Figure({ children }) {
  return (
    <svg
      width={W + 100}
      height={H + 40}
      viewBox={`-40 -20 ${W + 100} ${H + 40}`}
      style={{ display: "block", margin: "0 auto" }}
    >
      {children}
    </svg>
  );
}

// Common sub-elements
function InputStub({ y, label }) {
  return (
    <>
      <line x1={-20} y1={y} x2={PIN_X} y2={y} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle cx={PIN_X} cy={y} r={PIN_R} fill={FILL} stroke={PIN_COLOR} strokeWidth={STROKE_W} />
      <text x={-30} y={y + 4} fill={STROKE} fontSize={11}>{label}</text>
    </>
  );
}

function OutputStub({ y, label, offsetX = 0 }) {
  return (
    <>
      <line
        x1={W + offsetX}
        y1={y}
        x2={W + offsetX + 30}
        y2={y}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <circle
        cx={W + offsetX + 30}
        cy={y}
        r={PIN_R}
        fill={FILL}
        stroke={PIN_COLOR}
        strokeWidth={STROKE_W}
      />
      {label && (
        <text x={W + offsetX + 40} y={y + 4} fill={STROKE} fontSize={11}>{label}</text>
      )}
    </>
  );
}

// ─── AND ───
export function AndGateFigure() {
  return (
    <Figure>
      <path d={and_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
      <InputStub y={Y_TOP} label="A" />
      <InputStub y={Y_BOT} label="B" />
      <OutputStub y={Y_MID} label="Y = A · B" />
    </Figure>
  );
}

// ─── OR ───
export function OrGateFigure() {
  return (
    <Figure>
      <path d={or_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
      <InputStub y={Y_TOP} label="A" />
      <InputStub y={Y_BOT} label="B" />
      <OutputStub y={Y_MID} label="Y = A + B" />
    </Figure>
  );
}

// ─── NOT ───
export function NotGateFigure() {
  return (
    <Figure>
      <path d={not_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
      {/* inversion bubble */}
      <circle
        cx={W + BUBBLE_R}
        cy={Y_MID}
        r={BUBBLE_R}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <InputStub y={Y_MID} label="A" />
      <OutputStub y={Y_MID} label="Y = ¬A" offsetX={2 * BUBBLE_R} />
    </Figure>
  );
}

// ─── NAND ───
export function NandGateFigure() {
  return (
    <Figure>
      <path d={and_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle
        cx={W + BUBBLE_R}
        cy={Y_MID}
        r={BUBBLE_R}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <InputStub y={Y_TOP} label="A" />
      <InputStub y={Y_BOT} label="B" />
      <OutputStub y={Y_MID} label="Y = ¬(A · B)" offsetX={2 * BUBBLE_R} />
    </Figure>
  );
}

// ─── NOR ───
export function NorGateFigure() {
  return (
    <Figure>
      <path d={or_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
      <circle
        cx={W + BUBBLE_R}
        cy={Y_MID}
        r={BUBBLE_R}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <InputStub y={Y_TOP} label="A" />
      <InputStub y={Y_BOT} label="B" />
      <OutputStub y={Y_MID} label="Y = ¬(A + B)" offsetX={2 * BUBBLE_R} />
    </Figure>
  );
}

// ─── XOR ───
export function XorGateFigure() {
  return (
    <Figure>
      <path d={or_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
      <path
        d={xor_extra_curve_path}
        fill="none"
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <InputStub y={Y_TOP} label="A" />
      <InputStub y={Y_BOT} label="B" />
      <OutputStub y={Y_MID} label="Y = A ⊕ B" />
    </Figure>
  );
}

// ─── XNOR ───
export function XnorGateFigure() {
  return (
    <Figure>
      <path d={or_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
      <path
        d={xor_extra_curve_path}
        fill="none"
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <circle
        cx={W + BUBBLE_R}
        cy={Y_MID}
        r={BUBBLE_R}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={STROKE_W}
      />
      <InputStub y={Y_TOP} label="A" />
      <InputStub y={Y_BOT} label="B" />
      <OutputStub y={Y_MID} label="Y = ¬(A ⊕ B)" offsetX={2 * BUBBLE_R} />
    </Figure>
  );
}

// ─── BULB (for sequential / output chapters) ───
export function BulbFigure() {
  return (
    <svg
      width={CONSTANTS.BULB_WIDTH + 80}
      height={CONSTANTS.BULB_WIDTH + 60}
      viewBox={`-40 -30 ${CONSTANTS.BULB_WIDTH + 80} ${CONSTANTS.BULB_WIDTH + 60}`}
      style={{ display: "block", margin: "0 auto" }}
    >
      <path d={bulb_path} fill={FILL} stroke={STROKE} strokeWidth={STROKE_W} />
    </svg>
  );
}

// ─── Registry ───
export const FIGURES = {
  "and-gate": AndGateFigure,
  "or-gate": OrGateFigure,
  "not-gate": NotGateFigure,
  "nand-gate": NandGateFigure,
  "nor-gate": NorGateFigure,
  "xor-gate": XorGateFigure,
  "xnor-gate": XnorGateFigure,
  "bulb": BulbFigure,
};