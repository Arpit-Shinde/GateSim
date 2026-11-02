export function ComponentDialog({
  componentName,
  setComponentName,
  componentGraph,
  setComponentGraph,
  componentInputs,
  setComponentInputs,
  componentOutputs,
  setComponentOutputs,
  setShowComponentDialog,
  setCustomComponents
}) {
  return (
    <div className="component-dialog-overlay">
      <div className="component-dialog">
        <h2>Create Component</h2>

        <input
          className="component-name-input"
          placeholder="Component name"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
        />

        <div className="component-graph-preview">
          {/* render componentGraph here */}
        </div>

        <div>
          <h3>Input Pins</h3>

          <div className="component-pin-list">
            {componentInputs.map((input, index) => (
              <div className="component-pin" key={index}>
                Input {index} → Node {input.nodeId}, pin {input.index}
              </div>
            ))}
          </div>
        </div>

        <div className="component-dialog-buttons">
          <button
            onClick={() => {
              setShowComponentDialog(false);
            }}
          >
            CANCEL
          </button>

          <button
            onClick={() => {
              if (!componentName.trim()) {
                alert("Please enter a component name.");
                return;
              }

              if (componentOutputs.length === 0) {
                alert("Please select at least one output pin.");
                return;
              }

              const customComponent = {
                type: "CUSTOM",
                name: componentName.trim(),

                inputs: structuredClone(componentInputs),
                outputs: structuredClone(componentOutputs),

                ref_graph: structuredClone(componentGraph)
              };

              console.log("Created component:", customComponent);

              setCustomComponents(prev => [
                ...prev,
                customComponent
              ]);

              // Reset
              setComponentGraph([]);
              setComponentInputs([]);
              setComponentOutputs([]);
              setComponentName("");

              setShowComponentDialog(false);
            }}
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
}