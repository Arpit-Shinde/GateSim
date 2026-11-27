import { useState } from "react";
import { parseDesign, MAX_BUS_WIDTH } from "../utils/busUtils";

const TITLES = {
  BUS_IN: "Bus Input",
  BUS_OUT: "Bus Output",
  SPLITTER: "Wire Splitter",
  JOINER: "Wire Joiner",
};

export function BusDialog({ mode, onCancel, onConfirm }) {
  const needsDesign = mode === "SPLITTER" || mode === "JOINER";
  const [total, setTotal] = useState("8");
  const [design, setDesign] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const t = total.trim();
    if (!/^\d+$/.test(t)) {
      setError("Bit width must be a whole number.");
      return;
    }
    const w = Number(t);
    if (w < 1 || w > MAX_BUS_WIDTH) {
      setError(`Bit width must be between 1 and ${MAX_BUS_WIDTH}.`);
      return;
    }
    if (!needsDesign) {
      onConfirm({ width: w });
      return;
    }
    const res = parseDesign(design, w);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onConfirm({ width: w, parts: res.parts });
  }

  const onKey = (e) => {
    e.stopPropagation(); // keep Delete / Ctrl+V global shortcuts away from the inputs
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="text-edit-overlay" onClick={onCancel}>
      <div className="text-edit-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="text-edit-title">{TITLES[mode]}</div>

        <label className="bus-dialog-label">Total number of bits</label>
        <input
          className="text-edit-input"
          autoFocus
          inputMode="numeric"
          value={total}
          onChange={(e) => {
            setTotal(e.target.value);
            setError("");
          }}
          onKeyDown={onKey}
        />

        {needsDesign && (
          <>
            <label className="bus-dialog-label">
              {mode === "SPLITTER" ? "Output design" : "Input design"}
            </label>
            <input
              className="text-edit-input"
              placeholder="e.g. 4 4 4 4 16"
              value={design}
              onChange={(e) => {
                setDesign(e.target.value);
                setError("");
              }}
              onKeyDown={onKey}
            />
            <div className="text-edit-hint">
              Part widths separated by spaces, listed from bit 0 upward (first
              number = lowest bits = top pin).
            </div>
          </>
        )}

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