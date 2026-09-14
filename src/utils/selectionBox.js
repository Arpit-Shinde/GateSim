// utils/selectionBox.js
import * as CONSTANTS from "../constants/constants";

export function getNodeBoundingBox(node) {
  if (node.type === "WIRE") {
    if (!node.path || node.path.length === 0) return null;

    const xs = node.path.map(p => p.x);
    const ys = node.path.map(p => p.y);

    return {
      x0: Math.min(...xs),
      x1: Math.max(...xs),
      y0: Math.min(...ys),
      y1: Math.max(...ys)
    };
  }

  if (typeof node.x !== "number" || typeof node.y !== "number") {
    return null;
  }

  // Same width/height-swap-on-rotation logic RotateGate() already uses.
  const rotated = (node.rotation ?? 0) % 180 !== 0;
  const width = rotated ? CONSTANTS.GATE_HEIGHT : CONSTANTS.GATE_WIDTH;
  const height = rotated ? CONSTANTS.GATE_WIDTH : CONSTANTS.GATE_HEIGHT;

  return {
    x0: node.x,
    x1: node.x + width,
    y0: node.y,
    y1: node.y + height
  };
}

export function isNodeFullyContained(node, rect) {
  const box = getNodeBoundingBox(node);
  if (!box) return false;

  const rx0 = Math.min(rect.x0, rect.x1);
  const rx1 = Math.max(rect.x0, rect.x1);
  const ry0 = Math.min(rect.y0, rect.y1);
  const ry1 = Math.max(rect.y0, rect.y1);

  return (
    box.x0 >= rx0 &&
    box.x1 <= rx1 &&
    box.y0 >= ry0 &&
    box.y1 <= ry1
  );
}