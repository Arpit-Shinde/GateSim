export function SpecifyInputsSidebar({
  componentName,
  setComponentName,
  pinPhase,
  pinIndex,
  specifyingInputs,
  pinName,
  setPinName,
  inputOrder,
  setInputOrder,
  componentIdMapRef,
  selectedGate,
  setSelectedGate,
  componentInputs,
  setComponentInputs,
  componentOutputs,
  setComponentOutputs,
  componentGraph,
  setComponentGraph,
  setCustomComponents,
  setPinPhase,
  setPinIndex,
  setSpecifyingInputs,
  cancelComponentCreation
}) {
  return (
    <div className="right-sidebar">
      <div className="right-sidebar-content">
        <input
          className="component-name-input"
          placeholder="Component name"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
        />

        {pinPhase === "input" ? (
          <>
            <p>Specify input for pin number {pinIndex}</p>
          </>
        ) : (
          <>
            <p>Specify output for pin number {pinIndex}</p>
          </>
        )}
      </div>

      {specifyingInputs && (
        <>
          <label>
            {pinPhase === "input"
              ? `Input ${pinIndex}`
              : `Output ${pinIndex + 1}`}
          </label>

          <input
            type="text"
            value={pinName}
            onChange={(e) => setPinName(e.target.value)}
            placeholder={
              pinPhase === "input" ? `I${pinIndex}` : `O${pinIndex + 1}`
            }
          />
        </>
      )}

      <div className="right-sidebar-footer">
        <button
          className="utilities-button"
          onClick={() => {
            if (pinPhase === "input") {
              const newOrder = [...inputOrder];
              console.log("newOrder = ");
              console.table(newOrder);
              const mappedId = componentIdMapRef.current.get(selectedGate?.id);

              console.log("mappedId = ", mappedId);
              const idx = newOrder.indexOf(mappedId);
              console.log("idx = ", idx);

              if (idx === -1) {
                alert("Please select a valid input toggle.");
                return;
              }

              // Use entered name, or default to I0, I1, I2, ...
              const name = pinName.trim() || `I${pinIndex}`;

              // Move that toggle to the current pin position.
              const [moved] = newOrder.splice(idx, 1);

              newOrder.splice(pinIndex, 0, moved);

              // Save the new ordering.
              setInputOrder(newOrder);
              console.log("inputOrder = ");
              console.table(newOrder);

              // Save the pin name.
              // This updates every internal mapping belonging
              // to this external input source.
              setComponentInputs((prev) =>
                prev.map((entry) =>
                  entry.sourceId === mappedId ? { ...entry, name } : entry
                )
              );

              setSelectedGate(null);

              // Still have more component inputs to specify.
              if (pinIndex + 1 < newOrder.length) {
                setPinIndex(pinIndex + 1);

                // Default name for next input.
                setPinName(`I${pinIndex + 1}`);

                return;
              }

              // Input specification finished.
              if (componentOutputs.length > 0) {
                setPinPhase("output");
                setPinIndex(0);

                // Default name for first output.
                setPinName("O0");

                return;
              }

              // No outputs → create component.
              if (!componentName.trim()) {
                alert("Please enter a component name.");
                return;
              }

              // pins having same source (fan out case) are placed consecutively, and lets visualise them forming a group. these group appear in orderedInputs in the order which user selects toggles to specify input pins.
              const orderedInputs = newOrder.flatMap((sourceId) =>
                componentInputs
                  .filter((entry) => entry.sourceId === sourceId)
                  .map((entry) => ({
                    ...entry,
                    name: entry.sourceId === mappedId ? name : entry.name,
                  }))
              );

              const customComponent = {
                type: "CUSTOM",

                name: componentName.trim(),

                inputs: structuredClone(orderedInputs),

                outputs: structuredClone(componentOutputs),

                ref_graph: structuredClone(componentGraph),
              };

              setCustomComponents((prev) => [...prev, customComponent]);

              // Reset component creation state.
              setComponentGraph([]);
              setComponentInputs([]);
              setComponentOutputs([]);
              setInputOrder([]);
              setComponentName("");
              setPinName("");
              setSpecifyingInputs(false);
            } else {
              const mappedId = componentIdMapRef.current.get(selectedGate?.id);
              console.log("out mappedId = ", mappedId);

              const idx = componentOutputs.findIndex(
                (entry, i) => i >= pinIndex && entry.bulbId === mappedId
              );
              console.log("out idx = ", idx);

              if (idx === -1) {
                alert("Please select a valid output bulb.");
                return;
              }

              // Use entered name, or default to O1, O2, O3, ...
              const name = pinName.trim() || `O${pinIndex + 1}`;

              // Create the reordered output array locally.
              // This is important because React state updates
              // are asynchronous.
              const reorderedOutputs = [...componentOutputs];

              const [moved] = reorderedOutputs.splice(idx, 1);

              const namedOutput = { ...moved, name };

              reorderedOutputs.splice(pinIndex, 0, namedOutput);

              // Save the updated outputs.
              setComponentOutputs(reorderedOutputs);
              console.log("ComponentOutputs = ");
              console.table(reorderedOutputs);
              setSelectedGate(null);

              // Still have more component outputs to specify.
              if (pinIndex + 1 < reorderedOutputs.length) {
                setPinIndex(pinIndex + 1);

                // Default name for next output.
                setPinName(`O${pinIndex + 1}`);

                return;
              }

              // Output specification finished.
              if (!componentName.trim()) {
                alert("Please enter a component name.");
                return;
              }

              console.log("Output specification finished");

              const orderedInputs = inputOrder.flatMap((sourceId) =>
                componentInputs.filter((entry) => entry.sourceId === sourceId)
              ); //shuffling of componentInputs happens here, in the order of which user clicked toggles.

              console.log("Shuffled comp.inputs = ");
              console.table(orderedInputs);
              console.log("comp.outputs = ");
              console.table(reorderedOutputs);
              console.log("Component graph = ");
              console.table(componentGraph);

              const customComponent = {
                type: "CUSTOM",

                name: componentName.trim(),

                inputs: structuredClone(orderedInputs),

                // IMPORTANT:
                // Use reorderedOutputs rather than
                // componentOutputs because the state
                // update above may not have completed yet.
                outputs: structuredClone(reorderedOutputs),

                ref_graph: structuredClone(componentGraph),
              };

              setCustomComponents((prev) => [...prev, customComponent]);

              // Reset component creation state.
              setComponentGraph([]);
              setComponentInputs([]);
              setComponentOutputs([]);
              setInputOrder([]);
              setComponentName("");
              setPinName("");
              setSpecifyingInputs(false);
            }
          }}
        >
          DONE
        </button>

        <button
          className="utilities-button"
          onClick={cancelComponentCreation}
          style={{ marginRight: "auto" }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}