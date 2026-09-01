export function getSVGPoint(e, svgRef, view) {
  const rect = svgRef.current.getBoundingClientRect();

  return {
    x: view.x + ((e.clientX - rect.left) / rect.width) * view.width,
    y: view.y + ((e.clientY - rect.top) / rect.height) * view.height
  };
}