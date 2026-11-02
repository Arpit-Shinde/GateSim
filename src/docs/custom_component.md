# Custom Components

## Creation

Custom Component creation begins when user clicks on "Create Component" from the top bar, which calls `beginCreateComponent`, initialising few useStates used ahead, and then setting `creatingComponent` to true, which lets user choose select mode or manual add mode. Upon selecting the area, when pressed done, `tempGraph` is set having all the nodes lying in that selected area (wires filtered out) and `FinaliseComponentCreation` is called.

### FinaliseComponentCreation

First `tempGraph` is validated using `validateNoDanglingInputs`, then abstracted into `abstractedGraph` in which inputs of logic nodes are directly connected to its parent instead of wire which connects both, then re-indexed.
`tempGraph` is now re-indexed with all nodes except wires have input directly to their parent. A map of old_id->new_id of tempGraph is set into `componentIdMapRef`. `componentInputs` and `componentOutputs` are set. Then `abstractedGraph` is set into `componentGraph` with inputs and bulbs filtered out.

#### componentInputs
An array which consist of objects having properties : 

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | ID of node which recieves signal from a toggle in abstractedGraph |
|`index`| Integer|Which input pin of such node|
|`sourceId`|Integer|ID of the toggle which feeds this node|
|`name`|String|Name for such pin|

#### componentOutputs
An array which consist of objects having properties : 

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | ID of node which will give final output in abstractedGraph |
|`index`| Integer|Which output pin of such node|
|`bulbId`|Integer|ID of the bulb which was connected to this node|
|`name`|String|Name for such pin|

Finally, `specifyingInputs` is set to true, which enables right sidebar for user to order and name the input and outputs of component. `FinaliseComponentCreation` exits here
Elements of `componentInputs` and `componentOutputs` are shuffled to be in the order in which user specified inputs and outputs. 

An object `customComponent` is created with the following properties : 

| Property | Type | Description |
| :--- | :--- | :--- |
| `type` | String | set to "CUSTOM" |
|`name`| String|Name entered by user |
|`inputs`|Array |shuffled componentInputs|
|`outputs`|Array|shuffled componentOutputs|
|`ref_graph`|Array|componentGraph|

and added into a list `customComponents` of custom components.

## Adding to the canvas

As usual, `Add` function is called which inserts object into graph, having properties: 

| Property | Type | Description |
| :--- | :--- | :--- |
| `type` | String | set to "CUSTOM" |
| `id` | Number | ID of the node |
| `outputs` | Array | initialized as an empty array |
| `name` | String | copied from `customComponent.name` |
| `inputs` | Array | initialized with `null` values, length matches the number of unique `sourceId`s |
| `ext_inputs` | Array | deep copy of `customComponent.inputs` |
| `value` | Array | array of `false` booleans matching the length of `customComponent.outputs` |
| `ext_outputs` | Array | deep copy of `customComponent.outputs` |
| `ref_graph` | Array | deep copy of `customComponent.ref_graph` |
| `x`, `y`, `z`, `rotation` | Number | set to `initialX`,`initialY`, `zIndex`, 0 |


(remaining: Evaluation)