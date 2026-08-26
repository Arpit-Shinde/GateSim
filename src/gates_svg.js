import * as CONSTANTS from "./constants";
import * as GATE from "./gate"


export function RenderINPUT() {
  return (
    <g
      style={{ cursor: "pointer" }}
    >
      <line
      x1={CONSTANTS.TOGGLE_WIDTH}
      y1={CONSTANTS.TOGGLE_HEIGHT/2}
      x2={CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X}
      y2={CONSTANTS.TOGGLE_HEIGHT/2}
      stroke={CONSTANTS.GATE_STROKE_COLOR}
      strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
    />
      <rect 
      width={CONSTANTS.TOGGLE_WIDTH}
      height={CONSTANTS.TOGGLE_HEIGHT}
      fill={CONSTANTS.GATE_FILL_COLOR}
      stroke={CONSTANTS.GATE_STROKE_COLOR}
      strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      >
      </rect>

      <rect 
      x={CONSTANTS.TOGGLE_WIDTH/4}
      y={CONSTANTS.TOGGLE_HEIGHT/4}
      width={CONSTANTS.TOGGLE_WIDTH/2}
      height={CONSTANTS.TOGGLE_HEIGHT/2}
      fill={CONSTANTS.GATE_FILL_COLOR}
      stroke={CONSTANTS.GATE_STROKE_COLOR}
      strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      rx={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
      ry={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
      >
      </rect>

      <circle 
      cx={CONSTANTS.TOGGLE_WIDTH/4 + CONSTANTS.TOGGLE_CAPSULE_RADIUS } 
      cy={CONSTANTS.TOGGLE_HEIGHT/2} 
      r={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
      fill={CONSTANTS.GATE_FILL_COLOR}
      stroke={CONSTANTS.GATE_STROKE_COLOR}
      strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      
      />

      <circle
      className="render-gate-pin"
      
      cx={CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X}
      cy={CONSTANTS.TOGGLE_HEIGHT/2}
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
      <line
        x1={10}
        y1={CONSTANTS.INPUT_PIN_Y}
        x2={CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.INPUT_PIN_Y}
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
        d={GATE.not_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="render-gate-pin"
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y}
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

// gates_svg.js

export function RenderCLOCK() {
  return (
    <g transform={`scale(${0.9}) translate(5,-7)`}>
      {/* Clock body - rectangle like your design */}
      <rect
        x={0}
        y={5}
        width={CONSTANTS.GATE_WIDTH}
        height={CONSTANTS.GATE_HEIGHT - 10}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        
      />
      
      {/* CLK text */}
      <text
        x={CONSTANTS.GATE_WIDTH / 2}
        y={CONSTANTS.GATE_HEIGHT / 2 +7}
        textAnchor="middle"
        fontSize={20}
        fill="#a0aec0"
        fontWeight="bold"
      >
        CLK
      </text>
      
      {/* Output wire stub */}
      <line
        x1={CONSTANTS.GATE_WIDTH}
        y1={CONSTANTS.OUTPUT_PIN_Y}
        x2={CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X}
        y2={CONSTANTS.OUTPUT_PIN_Y}
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
