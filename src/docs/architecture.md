# Architecture

## Circuit Representation 
Every component inside the canvas is a object, called `node` with the following properties:


| Property | Type | Description |
| :--- | :--- | :--- |
| `type` | String | The type of component (e.g.,INPUT, AND4) |
| `id` | Integer | Unique identifier for the component |
| `value` | Bool Array | The current state(s) of the node |
| `outputs` | Integer Array | List of connected node IDs |
| `inputs` | Object Array | List of {id:, index:}. id is id of node to from which index<sup>th</sup> output pin it recieves signal, initialised to null(s)|
| `x` | Number | X coordinate in canvas coordinate system|
| `y` | Number | Y coordinate in canvas coordinate system|
| `Z` | Number | Z index|
| `rotation` | Number | Angle of orientation |

Other types of node such as `CLOCK` have additional properties, like `delay`. Will be discussed later.

## Evaluation

When user toggles a `INPUT` node, `toggle` function (inside [src/hooks/useCircuit.js](../hooks/useCircuit.js)) is called. The state of node is flipped. This mutates the graph directly. Other click handlers attached to the toggle SVG fire re-renders, so we can avoid creating a shallow copy for flipping the state.

The signal is then propagated throughout the relevant circuit through `propagate` function. Graph and id of the toggle is passed to this function.

### Propagate

| Input Parameters | Use |
| :--- | :--- |
| `graph` | To access inputs and outputs of node for evaluation |
| `id` | Id of the node, to fetch outputs |

We maintain two arrays `cur` and `nxt`. `cur` is called "Frontier" $F_i$ which <b>stores the ids of nodes</b> to be evaluated at step $i$. 

#### Phase 1 : Evaluate
At step 0, `cur` is filled with the ids of outputs (present in node.outputs) of toggle (or source node $s$). So the $0^{th}$ frontier can be written as 

$$F_0 = Out(s)$$

For each id in `cur`, we compute the state of node having that id. If the newly computed state is not the same as current state, we add the reference to node in `resNodes`, and corresponding state in `resVals`. If same, we skip it. Mathematically, `resNodes` is
$$C_i = \{ v \in F_i \mid f_v \neq s_v \}$$
where $f_v$ is the newly computed state and $s_v$ is current state

#### Phase 2 : Commit
We empty `nxt` and for each node in `resNodes`, we mutate its value with the newly computed value (which is stored in `resVals`). We now add the ids of outputs of this node in `nxt`. Then we swap `cur` and `nxt`. (Swapping is needed, as mere `cur` = `nxt` will empty `cur` as well in phase 2 beginning).

This phase 1 and phase 2 is ran until `cur` is empty or a max limit of iterations is reached. If the control exits loop with non empty `cur`, a unstable loop is deduced, and logged in console.

Now consider a circuit as shown below

![Alt Text for the Image](fig1.png)
Suppose source signal changes and hence all A, B, C, D change their state. 

At step 0, $F_0 = \{A,B,C,D\}$ and to find $C_0$, we loop through $F_0$ and see all elements have changed their value, so output of all nodes must be added in $F_1$, which leads to $F_1 = \{E,E,E,E\}$. Incase E is a huge network, computing such $F_1$ in step 1 isn't optimal. 

Once E is added, we can prevent adding it further, so only one reference of E exists in $F_1$. In general, $F_i$ must contain unique references only. Thats the point of having `visited` set.

## Custom Components

To do.