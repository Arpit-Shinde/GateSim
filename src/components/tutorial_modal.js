export function showTutorial() {
  const overlay = document.createElement('div');

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const modal = document.createElement('div');

  modal.style.cssText = `
    background: #1a1a1a;
    color: #cbd5e0;
    width: 90%;
    min-width: 500px;
    max-width: 650px;
    max-height: 82vh;
    overflow-y: auto;
    padding: 36px 40px;
    border-radius: 12px;
    border: 1px solid #333;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.8;
    box-sizing: border-box;
  `;

  modal.innerHTML = `
    <!-- Header -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 18px;
    ">
      <h1 style="
        font-size: 32px;
        margin: 0;
        color: #d4d4d4;
        font-weight: 400;
      ">
        Tutorial
      </h1>

      <button id="closeTutorial" style="
        background: none;
        border: none;
        color: #777;
        font-size: 24px;
        cursor: pointer;
      ">✕</button>
    </div>


    <div style="
      display: flex;
      flex-direction: column;
    ">

      <!-- Add -->
      <section>
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 16px 0 8px 0;
        ">
          Add
        </h4>

        <p style="
          margin: 0 0 12px 0;
          color: #cbd5e0;
        ">
          Navigate through the toolbar on left and left-click a component.
          It will be placed at the center of the canvas.
        </p>
      </section>


      <!-- Move -->
      <section>
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
          Move, Pan & Zoom
        </h4>

        <p style="margin: 0;">
          <b>Move gate:</b> Left-click + drag
          <br>
          <b>Pan canvas:</b> Middle-click + drag
          <br>
          <b>Zoom:</b> Scroll wheel
        </p>
      </section>


      <!-- Wiring -->
      <section>
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
          Wiring
        </h4>

        <p style="margin: 0;">
          <b>Start wire:</b> Click an output pin
          <br>
          <b>Connect:</b> Click an input pin
          <br>
          <b>Commit wire:</b> Left-click
          <br>
          <b>Cancel wire:</b> Right-click
          <br>
          <b>Branch wire:</b> Left-click an existing wire
        </p>
      </section>


      <!-- Selection -->
      <section>
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
          Selection
        </h4>

        <p style="margin: 0;">
          <b>Component:</b> Left-click
          <br>
          <b>Wire:</b> Middle-click
        </p>
      </section>


      <!-- Inputs & Clocks -->
      <section>
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
          Inputs & Clocks
        </h4>

        <p style="margin: 0;">
          <b>Toggle input:</b> Click the slider circle
          <br>
          <b>Clock:</b> Add CLOCK and enter the delay in milliseconds.
          Press Enter or OK.
        </p>
      </section>


      <!-- Edit -->
      <section>
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
          Edit
        </h4>

        <p style="margin: 0;">
          <b>Delete:</b> Select → Delete key
          <br>
          <b>Rotate:</b> Select → TOOLS → ROTATE
          <br>
          <b>Undo:</b> EDIT → UNDO
          <br>
          <b>Redo:</b> EDIT → REDO 
          <br>
          <b>Clear entire circuit:</b> EDIT → CLEAR CIRCUIT
          <br>
          <b>Beautify:</b> EDIT → BEAUTIFY
          <br>
          <b>Pause Clocks:</b> SIMULATION → PAUSE CLOCKS
          <br>
          <b>Start Clocks:</b> SIMULATION → START CLOCKS
          <br>
          <b>Add labels:</b> Left-click LABEL (from toolsbar) → Double left-click on "label" on canvas → Change the text
        </p>
      </section>
      <section>
  <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
    Self-Learn
  </h4>

    <p style="margin: 0;">
          Choose SELF-LEARN and a sidebar will appear. It is stretchable. 
          The content is provided from geeksforgeeks.org, and the diagrams are made in GateSim itself.
          

      <section>
  <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
    Component Creation
  </h4>

  <h5
    style={{
      color: "#bbb",
      fontSize: "19px",
      fontWeight: 500,
      margin: "22px 0 10px 0",
    }}
  >
    Rules
  </h5>

  <div
    style={{
      background: "#303030",
      border: "1px solid #444",
      borderRadius: "8px",
      padding: "16px 18px",
      marginBottom: "18px",
      lineHeight: "1.7",
    }}
  >
    <p style={{ margin: "0 0 10px 0" }}>
      Build your circuit as usual.
    </p>

    <p style={{ margin: "0 0 10px 0" }}>
      Connect input toggles wherever your custom component should receive
      inputs. Each toggle connected to the circuit becomes an input pin of
      the custom component.
    </p>

    <p style={{ margin: 0 }}>
      Connect bulbs wherever your custom component should produce an output.
      Each connected bulb becomes an output pin.
    </p>
  </div>

  <h5
    style={{
      color: "#bbb",
      fontSize: "19px",
      fontWeight: 500,
      margin: "22px 0 10px 0",
    }}
  >
    Creating the Component
  </h5>

  <ol
    style={{
      margin: 0,
      paddingLeft: "24px",
      lineHeight: "1.75",
    }}
  >
    <li>
      Build the circuit you want to turn into a reusable component.
    </li>

    <li>
      Click <strong>"CREATE COMPONENT"</strong>.
    </li>

    <li>
      Click <strong>"SELECT MODE"</strong>. This allows you to draw a
      selection area over the canvas.
    </li>

    <li>
      Left-click and drag from one corner of the circuit to another. A
      translucent blue rectangle will appear.
    </li>

    <li>
      Any gates, bulbs, or toggles that lie completely inside the selection
      area will be included in the component.
    </li>

    <li>
      Click <strong>"DONE"</strong> to confirm the selection.
    </li>

    <li>
      A sidebar will appear where you can define the component's input pins,
      output pins, and component name.
    </li>

    <li>
      To assign an input pin, left-click the toggle you want to use as that
      input. The selected toggle will glow to indicate that it has been
      assigned.
    </li>

    <li>
      Optionally enter a name for the input pin, then click
      <strong>"DONE"</strong>.
    </li>

    <li>
      Repeat the same process for the output pins by selecting the
      corresponding bulbs.
    </li>

    <li>
      Give the component a name. Keep pin names short and descriptive.
    </li>

    <li>
      Once created, the component will appear in the
      <strong>"CUSTOM"</strong> section of the left toolbar and can be
      reused like any other component.
    </li>
  </ol>
</section>
<section>
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 20px 0 8px 0;
        ">
          Download & Save
        </h4>

        <p style="margin: 0;">
          <b>Download a circuit:</b> FILE → DOWNLOAD CIRCUIT
          <br>
          <b>Load a circuit:</b> FILE → LOAD CIRCUIT
          <br>
          <b>Load a Component:</b> FILE → COMPONENTS → LOAD COMPONENT.
          <br>
          <b>Save a Component:</b> FILE → COMPONENTS → Your created/loaded components will appear. Click SAVE next to them.
        </p>
      </section>


      <!-- Important -->
      <section style="
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #3a3a3a;
      ">
        <h4 style="
          color: #aaa;
          font-size: 22px;
          font-weight: 500;
          margin: 0 0 8px 0;
        ">
          Important Points
        </h4>

        <ol style="
          margin: 0;
          padding-left: 22px;
          color: #cbd5e0;
        ">
          <li>Unconnected inputs default to <b>false</b>.</li>
          <li>Pause clocks when switching to other tasks.</li>
          <li>Deleting a wire also deletes its branches and removes internal connections.</li>
          <li>Deleting a gate removes all wires connected to it and removes internal connections.</li>
          <li>Moving a gate does not move its wires; internal connections remain unchanged.</li>
          <li>Don't leave dangling input pin or unconnected pins while creating components</li>
          <li>Beautify will just straighten wires. It won't move gates on the canvas</li>     
          </ol>
      </section>


      <!-- Good Luck -->
      <section style="
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #3a3a3a;
        text-align: center;
      ">
        <p style="
          margin: 0;
          color: #a9a9a9;
          font-size: 17px;
          font-weight: 500;
        ">
          Good luck!
        </p>
      </section>

    </div>


    <!-- Bottom Button -->
    <button id="closeTutorial2" style="
      width: 100%;
      margin-top: 24px;
      padding: 10px;
      background: #333;
      color: #ccc;
      border: 1px solid #444;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    ">
      Got it
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', handleKey);
  };

  modal.querySelector('#closeTutorial').addEventListener('click', close);
  modal.querySelector('#closeTutorial2').addEventListener('click', close);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  const handleKey = e => {
    if (e.key === 'Escape') {
      close();
    }
  };

  document.addEventListener('keydown', handleKey);
}