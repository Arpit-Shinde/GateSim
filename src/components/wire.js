import { WIRE_COLOR,WIRE_STROKE_WIDTH } from "../constants/constants";

export function LiveWire({ start, end }) {

  const path = `
  M ${start[0]},${start[1]}
  L ${end[0]},${end[1]}
`;

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
            `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`
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
