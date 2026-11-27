export const BUS_TYPES = new Set(["BUS_IN", "BUS_OUT", "SPLITTER", "JOINER"]);

export const BUS_BIT_SIZE = 40;
export const SPLIT_W = 50;
export const SPLIT_PITCH = 24;
export const MAX_BUS_WIDTH = 64;
export const MAX_PARTS = 64;

export const splitterHeight = (k) => SPLIT_PITCH * k + 16;
export const pinY = (i) => 20 + SPLIT_PITCH * i;

export function rangeLabel(off, w) {
  return w === 1 ? `${off}` : `${off + w - 1}:${off}`;
}

export function busNodeSize(node) {
  switch (node.type) {
    case "BUS_IN":
    case "BUS_OUT":
      return { w: node.width * BUS_BIT_SIZE, h: BUS_BIT_SIZE };
    case "CONSTANT":
      return { w: node.width * BUS_BIT_SIZE, h: BUS_BIT_SIZE };  // NEW

    case "SPLITTER":
      return { w: SPLIT_W, h: splitterHeight(node.outWidths.length) };
    case "JOINER":
      return { w: SPLIT_W, h: splitterHeight(node.inWidths.length) };
    default:
      return null;
  }
}

// Width (in bits) of an output pin
export function outPinWidth(node, index) {
  if (!node) return 1;
  if (node.type === "WIRE") return node.width ?? 1;
  return node.outWidths?.[index] ?? 1;
}

// Width (in bits) of an input pin
export function inPinWidth(node, index) {
  if (!node) return 1;
  if (node.type === "WIRE") return node.width ?? 1;
  return node.inWidths?.[index] ?? 1;
}

// "4 4 4 4 16" -> {ok:true, parts:[4,4,4,4,16]} or {ok:false, error}
export function parseDesign(str, total) {
  const tokens = (str ?? "").trim().split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) {
    return { ok: false, error: "Enter the design, e.g. 4 4 8" };
  }
  const parts = [];
  for (const t of tokens) {
    if (!/^\d+$/.test(t)) {
      return { ok: false, error: `"${t}" is not a positive whole number.` };
    }
    const n = Number(t);
    if (n < 1) return { ok: false, error: "Every part must be at least 1 bit." };
    parts.push(n);
  }
  if (parts.length < 2) {
    return { ok: false, error: "Use at least two parts." };
  }
  if (parts.length > MAX_PARTS) {
    return { ok: false, error: `At most ${MAX_PARTS} parts are allowed.` };
  }
  const sum = parts.reduce((a, b) => a + b, 0);
  if (sum !== total) {
    const diff = Math.abs(total - sum);
    return {
      ok: false,
      error: `Parts add up to ${sum}, but total is ${total} (${diff} bit${diff > 1 ? "s" : ""} ${sum < total ? "short" : "too many"}).`,
    };
  }
  return { ok: true, parts };
}