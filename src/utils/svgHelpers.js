import { GRID_SIZE } from "../constants/constants";

function snap(x,y){
  return {x : Math.round(x/GRID_SIZE)*GRID_SIZE, y: Math.round(y/GRID_SIZE)*GRID_SIZE}
}

export function getSVGPoint(e, svgRef, view) {
  const rect = svgRef.current.getBoundingClientRect();
  return snap(view.x + ((e.clientX - rect.left) / rect.width) * view.width,
view.y + ((e.clientY - rect.top) / rect.height) * view.height)
}