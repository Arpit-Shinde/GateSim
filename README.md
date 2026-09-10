<table>
<tr>
<td>
  <img src="public/gatesim-logo2.svg" width="120">
</td>
<td>
  <h1 style="font-size: 48px; margin: 0; ">GateSim</h1>
</td>
</tr>
</table>

A logic gate simulator built with React.

Link to deployed website : [https://arpit-shinde.github.io/GateSim/](https://arpit-shinde.github.io/GateSim/)

## Features

- Dynamic gate creation
- Dynamic gate connections
- Dynamic wiring 
- Wire deletion
- Gate deletion
- Better SVG for gates
- Simple UI
- Clocks
- Flip-flops
- Infinite canvas with pan and zoom
- Save/Load circuits
- Mini utilites like reset view, clear circuit, undo,redo,etc
- Supports:
  - AND
  - OR
  - NOT
  - XOR
  - NAND
  - NOR
  - XNOR
  (upto three inputs)
  - Master Slave JK Flip-flop

## Planned to do

- Add all kinds of Flip-Flops, Registers, Mux,etc
- User defined component creation
- A architecture explaination

## Limitations

- Not based on propogation delay. So circuits like ring oscillator won't work
- Doesn't handle race condition in level triggered flip flops. Instead use master slave flip flops
- Currently unoptimised. May lag considerably for large amount of components in the scene

If you find this project useful, please consider giving it a ⭐!