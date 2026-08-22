function evaluate(graph) {
  for (const node of graph) {

    if (node.type === "INPUT") {
      continue;
    }
    console.log(`inputs = ${node.inputs}`)

    const values = node.inputs.map(inputId => {
      if (inputId === -1) return false;
      return graph[inputId].value;
    });

    let a = values[0]
    let b = values[1]

    if (values[0] === undefined) a = false
    if (values[1] === undefined) b = false


    

    switch (node.type) {
      case "AND":
        node.value =
          a &&
          b;
        break;

      case "OR":
        node.value = 
          (a || b);
        break;

      case "NOT":
        node.value =         
          !a;
        break;

      case "XOR":
        node.value =
          a !== b;
        break;

      case "NAND":
        node.value =    
          !(a && b);
        break;

      case "NOR":
        node.value =  
          !(a || b);
        break;

      case "XNOR":
        node.value =
          a === b;
        break;

      case "BULB":
        node.value =
            a    
        break;
    }
    console.log(`at ${node.id}, val = ${node.value}, val_length = ${values.length}`)
    console.log("----------------")
  }
}

export default evaluate;