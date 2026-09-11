import * as RENDER_GATES from "../svg/gates_svg";

export const inputGateRenderList = [
  { type: 'INPUT', render: RENDER_GATES.RenderINPUT },
  { type: 'CLOCK', render: RENDER_GATES.RenderCLOCK }
];

export const twoInputGateRenderList = [
  { type: 'AND', render: RENDER_GATES.RenderAND },
  { type: 'OR', render: RENDER_GATES.RenderOR },
  { type: 'NAND', render: RENDER_GATES.RenderNAND },
  { type: 'NOR', render: RENDER_GATES.RenderNOR },
  { type: 'XOR', render: RENDER_GATES.RenderXOR },
  { type: 'XNOR', render: RENDER_GATES.RenderXNOR },
  { type: 'NOT', render: RENDER_GATES.RenderNOT}
];

export const threeInputGateRenderList = [
  { type: 'AND3', render: RENDER_GATES.RenderAND3 },
  { type: 'OR3', render: RENDER_GATES.RenderOR3 },
  { type: 'NAND3', render: RENDER_GATES.RenderNAND3 },
  { type: 'NOR3', render: RENDER_GATES.RenderNOR3 },
  { type: 'XOR3', render: RENDER_GATES.RenderXOR3 },
  { type: 'XNOR3', render: RENDER_GATES.RenderXNOR3 },
];

export const fourInputGateRenderList = [
  { type: 'AND4', render: RENDER_GATES.RenderAND4 },
  { type: 'OR4', render: RENDER_GATES.RenderOR4 },
  { type: 'NAND4', render: RENDER_GATES.RenderNAND4 },
  { type: 'NOR4', render: RENDER_GATES.RenderNOR4 },
  { type: 'XOR4', render: RENDER_GATES.RenderXOR4 },
  { type: 'XNOR4', render: RENDER_GATES.RenderXNOR4 },
];

export const sequentialGateRenderList = [
  { type: 'JK', render: RENDER_GATES.RenderJK }
];

export const MuxGateRenderList = [
  { type: 'MUX2', render: RENDER_GATES.RenderMUX2 },
  { type: 'MUX4', render: RENDER_GATES.RenderMUX4 },
];

export const AdderGateRenderList = [
  { type: 'HALF_ADDER', render: RENDER_GATES.RenderHALF_ADDER },
  { type: 'FULL_ADDER', render: RENDER_GATES.RenderFULL_ADDER },
];

export const outputGateRenderList = [
  { type: 'BULB', render: RENDER_GATES.RenderBULB }
];
