import * as RENDER_GATES from "../svg/gates_svg";

export const inputGateRenderList = [
  { type: 'INPUT', render: RENDER_GATES.RenderINPUT },
  { type: 'CLOCK', render: RENDER_GATES.RenderCLOCK }
];

export const logicGateRenderList = [
  { type: 'AND', render: RENDER_GATES.RenderAND },
  { type: 'OR', render: RENDER_GATES.RenderOR },
  { type: 'NOT', render: RENDER_GATES.RenderNOT },
  { type: 'NAND', render: RENDER_GATES.RenderNAND },
  { type: 'NOR', render: RENDER_GATES.RenderNOR },
  { type: 'XOR', render: RENDER_GATES.RenderXOR },
  { type: 'XNOR', render: RENDER_GATES.RenderXNOR },
  { type: 'AND3', render: RENDER_GATES.RenderAND3 },
  { type: 'OR3', render: RENDER_GATES.RenderOR3 },
  { type: 'NOR3', render: RENDER_GATES.RenderNOR3 },
  { type: 'XOR3', render: RENDER_GATES.RenderXOR3 },
  { type: 'XNOR3', render: RENDER_GATES.RenderXNOR3 },
  { type: 'NAND3', render: RENDER_GATES.RenderNAND3 }

];

export const outputGateRenderList = [
  { type: 'BULB', render: RENDER_GATES.RenderBULB }
];
