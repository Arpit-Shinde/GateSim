import evaluate from "./evaluate"
import { GATE_WIDTH, GATE_HEIGHT } from "./constants";

function Gate({ node, toggle, graph, didDrag, startDrag, setoutputpin, setinputpin,setSelectedGate }) {

  if (node.type === "INPUT") {
    return (
      <g
        transform={`translate(${node.x}, ${node.y})`}
        style={{ cursor: "pointer" }}
      >
        <rect onMouseUp={() => {
          if (!didDrag) toggle(node.id);
        }}
          width="70"
          height="40"
          rx="5"
          fill={node.value ? "limegreen" : "gray"}
          stroke="black"
          strokeWidth="2"
          onMouseDown={(e) => startDrag(e, node.id)}
        />

        <text
          x="35"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          pointerEvents="none"
        >
          INPUT
        </text>

        <circle onClick={() => { setoutputpin(node.id) }} cx={GATE_WIDTH} cy={GATE_HEIGHT / 2} r="4" />
      </g>
    );
  }

  else if (node.type === "NOT") {
    return (<g transform={`translate(${node.x}, ${node.y})`}>
      <rect 
      width="70" 
      height="40" 
      rx="5" 
      fill={evaluate(node.id, graph) ? "limegreen" : "gray"} 
      onMouseDown={(e) => startDrag(e, node.id)} 
      onClick={()=>{return setSelectedGate({id:node.id})}} 
      />
      <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
      <circle onClick={() => { setinputpin(node.id, 0) }} cx={0} cy={GATE_HEIGHT / 2} r="4" />

      <circle onClick={() => { setoutputpin(node.id) }} cx={GATE_WIDTH} cy={GATE_HEIGHT / 2} r="4" />
    </g>
    )
  }

  else if (node.type === "BULB") {
    return (<g transform={`translate(${node.x}, ${node.y})`}>
      <rect 
      width="70" 
      height="40" 
      rx="5" 
      fill={evaluate(node.id, graph) ? "limegreen" : "gray"} 
      onMouseDown={(e) => startDrag(e, node.id)} 
      onClick={()=>{return setSelectedGate({id:node.id})}} 
      />
      <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
      <circle onClick={() => { setinputpin(node.id, 0) }} cx={0} cy={GATE_HEIGHT / 2} r="4" />


    </g>
    )
  }

  else {

    return (
      <g transform={`translate(${node.x}, ${node.y})`}>
        <rect 
        width="70" 
        height="40" 
        rx="5" 
        fill={evaluate(node.id, graph) ? "limegreen" : "gray"} 
        onMouseDown={(e) => startDrag(e, node.id)} 
        onClick={()=>{return setSelectedGate({id:node.id})}} 
        />
        <text x="35" y="25" textAnchor="middle" fill="black"> {node.type} </text>
        <circle onClick={() => { setinputpin(node.id, 0) }} cx={0} cy={GATE_HEIGHT / 4} r="4" />
        <circle onClick={() => { setinputpin(node.id, 1) }} cx={0} cy={3 * GATE_HEIGHT / 4} r="4" />
        <circle onClick={() => { setoutputpin(node.id) }} cx={GATE_WIDTH} cy={GATE_HEIGHT / 2} r="4" />
      </g>
    )


  }
}

export default Gate