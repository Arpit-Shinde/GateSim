import { useMemo, useRef, useEffect } from "react";
import * as CONSTANTS from "../constants/constants";

// Default output labels for built-in multi-output primitives.
// Anything not listed here falls back to a generic, still-readable name.
const KNOWN_OUTPUT_LABELS = {
  JK: ["Q", "Q̅"],
  HALF_ADDER: ["Sum", "Carry"],
  FULL_ADDER: ["Sum", "Cout"],
};

export function defaultSignalLabel(node, outputIndex) {
  if (node.type === "CUSTOM") {
    const out = node.ext_outputs?.[outputIndex];
    if (out?.name) return out.name;
    return `${node.name || "CUSTOM"}.O${outputIndex}`;
  }

  if (node.type === "CLOCK") return `CLK${node.id}`;
  if (node.type === "INPUT") return `IN${node.id}`;
  if (node.type === "WIRE") return `WIRE${node.id}`;

  const known = KNOWN_OUTPUT_LABELS[node.type];
  if (known && known[outputIndex] !== undefined) return known[outputIndex];

  if ((node.value?.length ?? 1) > 1) {
    return `${node.type}${node.id}.O${outputIndex}`;
  }

  return `${node.type}${node.id}`;
}

// Builds one or more SVG path "d" strings for a signal's step waveform.
// Returns multiple paths when the signal has a gap (e.g. it became
// disconnected mid-capture) so the line breaks instead of joining across
// unknown data.
function buildStepPaths(history, signalId, rowTop, rowHeight, pxPerMs) {
  const highY = rowTop + rowHeight * 0.22;
  const lowY = rowTop + rowHeight * 0.78;

  const runs = [];
  let current = [];

  for (const sample of history) {
    const v = sample.values[signalId];
    if (v === null || v === undefined) {
      if (current.length) {
        runs.push(current);
        current = [];
      }
      continue;
    }
    current.push({ t: sample.t, v });
  }
  if (current.length) runs.push(current);

  return runs.map(run => {
    const y0 = run[0].v ? highY : lowY;
    let d = `M ${(run[0].t * pxPerMs).toFixed(2)} ${y0}`;
    let prevV = run[0].v;

    for (let i = 1; i < run.length; i++) {
      const x = (run[i].t * pxPerMs).toFixed(2);
      const prevY = prevV ? highY : lowY;
      d += ` L ${x} ${prevY}`;

      if (run[i].v !== prevV) {
        const newY = run[i].v ? highY : lowY;
        d += ` L ${x} ${newY}`;
        prevV = run[i].v;
      }
    }

    return d;
  });
}

// Chooses a "nice" tick spacing (in ms) so the axis shows roughly 6-10 ticks
// regardless of how long the capture has run.
function computeTicks(maxT) {
  if (maxT <= 0) return [0];

  const niceSteps = [10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000];
  const targetTicks = 8;

  let step = niceSteps[niceSteps.length - 1];
  for (const s of niceSteps) {
    if (maxT / s <= targetTicks) {
      step = s;
      break;
    }
  }

  const ticks = [];
  for (let t = 0; t <= maxT; t += step) ticks.push(t);
  if (ticks[ticks.length - 1] !== maxT) ticks.push(maxT);

  return ticks;
}

export function TimingDiagram({
  signals,
  history,
  isCapturing,
  onStart,
  onPause,
  onClear,
  onAddSelectedSignal,
  onRemoveSignal,
  onClearSignals,
  onRenameSignal,
  onClose
}) {
  const rowHeight = CONSTANTS.TIMING_ROW_HEIGHT;
  const axisHeight = CONSTANTS.TIMING_AXIS_HEIGHT;
  const pxPerMs = CONSTANTS.TIMING_PX_PER_MS;

  const maxT = history.length ? history[history.length - 1].t : 0;
  const svgWidth = Math.max(400, maxT * pxPerMs + 40);
  const svgHeight = signals.length * rowHeight + axisHeight;

  const ticks = useMemo(() => computeTicks(maxT), [maxT]);

  const signalPaths = useMemo(() => {
    return signals.map((sig, i) => ({
      sig,
      paths: buildStepPaths(history, sig.id, i * rowHeight, rowHeight, pxPerMs)
    }));
  }, [signals, history, rowHeight, pxPerMs]);

  // 1. Create a reference for the scrollable container
  const scrollRef = useRef(null);

  // 2. Add an effect to auto-scroll to the right edge when new data arrives
  useEffect(() => {
    if (scrollRef.current && isCapturing) {
      const container = scrollRef.current;
      // Instantly jump to the far right edge of the scroll area
      container.scrollLeft = container.scrollWidth;
    }
  }, [maxT, isCapturing]);

  return (
    <div className="timing-panel">
      <div className="timing-header">
        <span className="timing-title">TIMING DIAGRAM</span>
        <button className="utilities-button" onClick={onClose}>CLOSE</button>
      </div>

      <div className="timing-controls">
        <button className="utilities-button" onClick={onStart} disabled={isCapturing}>
          START
        </button>
        <button className="utilities-button" onClick={onPause} disabled={!isCapturing}>
          PAUSE
        </button>
        <button className="utilities-button" onClick={onClear}>
          CLEAR
        </button>
        <span className="timing-controls-divider" />
        <button className="utilities-button" onClick={onAddSelectedSignal}>
          + ADD SIGNAL
        </button>
        <button className="utilities-button" onClick={onClearSignals}>
          CLEAR SIGNALS
        </button>
        {isCapturing && <span className="timing-recording-dot" title="Capturing" />}
      </div>

      {signals.length === 0 ? (
        <div className="timing-empty">
          Select a gate, wire, input, or clock on the canvas, then click + ADD SIGNAL.
        </div>
      ) : (
        <div className="timing-body">
          <div className="timing-labels-col">
            {signals.map(sig => (
              <div
                className={
                  "timing-label-row" + (sig.disconnected ? " timing-label-disconnected" : "")
                }
                key={sig.id}
                style={{ height: rowHeight }}
              >
                <input
                  className="timing-label-input"
                  value={sig.label}
                  onChange={e => onRenameSignal(sig.id, e.target.value)}
                  title={sig.disconnected ? "Signal's source was deleted" : undefined}
                />
                <button
                  className="timing-remove-btn"
                  onClick={() => onRemoveSignal(sig.id)}
                  title="Remove signal"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="timing-label-row timing-axis-spacer" style={{ height: axisHeight }} />
          </div>

          {/* 3. Attach the ref to the scroll area */}
          <div className="timing-scroll-area" ref={scrollRef}>
            <svg width={svgWidth} height={svgHeight}>
              {/* row separators */}
              {signals.map((sig, i) => (
                <line
                  key={`sep-${sig.id}`}
                  x1={0}
                  x2={svgWidth}
                  y1={i * rowHeight}
                  y2={i * rowHeight}
                  stroke={CONSTANTS.TIMING_GRID_COLOR}
                  strokeWidth={1}
                />
              ))}

              {/* vertical gridlines + axis ticks */}
              {ticks.map(t => (
                <g key={`tick-${t}`}>
                  <line
                    x1={t * pxPerMs}
                    x2={t * pxPerMs}
                    y1={0}
                    y2={signals.length * rowHeight}
                    stroke={CONSTANTS.TIMING_GRID_COLOR}
                    strokeWidth={1}
                  />
                  <text
                    x={t * pxPerMs}
                    y={signals.length * rowHeight + axisHeight * 0.7}
                    fontSize={11}
                    fill={CONSTANTS.TIMING_LOW_COLOR}
                    textAnchor="middle"
                  >
                    {t} ms
                  </text>
                </g>
              ))}

              {/* waveforms */}
              {signalPaths.map(({ sig, paths }) =>
                paths.map((d, i) => (
                  <path
                    key={`${sig.id}-${i}`}
                    d={d}
                    fill="none"
                    stroke={CONSTANTS.BULB_ON_COLOR}
                    strokeWidth={2}
                  />
                ))
              )}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}