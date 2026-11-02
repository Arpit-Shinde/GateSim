export function ToolsBar({
  inputGateRenderList,
  twoInputGateRenderList,
  threeInputGateRenderList,
  fourInputGateRenderList,
  sequentialGateRenderList,
  MuxGateRenderList,
  AdderGateRenderList,
  outputGateRenderList,
  customComponents,
  Add,
  GateCard,
  RenderCUSTOM
}) {
  return (
    <div className="toolsBar">
      <details className="toolSection">
        <summary className="toolButton">Input</summary>
        <div className="toolGateCards">
          {inputGateRenderList.map((object) => (
            <div key={object.type} onClick={() => Add(object.type)}>
              <GateCard RenderFn={object.render} gateType={object.type} />
            </div>
          ))}
        </div>
      </details>

      <details className="toolSection">
        <summary className="toolButton">Gates</summary>
        <div className="gateCategories">
          <details className="gateCategory">
            <summary className="categoryButton">2-INPUT</summary>
            <div className="toolGateCards">
              {twoInputGateRenderList.map((object) => (
                <div key={object.type} onClick={() => Add(object.type)}>
                  <GateCard RenderFn={object.render} gateType={object.type} />
                </div>
              ))}
            </div>
          </details>

          <details className="gateCategory">
            <summary className="categoryButton">3-INPUT</summary>
            <div className="toolGateCards">
              {threeInputGateRenderList.map((object) => (
                <div key={object.type} onClick={() => Add(object.type)}>
                  <GateCard RenderFn={object.render} gateType={object.type} />
                </div>
              ))}
            </div>
          </details>

          <details className="gateCategory">
            <summary className="categoryButton">4-INPUT</summary>
            <div className="toolGateCards">
              {fourInputGateRenderList.map((object) => (
                <div key={object.type} onClick={() => Add(object.type)}>
                  <GateCard RenderFn={object.render} gateType={object.type} />
                </div>
              ))}
            </div>
          </details>
        </div>
      </details>

      <details className="toolSection">
        <summary className="toolButton">Sequential</summary>
        <div className="gateCategories">
          <details className="gateCategory">
            <summary className="categoryButton">FLIP-FLOPS</summary>
            <div className="toolGateCards">
              {sequentialGateRenderList.map((object) => (
                <div key={object.type} onClick={() => Add(object.type)}>
                  <GateCard RenderFn={object.render} gateType={object.type} />
                </div>
              ))}
            </div>
          </details>
        </div>
      </details>

      <details className="toolSection">
        <summary className="toolButton">Combinational</summary>
        <div className="gateCategories">
          <details className="gateCategory">
            <summary className="categoryButton">MuX</summary>
            <div className="toolGateCards">
              {MuxGateRenderList.map((object) => (
                <div key={object.type} onClick={() => Add(object.type)}>
                  <GateCard RenderFn={object.render} gateType={object.type} />
                </div>
              ))}
            </div>
          </details>

          <details className="gateCategory">
            <summary className="categoryButton">Adder</summary>
            <div className="toolGateCards">
              {AdderGateRenderList.map((object) => (
                <div key={object.type} onClick={() => Add(object.type)}>
                  <GateCard RenderFn={object.render} gateType={object.type} />
                </div>
              ))}
            </div>
          </details>
        </div>
      </details>

      <details className="toolSection">
        <summary className="toolButton">Output</summary>
        <div className="toolGateCards">
          {outputGateRenderList.map((object) => (
            <div key={object.type} onClick={() => Add(object.type)}>
              <GateCard RenderFn={object.render} gateType={object.type} />
            </div>
          ))}
        </div>
      </details>

      <div className="toolButton" onClick={() => Add("TEXT")}>LABEL</div>

      <details className="toolSection">
        <summary className="toolButton">Custom</summary>
        <div className="toolGateCards">
          {customComponents.map((component, index) => (
            <div
              key={`${component.name}-${index}`}
              onClick={() => Add("CUSTOM", null, null, null, component)}
            >
              <GateCard RenderFn={() => <RenderCUSTOM node={component} />} gateType={component.name} />
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}