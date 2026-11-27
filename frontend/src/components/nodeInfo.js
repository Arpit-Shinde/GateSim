import { useState } from "react";

function formatBits(bits, compact) {
  if (!bits || bits.length === 0) return "—";
  if (bits.length === 1) return bits[0] ? "1" : "0";
  const bin = [...bits].reverse().map((b) => (b ? "1" : "0")).join("");
  const n = window.BigInt("0b" + bin);
  if (compact) return `${bin} (${n.toString(10)})`;
  const hex = n.toString(16).toUpperCase().padStart(Math.ceil(bits.length / 4), "0");
  return `${bin}  (dec ${n.toString(10)}, hex 0x${hex})`;
}

function outputPins(node) {
  let widths;
  if (node.outWidths) widths = node.outWidths;
  else if (node.type === "WIRE") widths = [node.width ?? 1];
  else if (node.type === "BUS_OUT") widths = [node.width];
  else widths = (node.value ?? []).map(() => 1);

  let off = 0;
  return widths.map((w, i) => {
    const bits = (node.value ?? []).slice(off, off + w);
    off += w;
    return { index: i, width: w, bits };
  });
}

function describeSource(input, graph) {
  if (!input || input.index === -1) return "unconnected";
  if (input.id === "__CUSTOM_INPUT__") return "external signal";
  const src = graph[input.id];
  if (!src) return `#${input.id} (missing)`;
  return `${src.type}#${src.id}, pin ${input.index}`;
}

function summaryRows(node, graph, compact) {
  const rows = [];
  rows.push(["Type", node.name ? `${node.type} (${node.name})` : node.type]);
  rows.push(["ID", String(node.id)]);

  if (node.type === "WIRE") {
    rows.push(["Bit width", `${node.width ?? 1}`]);
    rows.push(["Source", describeSource(node.inputs?.[0], graph)]);
  } else if (node.type === "BUS_IN" || node.type === "BUS_OUT") {
    rows.push(["Bit width", `${node.width}`]);
  } else if (node.type === "SPLITTER") {
    rows.push(["Split", `${node.width} → [${node.outWidths.join(", ")}]`]);
  } else if (node.type === "JOINER") {
    rows.push(["Join", `[${node.inWidths.join(", ")}] → ${node.width}`]);
  } else if (node.type === "CUSTOM") {
    if (node.inWidths?.some((w) => w > 1)) rows.push(["Input widths", `[${node.inWidths.join(", ")}]`]);
    if (node.outWidths?.some((w) => w > 1)) rows.push(["Output widths", `[${node.outWidths.join(", ")}]`]);
  }

  const pins = outputPins(node);
  if (node.type !== "TEXT" && pins.length > 0) {
    if (pins.length === 1) {
      rows.push(["Value", formatBits(pins[0].bits, compact)]);
    } else if (!compact) {
      pins.forEach((p) => rows.push([`Out pin ${p.index} (${p.width}b)`, formatBits(p.bits, false)]));
    } else {
      rows.push(["Value", pins.map((p) => formatBits(p.bits, true)).join(" | ")]);
    }
  }
  return rows;
}

export function HoverInfo({ node, graph }) {
  if (!node) return null;
  const rows = summaryRows(node, graph, true);
  return (
    <div className="node-info">
      {rows.map(([k, v]) => (
        <div key={k} className="node-info-row">
          <span className="node-info-key">{k}</span>
          <span className="node-info-val">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function PropertiesDialog({ node, graph, onClose }) {
  const [full, setFull] = useState(false);
  if (!node) return null;

  const rows = summaryRows(node, graph, false);
  if (typeof node.x === "number") {
    rows.push(["Position", `x ${Math.round(node.x)}, y ${Math.round(node.y)}`]);
    rows.push(["Rotation", `${node.rotation ?? 0}°`]);
    rows.push(["Z-order", `${node.z ?? 0}`]);
  }
  if (node.type === "CLOCK") rows.push(["Delay", `${node.delay} ms`]);
  if (node.type === "TEXT") rows.push(["Text", node.text]);
  if (node.type === "CUSTOM") rows.push(["Internal nodes", `${node.ref_graph?.length ?? 0}`]);

  const inputs = node.inputs ?? [];
  const outputs = node.outputs ?? [];

  let inputNames = [];
  if (node.type === "CUSTOM") {
    const seen = new Set();
    for (const e of node.ext_inputs ?? []) {
      if (seen.has(e.sourceId)) continue;
      seen.add(e.sourceId);
      inputNames.push(e.name || "");
    }
  }

  const raw = JSON.stringify(
    node,
    (key, value) =>
      key === "ref_graph" && !full && Array.isArray(value)
        ? `<${value.length} internal nodes — tick the box to show>`
        : value,
    2
  );

  return (
    <div className="component-dialog-overlay" onClick={onClose}>
      <div className="component-dialog props-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Properties</h2>

        <table className="props-table">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="props-scroll">
          <h3>Inputs ({inputs.length})</h3>
          {inputs.length === 0 && <div className="props-muted">none</div>}
          {inputs.map((inp, i) => {
            const w = node.inWidths?.[i] ?? (node.type === "WIRE" ? node.width ?? 1 : 1);
            const nm = inputNames[i] ? ` "${inputNames[i]}"` : "";
            return (
              <div key={i} className="props-line">
                pin {i}{nm} [{w} bit{w > 1 ? "s" : ""}] ← {describeSource(inp, graph)}
              </div>
            );
          })}

          <h3>Outputs / fan-out ({outputs.length})</h3>
          {outputs.length === 0 && <div className="props-muted">none</div>}
          {outputs.map((id, i) => {
            const t = graph[id];
            return (
              <div key={i} className="props-line">
                → {t ? `${t.type}#${t.id}` : `#${id}`}
              </div>
            );
          })}

          <h3>Raw object</h3>
          <label className="props-muted">
            <input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} /> include ref_graph (custom components)
          </label>
          <pre className="props-json">{raw}</pre>
        </div>

        <div className="component-dialog-buttons">
          <button onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}