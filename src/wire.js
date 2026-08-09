export function Wire({ start, end, from, to, inputIndex, onClick }) {
  const dx = end[0] - start[0];

  const controlOffset = Math.abs(dx) * 0.5;

  const path = `
    M ${start[0]},${start[1]}
    C ${start[0] + controlOffset},${start[1]}
      ${end[0] - controlOffset},${end[1]}
      ${end[0]},${end[1]}
  `;

  return (
    <path
      d={path}
      stroke="black"
      fill="none"
      strokeWidth="3"
      onClick={() => { onClick({ from, to, inputIndex }) }}
      style={{ pointerEvents: "stroke" }}
    />
  );
}

export function LiveWire({start, end}){
  const dx = end[0] - start[0];

  const controlOffset = Math.abs(dx) * 0.5;

  const path = `
    M ${start[0]},${start[1]}
    C ${start[0] + controlOffset},${start[1]}
      ${end[0] - controlOffset},${end[1]}
      ${end[0]},${end[1]}
  `;

  return (
    <path
      d={path}
      stroke="black"
      fill="none"
      strokeWidth="3"
      style={{ pointerEvents: "stroke" }}
    />
  );
}
