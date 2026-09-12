export default {
  id: "basic-gates",
  title: "Logic gates",
  sections: [
    {
      heading: "Introduction",
      body: String.raw`
Logic Gates are devices which perform logical operations on one or more inputs and produces a single output[cite: 1].

Logic gates can be categorized into 3 groups[cite: 1]:
1. Basic Gates: NOT, AND, OR[cite: 1]
2. Universal Gates: NAND, NOR[cite: 1]
3. Arithmetic Gates: X-OR, X-NOR[cite: 1]
      `,
    },
    {
      heading: "Truth Table",
      body: String.raw`
The Table which contains all logical possibilities is known as truth table[cite: 1].
      `,
    },
    {
      heading: "NOT gate",
      body: String.raw`
The NOT gate is also known as an inverter because it produces the exact opposite of the input as output[cite: 1]. It has one input and one output[cite: 1]. The Truth table for NOT gate is given below[cite: 1]:

| Input | Output |
|:---:|:---:|
| 0 | 1 | 
| 1 | 0 | 
      `,
    },
    {
      heading: "AND gate",
      body: String.raw`
The AND gate's operation is similar to that of multiplication[cite: 1]. It has two inputs and one output[cite: 1]. The output is high (1) if both inputs are 1, and for all other cases, the output is low (0)[cite: 1].

The Truth table for AND gate which consists of two inputs is given below[cite: 1]:

| Input 1 | Input 2 | Output |
|:---:|:---:|:---:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |
      `,
    },
    {
      heading: "OR gate",
      body: String.raw`
The OR gate has two inputs and one output[cite: 1]. If at least one of the inputs is 1, then the output will be high (1)[cite: 1]. If neither of the inputs is 1, then the output will be low (0)[cite: 1].

The Truth table of OR gate which consists of two inputs is given below[cite: 1]:

| Input 1 | Input 2 | Output |
|:---:|:---:|:---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |
      `,
    },
    {
      heading: "NAND gate",
      body: String.raw`
The NAND gate is the complement of the AND gate[cite: 1]. You can think of it as an AND gate followed immediately by a NOT gate[cite: 1]. Its output is low (0) when both the inputs are 1, and for all other cases, its output is high (1)[cite: 1]. The symbol of NAND gate consists of AND gate followed by a small circle[cite: 1].

The Truth table of NAND gate which consists of two inputs is given below[cite: 1]:

| Input 1 | Input 2 | Output |
|:---:|:---:|:---:|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |
      `,
    },
    {
      heading: "NOR gate",
      body: String.raw`
The NOR gate is the complement of the OR gate[cite: 1]. You can think of it as an OR gate followed immediately by a NOT gate[cite: 1]. Its output is low (0) when one or both of the inputs are 1, and for all other cases, its output is high (1)[cite: 1]. The symbol of NOR gate consists of OR gate followed by a small circle[cite: 1].

The Truth table of NOR gate which consists of two inputs is given below[cite: 1]:

| Input 1 | Input 2 | Output |
|:---:|:---:|:---:|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |
      `,
    },
    {
      heading: "XOR gate",
      body: String.raw`
The XOR (or) Exclusive-OR is a digital Logic gate that gives the output as high (1) if and only if one of the input is 1[cite: 1].

The Truth table of XOR gate which consists of two inputs is given below[cite: 1]:

| Input 1 | Input 2 | Output |
|:---:|:---:|:---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |
      `,
    },
    {
      heading: "XNOR gate",
      body: String.raw`
The XNOR (or) Exclusive-NOR is a digital Logic gate that gives the output as high (1) when both the inputs are same[cite: 1].

The Truth table of XNOR gate which consists of two inputs is given below[cite: 1]:

| Input 1 | Input 2 | Output |
|:---:|:---:|:---:|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |
      `,
    }
  ],
};