import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../gatesim-logo2.png';
import { AboutModal } from "../components/about_modal";
import { useState } from 'react';
function Home() {

  let navigate = useNavigate();
  let [showAbout, setShowAbout] = useState(false);
  function showabout() {
    setShowAbout(true);
  }
  function closeAbout() {
    setShowAbout(false);
  }
  function handleLogin() {
    if (localStorage.getItem('token')) {
      alert("Already Logged In. Navigating to Simulator");
      navigate("/simulator")
      return;
    }
    navigate("/login")
  }
  return (
    <div className="home-container">
  {/* Minimal Top Bar for Auth */}
  <header className="home-header" style={{ justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={showabout}>
      <img className="logo" src={logo} alt="GateSim Logo" width="100" height="140" />
      <span className="brand-name" style={{ fontSize: "2rem" }}>GateSim</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button className="btn-ghost" onClick={handleLogin}>Log In</button>
      <Link to="/signup" className="btn-secondary">Sign Up</Link>
    </div>
  </header>

  {/* Centered Hero */}
  <main className="home-main" style={{ margin: "auto" }}>
    <h1 className="home-title">Build and test logic circuits in your browser.</h1>

    <p className="home-subtitle">
      A minimal, distraction-free digital logic simulator built for Digital Logic and Computer Organization—from basic gates and custom components up to full RISC-V CPUs.
    </p>
    <p className="home-subtitle">
      Download Windows App for smoother experience.  
    </p>

    <div className="home-actions">
      <Link to="/simulator" className="btn-primary">
        Open Simulator
      </Link>

      <a
        href="https://github.com/Arpit-Shinde/GateSim/releases/download/v1.0.0/GateSim.Installer.exe"
        download
        className="btn-secondary"
        style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
        </svg>
        <span>Download for Windows</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </a>
    </div>
  </main>
  {/* Footer with GitHub & Feedback */}
      <footer className="home-footer">
        <div className="footer-links">
          <a
            href="https://github.com/Arpit-Shinde/GateSim"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeki7mPh_tv1oenImwhSvYWuHlPr_6i24ZE1eOEmbw342DmNw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Feedback</span>
          </a>
        </div>
      </footer>

  {showAbout && <AboutModal onClose={closeAbout} />}
</div>
  );
}

export default Home;
