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
      if (values.length!==2) return false
      return values[0] && values[1];

    case "OR":
      if (values.length!==2) return false
      return values[0] || values[1];

    case "NOT":
      if (values.length!==1) return false
      return !values[0];

    case "XOR":
      if (values.length!==2) return false
      return values[0] !== values[1]

    case "NAND":
      if (values.length!==2) return false
      return !(values[0] && values[1]);

    case "NOR":
      if (values.length!==2) return false
      return !(values[0] || values[1]);

    case "XNOR":
      if (values.length!==2) return false
      return values[0] === values[1];

    case "BULB":
      if (values.length!==1) return false
      return values[0]

    default:
      throw new Error(`Unknown gate: ${node.type}`);
  }

}

export default evaluate;