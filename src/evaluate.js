function evaluate(id, graph) {

  let node = graph[id]

  if (node.type === "INPUT") {
    return node.value
  }

  let values = node.inputs.map((id) => {
    return evaluate(id, graph)
  })

  switch (node.type) {
    case "AND":
      return values[0] && values[1];

    case "OR":
      return values[0] || values[1];

    case "NOT":
      return !values[0];

    case "XOR":
      return values[0] !== values[1]

    case "NAND":
      return !(values[0] && values[1]);

    case "NOR":
      return !(values[0] || values[1]);

    case "XNOR":
      return values[0] === values[1];

    case "BULB":
      return values[0]

    default:
      throw new Error(`Unknown gate: ${node.type}`);
  }

}

export default evaluate;