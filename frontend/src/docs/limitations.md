# Limitations

GateSim is primarily designed as an educational digital logic simulator. The following limitations apply to the current implementation.

## 1. No Physical Propagation Delays

GateSim currently models logical propagation through the circuit graph but does not model physical propagation delays of individual gates or wires.

The reported propagation steps therefore represent computational simulation steps, not physical time delays in a hardware circuit. The measured execution time represents the time taken by the simulator to perform the corresponding computation.

Clock delays are supported for generating clock signals, but these should not be interpreted as per-gate propagation delays.

## 2. Sequential Circuit Timing

For level-triggered sequential circuits, race-around behavior may occur depending on the circuit structure. Master-slave configurations are therefore recommended for circuits such as JK flip-flops when avoiding race-around conditions.

## 3. Feedback and Oscillating Circuits

Circuits containing unrestricted combinational feedback, such as ring oscillators, are not currently supported as physical oscillators.

The simulator propagates logical state changes through the affected region. Circuits that continuously change state without reaching a stable logical state require a timing model that is beyond the current simulator architecture.


## 4. GPU Prototype

The GPU implementation is currently a prototype intended to investigate the potential for parallel execution of frontier-based simulation.

It is not yet integrated into the main GateSim application and does not provide feature parity with the browser-based simulator. The reported GPU results should therefore be interpreted as a proof-of-concept evaluation rather than as the performance of the deployed GateSim application.


## 5. Educational Rather Than Hardware-Accurate Simulation

GateSim is intended to help students understand digital logic, circuit construction, propagation, and hierarchical components. It is not intended to replace hardware description languages, FPGA simulators, SPICE-based tools, or cycle-accurate hardware simulation environments.

Its abstractions intentionally prioritize interactive circuit construction and understandable logical behavior over detailed physical modeling.