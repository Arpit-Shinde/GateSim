export default {
  id: "combinational",
  title: "Combinational Circuits",
  sections: [
    {
      heading: "Half Adder",
      body: String.raw`
A **half adder** is a basic combinational circuit that adds two single-bit binary inputs, **A** and **B**.

It produces two outputs:

- **SUM:** $A \oplus B$
- **CARRY:** $A \cdot B$

A half adder does not have a carry-in input, so it can only add two bits directly. It is therefore mainly used as the first stage of larger binary addition circuits.

### Truth Table

| A | B | SUM | CARRY |
|---|---|-----|-------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

### Logic

The **SUM** output is produced using an XOR gate:

$$
SUM = A \oplus B
$$

The **CARRY** output is produced using an AND gate:

$$
CARRY = A \cdot B
$$

Together, an XOR gate and an AND gate form the complete half-adder circuit.

### Advantages

- **Simple design:** Uses only two logic gates, XOR and AND.
- **Fast operation:** The small number of gates results in low propagation delay.
- **Low hardware requirement:** Requires few components and has low circuit complexity.

### Limitations

- **No carry input:** It cannot accept a carry from a previous stage.
- **Limited functionality:** It can only add two single-bit values.
- **Not sufficient for multi-bit addition:** Larger binary adders require full adders to handle carry propagation.
      `,
      diagram: (
        <img
          src={`${process.env.PUBLIC_URL}/diagrams/half_adder.png`}
          alt="Half adder circuit"
          className="learn-diagram-image"
        />
      ),
    },
    {
      heading: "Full Adder",
      body: String.raw`
A **full adder** is a combinational circuit that adds three inputs and produces two outputs. The first two inputs are **A** and **B** and the third input is an input carry as **C-IN**. The output carry is designated as **C-OUT** and the normal output is designated as **S** which is **SUM**.

The **C-OUT** is also known as the majority 1's detector, whose output goes high when more than one input is high. A full adder logic is designed in such a manner that can take eight inputs together to create a byte-wide adder and cascade the carry bit from one adder to another. We use a full adder because when a carry-in bit is available, another 1-bit adder must be used since a 1-bit half-adder does not take a carry-in bit. A 1-bit full adder adds three operands and generates 2-bit results.

### Truth Table

| A | B | C-IN | Sum | C-OUT |
|---|---|------|-----|-------|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

### Logical Expressions for SUM

From the truth table, the logical expression for the sum ($S$) in a full adder is:

$$
S = \bar{A}\bar{B}C_{IN} + \bar{A}B\bar{C}_{IN} + A\bar{B}\bar{C}_{IN} + ABC_{IN}
$$

Since $\bar{A}B + A\bar{B} = A \oplus B$, this simplifies to:

$$
S = C_{IN}(A \oplus B)' + \bar{C}_{IN}(A \oplus B)
$$

The final simplified expression is:

$$
S = A \oplus B \oplus C_{IN}
$$

Thus, the sum output is the XOR of A, B, and C-IN.

### Logical Expression for C-OUT

From the truth table, the logical expression for C-OUT (carry-out) in a full adder is:

$$
C_{OUT} = \bar{A}BC_{IN} + A\bar{B}C_{IN} + AB\bar{C}_{IN} + ABC_{IN}
$$

This simplifies to:

$$
C_{OUT} = AB(\bar{C}_{IN} + C_{IN}) + C_{IN}(\bar{A}B + A\bar{B})
$$

Since $\bar{C}_{IN} + C_{IN} = 1$ and $\bar{A}B + A\bar{B} = A \oplus B$, the final simplified expression is:

$$
C_{OUT} = AB + C_{IN}(A \oplus B)
$$

### Logic Circuit of Full Adder

To implement a Full Adder using basic logic gates:
- **Sum ($S$)** is implemented using two XOR gates: First XOR gate calculates $A \oplus B$, and the second XOR gate calculates $(A \oplus B) \oplus C_{IN}$ to get the final sum $S$.
- **Carry ($C_{OUT}$)** is implemented using XOR, AND, and OR gates:
  - First AND gate calculates $A \text{ AND } B$.
  - Second AND gate calculates $C_{IN} \text{ AND } (A \oplus B)$.
  - The two outputs from the AND gates are combined using an OR gate to generate the final $C_{OUT}$ output.
      `,
      diagram: (
        <img
          src={`${process.env.PUBLIC_URL}/diagrams/full_adder.png`}
          alt="Full adder circuit"
          className="learn-diagram-image"
        />
      ),
    },
    {
      heading: "Full Adder using Half Adders",
      body: String.raw`
Two Half Adders and an OR gate are required to implement a Full Adder.

With this logic circuit, two bits can be added together, taking a carry from the next lower order of magnitude, and sending a carry to the next higher order of magnitude.
      `,
      diagram: (
        <img
          src={`${process.env.PUBLIC_URL}/diagrams/fa_from_ha.png`}
          alt="Full adder using half adders"
          className="learn-diagram-image"
        />
      ),
    },
//     {
//       heading: "Half Subtractor",
//       body: String.raw`
// It is a combinational logic circuit designed to perform the subtraction of two single bits.

// It contains two inputs (A and B) and produces two outputs (Difference and Borrow-output).

// ### Truth Table of Half Subtractor

// | A | B | D | Bout |
// |---|---|-----|------|
// | 0 | 0 | 0 | 0 |
// | 0 | 1 | 1 | 1 |
// | 1 | 0 | 1 | 0 |
// | 1 | 1 | 0 | 0 |

// ### Equation for Difference

// The equation obtained is,

// $$
// D = \bar{A}B + A\bar{B}
// $$

// which can be logically written as,

// $$
// D = A \oplus B
// $$

// ### Equation for Bout

// The equation obtained is,

// $$
// B_{out} = \bar{A}B
// $$
//       `,
//       diagram: (
//         <img
//           src={`${process.env.PUBLIC_URL}/diagrams/half_subtractor.png`}
//           alt="Half subtractor circuit"
//           className="learn-diagram-image"
//         />
//       ),
//     },
//     {
//       heading: "Full Subtractor",
//       body: String.raw`
// It is a Combinational logic circuit designed to perform subtraction of three single bits.

// It contains three inputs ($A$, $B$, $B_{in}$) and produces two outputs ($D$, $B_{out}$).

// Where, $A$ and $B$ are called Minuend and Subtrahend bits.

// And, $B_{in}$ -> Borrow-In and $B_{out}$ -> Borrow-Out.

// ### Truth Table of Full Subtractor

// | A | B | Bin | D | Bout |
// |---|---|-----|---|------|
// | 0 | 0 | 0 | 0 | 0 |
// | 0 | 0 | 1 | 1 | 1 |
// | 0 | 1 | 0 | 1 | 1 |
// | 0 | 1 | 1 | 0 | 1 |
// | 1 | 0 | 0 | 1 | 0 |
// | 1 | 0 | 1 | 0 | 0 |
// | 1 | 1 | 0 | 0 | 0 |
// | 1 | 1 | 1 | 1 | 1 |

// ### Equation for D

// The equation obtained is,

// $$
// D = \bar{A}\bar{B}B_{in} + A\bar{B}\bar{B}_{in} + ABB_{in} + \bar{A}B\bar{B}_{in}
// $$

// which can be simplified as,

// $$
// D = \bar{B}(\bar{A}B_{in} + A\bar{B}_{in}) + B(AB_{in} + \bar{A}\bar{B}_{in})
// $$

// $$
// D = A \oplus B \oplus B_{in}
// $$

// ### Equation for Bout

// The equation obtained is,

// $$
// B_{out} = BB_{in} + \bar{A}B + \bar{A}B_{in}
// $$
//       `,
//       diagram: (
//         <img
//           src={`${process.env.PUBLIC_URL}/diagrams/full_subtractor.png`}
//           alt="Full subtractor circuit"
//           className="learn-diagram-image"
//         />
//       ),
//     },
  ],
};