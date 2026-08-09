import evaluate from "./evaluate"
import * as CONSTANTS from "./constants";

const r = CONSTANTS.GATE_HEIGHT / 2;



const and_path = `
  M 0 0
  H ${CONSTANTS.GATE_WIDTH - r}
  A ${r} ${r} 0 0 1 ${CONSTANTS.GATE_WIDTH} ${r}
  A ${r} ${r} 0 0 1 ${CONSTANTS.GATE_WIDTH - r} ${CONSTANTS.GATE_HEIGHT}
  H 0
  Z
`;


const bulb_path = `
  M 0 ${CONSTANTS.BULB_WIDTH}
  V ${CONSTANTS.BULB_WIDTH/2}
  A ${CONSTANTS.BULB_WIDTH/2} ${CONSTANTS.BULB_WIDTH/2} 0 0 1 ${CONSTANTS.BULB_WIDTH} ${CONSTANTS.BULB_WIDTH/2}
  V ${CONSTANTS.BULB_WIDTH}
  Z
`;

const nand_path = `
  M 0 0
  H ${CONSTANTS.GATE_WIDTH - (CONSTANTS.GATE_HEIGHT / 2) - 8}
  A ${CONSTANTS.GATE_HEIGHT / 2} ${CONSTANTS.GATE_HEIGHT / 2} 0 0 1 ${CONSTANTS.GATE_WIDTH - 8} ${CONSTANTS.GATE_HEIGHT / 2}
  A ${CONSTANTS.GATE_HEIGHT / 2} ${CONSTANTS.GATE_HEIGHT / 2} 0 0 1 ${CONSTANTS.GATE_WIDTH - (CONSTANTS.GATE_HEIGHT / 2) - 8} ${CONSTANTS.GATE_HEIGHT}
  H 0
  Z
`;

const or_path = `
  M 0 0
  
  H ${CONSTANTS.GATE_WIDTH * 0.4}
  
  C 
    ${CONSTANTS.GATE_WIDTH * 0.8} 0,
    ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.2},
    ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.5}
  
  C 
    ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.8},
    ${CONSTANTS.GATE_WIDTH * 0.8} ${CONSTANTS.GATE_HEIGHT},
    ${CONSTANTS.GATE_WIDTH * 0.4} ${CONSTANTS.GATE_HEIGHT}
  
  H 0
  
  Q 
    ${CONSTANTS.GATE_WIDTH * 0.3} ${CONSTANTS.GATE_HEIGHT * 0.5},
    0 0
    
  Z
`;

const not_path = `
  M 0 0
  L ${CONSTANTS.GATE_WIDTH} ${CONSTANTS.GATE_HEIGHT * 0.5}
  L 0 ${CONSTANTS.GATE_HEIGHT}
  Z
`;

const xor_extra_curve_path = `
  M ${CONSTANTS.GATE_WIDTH * -0.08} 0
  Q ${CONSTANTS.GATE_WIDTH * 0.17} ${CONSTANTS.GATE_HEIGHT * 0.5}, ${CONSTANTS.GATE_WIDTH * -0.08} ${CONSTANTS.GATE_HEIGHT}
`;



export function Gate({ node, toggle, graph, didDrag, startDrag, setoutputpin, setinputpin, setSelectedGate, setSelectedWire }) {

  if (node.type === "INPUT") {
    return (
      <g
        transform={`translate(${node.x}, ${node.y})`}
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
        onMouseDown={(e) => startDrag(e, node.id)}
        onMouseUp={() => {
          if (!didDrag) toggle(node.id);
        }}>
        </rect>

        <rect 
        x={CONSTANTS.TOGGLE_WIDTH/4}
        y={CONSTANTS.TOGGLE_HEIGHT/4}
        width={CONSTANTS.TOGGLE_WIDTH/2}
        height={CONSTANTS.TOGGLE_HEIGHT/2}
        fill={node.value ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        rx={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        ry={CONSTANTS.TOGGLE_CAPSULE_RADIUS}
        >
        </rect>

        <circle 
        cx={node.value? 3*CONSTANTS.TOGGLE_WIDTH/4 - CONSTANTS.TOGGLE_CAPSULE_RADIUS : CONSTANTS.TOGGLE_WIDTH/4 + CONSTANTS.TOGGLE_CAPSULE_RADIUS } 
        cy={CONSTANTS.TOGGLE_HEIGHT/2} 
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
        onClick={() => { setoutputpin(node.id) }}
        cx={CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.TOGGLE_HEIGHT/2}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />

        
 

        {/* <rect onMouseUp={() => {
          if (!didDrag) toggle(node.id);
        }}
          width="70"
          height="40"
          rx="5"
          fill={node.value ? "limegreen" : "gray"}
          stroke="black"
          strokeWidth="2"
          onMouseDown={(e) => startDrag(e, node.id)}
        />

        <text
          x="35"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          pointerEvents="none"
        >
          INPUT
        </text>

        <circle onClick={() => { setoutputpin(node.id) }} cx={CONSTANTS.GATE_WIDTH} cy={CONSTANTS.GATE_HEIGHT / 2} r="4" /> */}
      </g>
    );
  }

  else if (node.type === "BULB") {
  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      
      <line
        x1={CONSTANTS.BULB_PIN_X}
        y1={CONSTANTS.BULB_PIN_Y}
        x2={CONSTANTS.BULB_PIN_X}
        y2={CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH} // Length of the pin wire
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      
      {/* Tiny Bulb shape pointing up */}
      <path
        d={bulb_path}
        fill={evaluate(node.id, graph) ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        onMouseDown={(e) => startDrag(e, node.id)}
        onClick={() => {
          setSelectedGate({ id: node.id })
          setSelectedWire(null)
          return true
        }}
      />
      
      
      
      {/* Input pin at the very bottom of the wire */}
      <circle
        className="pin"
        onClick={() => { setinputpin(node.id, 0) }}
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
      <g
        transform={`translate(${node.x}, ${node.y})`}
      >
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
            setSelectedWire(null)
            return true
          }
          }
        />


        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 0)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => { setoutputpin(node.id) }}
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
      <g
        transform={`translate(${node.x}, ${node.y})`}
      >
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
            setSelectedWire(null)
            return true
          }
          }
        />


        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 0)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => { setoutputpin(node.id) }}
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
      <g
        transform={`translate(${node.x}, ${node.y})`}
      >
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
            setSelectedWire(null)
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
          onClick={() => setinputpin(node.id, 0)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => { setoutputpin(node.id) }}
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
      <g
        transform={`translate(${node.x}, ${node.y})`}
      >
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
            setSelectedWire(null)
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
          onClick={() => setinputpin(node.id, 0)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => { setoutputpin(node.id) }}
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
      <g
        transform={`translate(${node.x}, ${node.y})`}
      >
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
            setSelectedWire(null)
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
          onClick={() => setinputpin(node.id, 0)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => { setoutputpin(node.id) }}
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
      <g
        transform={`translate(${node.x}, ${node.y})`}
      >
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

        {/* Main Filled Gate Body */}
        <path
          d={or_path}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            setSelectedWire(null)
            return true
          }}
        />

        {/* Extra XNOR Curve (Stroke only, no fill!) */}
        <path
          d={xor_extra_curve_path}
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

        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 0)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_TOP}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => setinputpin(node.id, 1)}
          cx={CONSTANTS.INPUT_PIN_X}
          cy={CONSTANTS.INPUT_PIN_Y_BOTTOM}
          r={CONSTANTS.PIN_RADIUS}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={CONSTANTS.GATE_STROKE_COLOR}
          strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        />
        <circle
          className="pin"
          onClick={() => { setoutputpin(node.id) }}
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
    <g
      transform={`translate(${node.x}, ${node.y})`}
    >
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
        d={not_path}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
        onMouseDown={(e) => startDrag(e, node.id)}
        onClick={() => {
          setSelectedGate({ id: node.id })
          setSelectedWire(null)
          return true
        }}
      />
      
      <circle
        className="pin"
        onClick={() => setinputpin(node.id, 0)}
        cx={CONSTANTS.INPUT_PIN_X}
        cy={CONSTANTS.INPUT_PIN_Y}
        r={CONSTANTS.PIN_RADIUS}
        fill={CONSTANTS.GATE_FILL_COLOR}
        stroke={CONSTANTS.GATE_STROKE_COLOR}
        strokeWidth={CONSTANTS.GATE_STROKE_WIDTH}
      />
      <circle
        className="pin"
        onClick={() => { setoutputpin(node.id) }}
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

  else {

    return (
      <g transform={`translate(${node.x}, ${node.y})`}>
        <rect
          width="70"
          height="40"
          rx="5"
          fill={evaluate(node.id, graph) ? "limegreen" : "gray"}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id })
            setSelectedWire(null)
            return true
          }
          }
        />
        <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
        <circle onClick={() => { setinputpin(node.id, 0) }} cx={0} cy={CONSTANTS.GATE_HEIGHT / 4} r="4" />
        <circle onClick={() => { setinputpin(node.id, 1) }} cx={0} cy={3 * CONSTANTS.GATE_HEIGHT / 4} r="4" />
        <circle onClick={() => { setoutputpin(node.id) }} cx={CONSTANTS.GATE_WIDTH} cy={CONSTANTS.GATE_HEIGHT / 2} r="4" />
      </g>
    )


  }
}

