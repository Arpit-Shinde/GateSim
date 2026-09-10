import logo from './gatesim-logo2.png';
export function AboutModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          minWidth: '500px',      // ← Bigger width
          minHeight: '300px',
          padding: '36px 40px',   // ← More padding
          borderRadius: '12px',
          overflowY: 'auto'
        }}
      >
        <div className="modal-header">
          <img 
  src={logo} 
  alt="GateSim Logo" 
  width={55} 
  height={75} 
  className="logo-in-about"
  style={{ marginRight: '8px' }}
/>
<h1 style={{ fontSize: '32px', margin: 0, color: '#d4d4d4', fontWeight: '400', marginLeft: '-250px' }}>GateSim</h1>
          <button onClick={onClose} className="modal-close" style={{ fontSize: '24px' }}>✕</button>
        </div>
        <div className="modal-body">
          <h4 style={{ color: '#aaa', fontSize: '22px', fontWeight: '500', margin: '16px 0 8px 0' }}>
            About
          </h4>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e0', margin: '0 0 12px 0' }}>
            GateSim is a web-based digital logic simulator built by a student, for a student. Start from basic gates and learn along building your own components and eventually, your own CPU
          </p>

          <h4 style={{ color: '#aaa', fontSize: '22px', fontWeight: '500', margin: '20px 0 8px 0' }}>
            Limitations
          </h4>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e0', margin: '0' }}>
            No propagation delay. Master-Slave configuration suggested in case of flip flops to avoid race condition
          </p>

          <p style={{ marginTop: '24px', fontSize: '15px', color: '#a9a9a9', borderTop: '1px solid #3a3a3a', paddingTop: '16px' }}>
            Created and maintained by (myname)
            <br />
            <a
              href="https://github.com/yourusername/gatesim"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00eff3', textDecoration: 'none', fontSize: '15px' }}
            >
              GitHub➚
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}