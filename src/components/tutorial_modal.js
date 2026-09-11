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
          Navigate through the toolbar and left-click a component.
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
          <b>Rotate:</b> Select → ROTATE
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