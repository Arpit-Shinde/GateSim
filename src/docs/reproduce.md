# Reproducing Experiments

The following experiments were benchmarked.

Click on the links next to the experiments, which launches GateSim with the circuit loaded. Open the console in Developer Tools and flip the switches to run the corresponding experiment and view the logged results.

## Experiment 1: Unaffected-region scaling

### 1A

A 64-NOT-gate linear chain is driven by one toggle, while an independent 512-NOT-gate chain is driven by a second toggle. Only the toggle driving the 64-gate chain is changed during the benchmark.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=1a)

### 1B

1A was extended by an additional independent network of 512 NOT gates.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=1b)

These experiments test whether increasing the size of the unaffected portion of the circuit increases propagation work.

## Experiment 2: Affected-region scaling

### 2A

A 128-NOT-gate linear chain is driven by a toggle, while an independent 960-NOT-gate chain is driven by a second toggle. Only the toggle driving the 128-gate chain is changed.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=2a)

### 2B

A 256-NOT-gate linear chain is driven by a toggle, while an independent 832-NOT-gate chain is driven by a second toggle. Only the toggle driving the 256-gate chain is changed.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=2b)

### 2C

A 1024-NOT-gate linear chain is driven by a single toggle. The toggle is changed during the benchmark.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=2c)

These experiments keep the total number of gates approximately constant while increasing the size of the region affected by the input change. They therefore measure how propagation cost scales with the affected region.

## Experiment 3: Reconvergent propagation

### 3A

A chain of 5 XOR gates is constructed such that a single toggle drives the first input of every XOR gate. The second input of the first XOR gate is driven by another toggle, while the second input of each subsequent XOR gate is driven by the output of the previous XOR gate. This creates multiple propagation paths from the first toggle to downstream XOR gates.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=3a)

### 3B

A chain of 7 XOR gates is constructed using the same reconvergent structure as Experiment 3A.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=3b)

### 3C

A chain of 9 XOR gates is constructed using the same reconvergent structure as Experiment 3A.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=3c)

### 3D

A chain of 11 XOR gates is constructed using the same reconvergent structure as Experiment 3A.

Circuit: [Click Here](https://arpit-shinde.github.io/GateSim/?circuit=3d)

These experiments evaluate propagation behavior when a node can be reached through multiple paths. In particular, they demonstrate how the level-synchronous frontier causes downstream nodes to be evaluated multiple times when their inputs become available at different propagation steps.

## Expected Results

The following results are expected when the experiments are run.

| Experiment | Affected Gates | Total Gates | Propagation Steps | Number of Evaluations | Avg. Time ($\mu$ s) |
|------------|---------------:|------------:|------------------:|----------------------:|-------------------:|
| **1A** | 64 | 576 | 65 | 65 | 300.00 |
| **1B** | 64 | 1088 | 65 | 65 | 300.00 |
| **2A** | 128 | 1088 | 129 | 129 | 345.00 |
| **2B** | 256 | 1088 | 257 | 257 | 500.00 |
| **2C** | 1024 | 1088 | 1025 | 1025 | 1055.00 |
| **3A** | 5 | -- | 5 | 15 | -- |
| **3B** | 7 | -- | 7 | 28 | -- |
| **3C** | 9 | -- | 9 | 45 | -- |
| **3D** | 11 | -- | 11 | 66 | -- |

For Experiments 1A--2C, the reported average time is the average propagation time over the benchmark runs.

For Experiments 3A--3D, the focus is on the number of propagation steps and node evaluations rather than propagation time.

### Interpretation

Experiments 1A and 1B have the same affected region but different total circuit sizes. The number of propagation steps and evaluations remains unchanged, demonstrating that the unaffected portion of the circuit does not contribute to propagation work.

Experiments 2A--2C keep the total circuit size approximately constant while increasing the affected region. The number of propagation steps and evaluations increases approximately linearly with the affected region.

Experiments 3A--3D use reconvergent structures. With $n$ XOR gates, the expected number of evaluations is:

$$
n + (n-1) + (n-2) + \cdots 1 = \frac{n(n+1)}{2}
$$

Thus, the expected evaluation counts are 15, 28, 45, and 66 for 5, 7, 9, and 11 XOR gates, respectively.

## OpenGL Demo

The GPU prototype used for the large-scale simulation experiment is available at:

[GateSim OpenGL](https://github.com/Arpit-Shinde/GateSim-Opengl)