export function showTutorial() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #1a1a1a;
    color: #cccccc;
    border-radius: 8px;
    padding: 30px 35px;
    max-width: 480px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid #333333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    line-height: 1.6;
  `;

  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px;">
      <span style="color: #aaaaaa; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">TUTORIAL</span>
      <button id="closeTutorialBtn" style="
        background: none;
        color: #666666;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 0 4px;
      ">✕</button>
    </div>

    <div>
      <div style="margin-bottom: 12px;">
        <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Controls</span>
        <div style="margin-top: 4px; color: #bbbbbb;">
          
          <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #1a1a1a;">
            <span>Connect wires</span>
            <span style="color: #888888;">Output pin → Input pin (order matters)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #1a1a1a;">
            <span>Toggle input</span>
            <span style="color: #888888;">Click slider</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #1a1a1a;">
            <span>Delete</span>
            <span style="color: #888888;">Click Gate/Wire  + Delete key</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #1a1a1a;">
            <span>Cancel live wire</span>
            <span style="color: #888888;">Right click </span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <span style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Drag & Pan</span>
        <div style="margin-top: 4px; color: #bbbbbb;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #1a1a1a;">
            <span>Drag gate</span>
            <span style="color: #888888;">Left-click + drag</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #1a1a1a;">
            <span>Pan canvas</span>
            <span style="color: #888888;">Middle-click + drag</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span>Zoom</span>
            <span style="color: #888888;">Scroll wheel</span>
          </div>
        </div>
      </div>

      

      
    </div>

    <button id="closeTutorialBtn2" style="
      width: 100%;
      margin-top: 16px;
      background: #333333;
      color: #cccccc;
      border: none;
      border-radius: 4px;
      padding: 10px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s;
    ">Got It</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const close = () => {
    document.body.removeChild(overlay);
  };

  modal.querySelector('#closeTutorialBtn').addEventListener('click', close);
  modal.querySelector('#closeTutorialBtn2').addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); }
  }, { once: true });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}