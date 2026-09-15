import logo from './gatesim-logo2.png';

export function AboutModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          minWidth: '500px',
          minHeight: '300px',
          padding: '36px 40px',
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

          <h1
            style={{
              fontSize: '32px',
              margin: 0,
              color: '#d4d4d4',
              fontWeight: '400',
              marginLeft: '-250px'
            }}
          >
            GateSim
          </h1>

          <button
            onClick={onClose}
            className="modal-close"
            style={{ fontSize: '24px' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

          <h4
            style={{
              color: '#aaa',
              fontSize: '22px',
              fontWeight: '500',
              margin: '16px 0 8px 0'
            }}
          >
            About
          </h4>

          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#cbd5e0',
              margin: '0 0 12px 0'
            }}
          >
            GateSim is a digital logic simulator designed to
            make Digital Logic and Computer Organization easier to understand
            through hands-on experimentation.
          </p>

          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#cbd5e0',
              margin: '0 0 12px 0'
            }}
          >
            Start with basic logic gates, connect them to build your own
            circuits, and gradually move towards larger digital components
            such as adders, multiplexers, registers, and flip-flops.
            The goal is to learn digital systems by building them yourself.
          </p>

          <h4
            style={{
              color: '#aaa',
              fontSize: '22px',
              fontWeight: '500',
              margin: '20px 0 8px 0'
            }}
          >
            Get Started
          </h4>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#cbd5e0',
              margin: '0'
            }}
          >
            Navigate to "Tutorial" to learn how to use Simulator
          </p>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#cbd5e0',
              margin: '0'
            }}
          >
            Navigate to "Self-Learn" to learn DLD (Digital Logic Design) concepts.
            The content is provided from geeksforgeeks.org in this section.
          </p>


          <h4
            style={{
              color: '#aaa',
              fontSize: '22px',
              fontWeight: '500',
              margin: '20px 0 8px 0'
            }}
          >
            Limitations
          </h4>

          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#cbd5e0',
              margin: '0'
            }}
          >
            GateSim currently does not model physical propagation delays.
            For sequential circuits such as flip-flops, master-slave
            configurations are recommended to avoid
            race-around conditions.
          </p>

          <p
            style={{
              marginTop: '24px',
              fontSize: '15px',
              color: '#a9a9a9',
              borderTop: '1px solid #3a3a3a',
              paddingTop: '16px'
            }}
          >
            
            <br />

            <a
              href="https://github.com/Arpit-Shinde/GateSim"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#00eff3',
                textDecoration: 'none',
                fontSize: '15px'
              }}
            >
              GitHub ➚
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeki7mPh_tv1oenImwhSvYWuHlPr_6i24ZE1eOEmbw342DmNw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#00eff3',
                textDecoration: 'none',
                fontSize: '15px'
              }}
            >
                Leave us a Feedback ➚
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}

