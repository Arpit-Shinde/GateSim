# GateSim

A logic gate simulator built with React.

Link to deployed website : https://arpit-shinde.github.io/GateSim/

## Features

- Dynamic gate creation
- Dynamic gate connections
- Click to Connect 
- Drag-and-drop gate placement
- wire deletion
- gate deletion
- Better SVG for gates
- Simple UI
- Sequential Circuits
- Clocks
- Flip-flops
- Infinite canvas with pan and zoom
- Supports:
  - AND
  - OR
  - NOT
  - XOR
  - NAND
  - NOR
  - XNOR
  (upto three inputs)

## Planned to do
- Save/Load circuits
- Component Creation

## Limitations
- Not based on propogation delay. So circuits like ring oscillator won't work
- Doesn't handle race condition in level triggered flip flops. Instead use master slave flip flops