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


[**Click here**](https://arpit-shinde.github.io/GateSim/) to try out GateSim Online

[**Click here**](https://github.com/Arpit-Shinde/GateSim/releases/download/v1.0.0/GateSim.Setup.0.1.0.exe)  to download GateSim locally

## Features

- Better SVG for gates
- Simple UI
- Dynamic gate creation
- Dynamic gate connections
- Dynamic wiring 
- Wire & Gate deletion
- Basic Gates (2,3,4 inputs)
- Clocks
- Sequential : JK Flip-Flop
- Combinational : Mux, Adders
- Infinite canvas with pan and zoom
- Save/Load circuits
- Mini utilites like reset view, clear circuit, undo,redo,rotate gates

## Planned to do

- Add all kinds of Flip-Flops, Registers, Mux,etc
- User defined component creation
- A architecture explaination

## Limitations

- Not based on propogation delay. So circuits like ring oscillator won't work
- Doesn't handle race condition in level triggered flip flops. Instead use master slave flip flops
- Currently unoptimised. May lag considerably for large amount of components in the scene

If you find this project useful, please consider giving it a ⭐!