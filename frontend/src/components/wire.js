import { WIRE_COLOR,WIRE_STROKE_WIDTH, GRID_SIZE } from "../constants/constants";

export function LiveWire({ start, end }) {

  const path = `
  M ${Math.round(start[0]/GRID_SIZE)*GRID_SIZE},${Math.round(start[1]/GRID_SIZE)*GRID_SIZE}
  L ${Math.round(end[0]/GRID_SIZE)*GRID_SIZE},${Math.round(end[1]/GRID_SIZE)*GRID_SIZE}
  
`;
// console.log(end[0], end[1])

  return (
    <path
      d={path}
      stroke={WIRE_COLOR}
      fill="none"
      strokeWidth="3"
      style={{ pointerEvents: "stroke" }}
    />
  );
}

export function RenderUncommitedWire({ path }) {

    if (!path || path.length < 2) return null;

    const d = path
        .map((point, i) =>
            `${i === 0 ? "M" : "L"} ${Math.round(point.x/GRID_SIZE)*GRID_SIZE} ${Math.round(point.y/GRID_SIZE)*GRID_SIZE}`
        )
        .join(" ");

    return (
        <path
            d={d}
            stroke={WIRE_COLOR}
            strokeWidth={WIRE_STROKE_WIDTH}
            fill="none"
            pointerEvents="none"
        />
    );
}
