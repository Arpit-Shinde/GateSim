import * as CONSTANTS from "../constants/constants";

export function GateCard({ renderFxn, gateType }) {
  const RenderFn = renderFxn;
  return (
    <div className="gate-card">
      <div className="gate-preview">
        <svg width="110" height="60" viewBox="0 0 110 60">
          <rect width="110" height="60" fill={CONSTANTS.GATE_CARD_BACKGROUND} rx="8" />
          <g transform="translate(15, 10)">
            <RenderFn />
          </g>
        </svg>
      </div>
      <span className="gate-label">{gateType}</span>
    </div>
  );
}