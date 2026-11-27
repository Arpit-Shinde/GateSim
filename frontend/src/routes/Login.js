import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import * as CONSTANTS from "../constants/constants";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Placeholder handler functions for your logic
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Add your custom logic here
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Add your custom logic here
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Add your custom logic here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setStatusMessage("Please wait...");

    // If Render is waking from sleep (>4s), let the user know why it's taking a moment
    const slowWakeTimer = setTimeout(() => {
      setStatusMessage("Please wait... waking up server (may take ~30s)...");
    }, 4000);

    let info = JSON.stringify({ username, email, password })
    try {
      const response = await fetch(`${CONSTANTS.API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }, //required to tell express server that incoming data is of json type, else it ignores and body will be empty
          body: info
        }
      )
      let responseData = await response.json()
      if (responseData.error) {
        alert(responseData.error);
        return;
      }
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("username", responseData.userName);
        alert(responseData.status);
        navigate("/simulator");
      }

    }
    catch (error) {
      console.log(error);
      alert("Some Error occured. Please Try Again");
    }
    finally {
      clearTimeout(slowWakeTimer);
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="login-container">
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Log In</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="logic_builder"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            <button type="submit" className="btn-submit">
              {isLoading ? "Logging In..." : "Continue" }
            </button>
            {statusMessage && (
              <p style={{ marginTop: "12px", fontSize: "14px", color: "#000000" }}>
                {statusMessage}
              </p>
            )}
          </form>
          <p className="signup-switch">
            New User?{' '}
            <Link to="/signup" className="switch-link">
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      <footer className="login-footer">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </footer>
    </div>
  );
}

export default Login;