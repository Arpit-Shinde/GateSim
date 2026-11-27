import { useState } from "react";
import { MAX_BUS_WIDTH } from "../utils/busUtils";

function parseBits(str) {
  const tokens = (str ?? "").trim().split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0)
    return { ok: false, error: "Enter a binary value, e.g. 0 0 1 0" };
  if (tokens.length > MAX_BUS_WIDTH)
    return { ok: false, error: `At most ${MAX_BUS_WIDTH} bits allowed.` };
  for (const t of tokens) {
    if (!/^[01]$/.test(t))
      return { ok: false, error: `"${t}" is not a binary digit (use 0 or 1).` };
  }
  // User enters MSB-first, left-to-right.  node.value[0] = LSB (rightmost cell).
  const msbFirst = tokens.map((t) => t === "1");
  const value = [...msbFirst].reverse();
  return { ok: true, value };
}

export function ConstantDialog({ initialValue, onCancel, onConfirm }) {
  const initialStr = initialValue
    ? [...initialValue].reverse().map((b) => (b ? "1" : "0")).join(" ")
    : "0";
  const [input, setInput] = useState(initialStr);
  const [error, setError] = useState("");

  function submit() {
    const res = parseBits(input);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (initialValue && res.value.length !== initialValue.length) {
      setError(
        `Cannot change width while editing (current: ${initialValue.length} bits). Delete and re-add if you need a different width.`
      );
      return;
    }
    onConfirm({ value: res.value });
  }

  const onKey = (e) => {
    e.stopPropagation();
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="text-edit-overlay" onClick={onCancel}>
      <div className="text-edit-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="text-edit-title">
          {initialValue ? "Edit Constant" : "Constant Value"}
        </div>
        <label className="bus-dialog-label">Binary value</label>
        <input
          className="text-edit-input"
          autoFocus
          placeholder="e.g. 0 1 0 1"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          onKeyDown={onKey}
        />
        <div className="text-edit-hint">
          Bits separated by spaces, MSB first (leftmost = MSB). Length sets the
          constant's bit width.
        </div>
        {error && <div className="bus-dialog-error">{error}</div>}
        <div className="text-edit-buttons">
          <button className="utilities-button" onClick={onCancel}>
            CANCEL
          </button>
          <button className="utilities-button primary" onClick={submit}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}