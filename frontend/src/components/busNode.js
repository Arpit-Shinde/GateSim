import * as CONSTANTS from "../constants/constants";
import {
  BUS_BIT_SIZE as B,
  rangeLabel,
  
} from "../utils/busUtils";

const STROKE = CONSTANTS.GATE_STROKE_COLOR;
const SW = CONSTANTS.GATE_STROKE_WIDTH;

function Bits({ node, interactive, toggle, didDrag, startDrag, setSelectedGate }) {
  const n = node.width;
  const cells = [];
  for (let i = 0; i < n; i++) {
    const x = (n - 1 - i) * B; // MSB on the left
    const on = !!node.value?.[i];
    cells.push(
      <g key={i}>
        <rect
          x={x}
          y={0}
          width={B}
          height={B}
          fill={on ? CONSTANTS.BULB_ON_COLOR : CONSTANTS.GATE_FILL_COLOR}
          stroke={STROKE}
          strokeWidth={SW}
          style={{ cursor: interactive ? "pointer" : "default" }}
          onMouseDown={(e) => startDrag(e, node.id)}
          onMouseUp={() => {
            if (interactive && !didDrag.current) toggle(node.id, i);
          }}
          onClick={() => {
            setSelectedGate({ id: node.id });
            return true;
          }}
        />
        <text
          x={x + B / 2}
          y={B / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={B * 0.5}
          fontFamily="monospace"
          fill={STROKE}
          pointerEvents="none"
          style={{ userSelect: "none" }}
        >
          {on ? "1" : "0"}
        </text>
        <text
          x={x + B - 2}
          y={B - 2}
          textAnchor="end"
          fontSize={8}
          fill="#8a8a8a"
          opacity={0.75}
          pointerEvents="none"
          style={{ userSelect: "none" }}
        >
          {i}
        </text>
      </g>
    );
  }
  return <>{cells}</>;
}

export function BusNode({
  node,
  toggle,
  didDrag,
  startDrag,
  setoutputpin,
  setinputpin,
  setSelectedGate,
  isSelected,
  outputPinPosition,
}) {
  const rot = node.rotation ?? 0;
  const gateClass = `actual-gate ${isSelected ? "selected-gate" : ""}`;
  const transform = `translate(${node.x}, ${node.y}) rotate(${rot})`;

  const inPin = (idx, cx, cy) => (
    <circle
      className="pin"
      onMouseUp={(e) => e.stopPropagation()}
      onClick={() => {
        const p = outputPinPosition(cx, cy);
        setinputpin(node.id, idx, p.x, p.y);
      }}
      cx={cx}
      cy={cy}
      r={CONSTANTS.PIN_RADIUS}
      fill={CONSTANTS.GATE_FILL_COLOR}
      stroke={STROKE}
      strokeWidth={SW}
    />
  );

  const outPin = (idx, cx, cy) => (
    <circle
      className="pin"
      onClick={() => {
        const p = outputPinPosition(cx, cy);
        setoutputpin(node.id, idx, p.x, p.y);
      }}
      cx={cx}
      cy={cy}
      r={CONSTANTS.PIN_RADIUS}
      fill={CONSTANTS.GATE_FILL_COLOR}
      stroke={STROKE}
      strokeWidth={SW}
    />
  );

  const small = (x, y, txt, anchor = "start") => (
    <text x={x} y={y} fontSize={10} fill="#626b78" textAnchor={anchor} dominantBaseline="central" pointerEvents="none" style={{ userSelect: "none" }}>
      {txt}
    </text>
  );

  if (node.type === "BUS_IN") {
    const W = node.width * B;
    return (
      <g transform={transform} className={gateClass}>
        <Bits node={node} interactive toggle={toggle} didDrag={didDrag} startDrag={startDrag} setSelectedGate={setSelectedGate} />
        {outPin(0, W, B / 2)}
      </g>
    );
  }

  if (node.type === "BUS_OUT") {
    return (
      <g transform={transform} className={gateClass}>
        <Bits node={node} interactive={false} toggle={toggle} didDrag={didDrag} startDrag={startDrag} setSelectedGate={setSelectedGate} />
        {inPin(0, 0, B / 2)}
      </g>
    );
  }

  if (node.type === "SPLITTER") {
    const parts = node.outWidths;
    const W = CONSTANTS.GRID_SIZE * 2;
    const H = parts.length * CONSTANTS.GRID_SIZE;
    const rectY = -CONSTANTS.GRID_SIZE / 2;
    
    // Snaps the input pin strictly to the nearest grid intersection
    const inY = Math.round((parts.length - 1) / 2) * CONSTANTS.GRID_SIZE;
    let off = 0;
    
    return (
      <g transform={transform} className={gateClass}>
        <rect
          x={0}
          y={rectY}
          width={W}
          height={H}
          rx={4}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={STROKE}
          strokeWidth={SW}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id });
            return true;
          }}
        />
        {small(8, inY, `${node.width}`, "start")}
        {parts.map((w, i) => {
          const y = i * CONSTANTS.GRID_SIZE;
          const label = rangeLabel(off, w);
          off += w;
          return (
            <g key={i}>
              {small(W - 8, y, label, "end")}
              {outPin(i, W, y)}
            </g>
          );
        })}
        {inPin(0, 0, inY)}
      </g>
    );
  }

  if (node.type === "JOINER") {
    const parts = node.inWidths;
    const W = CONSTANTS.GRID_SIZE * 2;
    const H = parts.length * CONSTANTS.GRID_SIZE;
    const rectY = -CONSTANTS.GRID_SIZE / 2;
    
    // Snaps the output pin strictly to the nearest grid intersection
    const outY = Math.round((parts.length - 1) / 2) * CONSTANTS.GRID_SIZE;
    let off = 0;

    return (
      <g transform={transform} className={gateClass}>
        <rect
          x={0}
          y={rectY}
          width={W}
          height={H}
          rx={4}
          fill={CONSTANTS.GATE_FILL_COLOR}
          stroke={STROKE}
          strokeWidth={SW}
          onMouseDown={(e) => startDrag(e, node.id)}
          onClick={() => {
            setSelectedGate({ id: node.id });
            return true;
          }}
        />
        {small(W - 8, outY, `${node.width}`, "end")}
        {parts.map((w, i) => {
          const y = i * CONSTANTS.GRID_SIZE;
          const label = rangeLabel(off, w);
          off += w;
          return (
            <g key={i}>
              {small(8, y, label, "start")}
              {inPin(i, 0, y)}
            </g>
          );
        })}
        {outPin(0, W, outY)}
      </g>
    );
  }

  return null;
}

/* ───────── toolbar previews ───────── */

function PreviewBits({ pattern }) {
  return (
    <g>
      {pattern.map((on, i) => (
        <g key={i}>
          <rect x={i * 16} y={8} width={16} height={16} fill={on ? CONSTANTS.BULB_ON_COLOR : "#fff"} stroke="#000" strokeWidth={0.7} />
          <text x={i * 16 + 8} y={16} textAnchor="middle" dominantBaseline="central" fontSize={9} fontFamily="monospace" fill="#000">
            {on ? 1 : 0}
          </text>
          <text x={i * 16 + 14} y={22} textAnchor="end" fontSize={4} fill="#888">
            {pattern.length - 1 - i}
          </text>
        </g>
      ))}
    </g>
  );
}

export function RenderBUS_IN() {
  return (
    <g>
      <PreviewBits pattern={[true, false, true, false]} />
      <line x1={64} y1={16} x2={78} y2={16} stroke="#000" strokeWidth={0.7} />
      <circle cx={76} cy={16} r={3} fill="#fff" stroke="#000" strokeWidth={0.7} />
    </g>
  );
}

export function RenderBUS_OUT() {
  return (
    <g transform="translate(14,0)">
      <line x1={0} y1={16} x2={-12} y2={16} stroke="#000" strokeWidth={0.7} />
      <circle cx={-12} cy={16} r={3} fill="#fff" stroke="#000" strokeWidth={0.7} />
      <PreviewBits pattern={[false, true, true, false]} />
    </g>
  );
}

export function RenderSPLITTER() {
  return (
    <g transform="translate(8,4)">
      <rect x={0} y={0} width={24} height={32} rx={2} fill="#fff" stroke="#000" strokeWidth={0.7} />
      <circle cx={0} cy={16} r={2.5} fill="#fff" stroke="#000" strokeWidth={0.7} />
      {[6, 16, 26].map((y) => (
        <circle key={y} cx={24} cy={y} r={2.5} fill="#fff" stroke="#000" strokeWidth={0.7} />
      ))}
    </g>
  );
}

export function RenderJOINER() {
  return (
    <g transform="translate(8,4)">
      <rect x={0} y={0} width={24} height={32} rx={2} fill="#fff" stroke="#000" strokeWidth={0.7} />
      {[6, 16, 26].map((y) => (
        <circle key={y} cx={0} cy={y} r={2.5} fill="#fff" stroke="#000" strokeWidth={0.7} />
      ))}
      <circle cx={24} cy={16} r={2.5} fill="#fff" stroke="#000" strokeWidth={0.7} />
    </g>
  );
}

export const busInputToolList = [
  { type: "BUS_IN", render: RenderBUS_IN },
  { type: "SPLITTER", render: RenderSPLITTER },
  { type: "JOINER", render: RenderJOINER },
];

export const busOutputToolList = [{ type: "BUS_OUT", render: RenderBUS_OUT }];