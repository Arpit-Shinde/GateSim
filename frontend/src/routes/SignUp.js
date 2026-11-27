import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import * as CONSTANTS from "../constants/constants";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
      const response = await fetch(`${CONSTANTS.API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"}, //required to tell express server that incoming data is of json type, else it ignores and body will be empty
          body: info
        }
      )
      let responseData = await response.json()
      if (responseData.error) {
        alert(responseData.error)
        return
      }
      if (responseData.status && !responseData.token){ //user already exists
        alert(responseData.status);
        navigate("/login");
      }
      if (responseData.token && responseData.token){ //successful signup
        localStorage.setItem("token", responseData.token)
        alert(responseData.status);
        navigate("/simulator");
      }

    }
    catch (error) {
      console.log(error);
      alert("Some error occured. Please try again");
    }
    finally {
      clearTimeout(slowWakeTimer);
      setIsLoading(false);
      setStatusMessage("");
    }

  };

  return (
    <div className="signup-container">
      <main className="signup-main">
        <div className="signup-card">
          <h1 className="signup-title">Sign Up</h1>

          <form onSubmit={handleSubmit} className="signup-form">
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
              {isLoading? "Creating Account...":"Create Account"}
            </button>
            {statusMessage && (
              <p style={{ marginTop: "12px", fontSize: "14px", color: "#000000" }}>
                {statusMessage}
              </p>
            )}
          </form>

          <p className="signup-switch">
            Already have an account?{' '}
            <Link to="/login" className="switch-link">
              Log in
            </Link>
          </p>
        </div>
      </main>

      <footer className="signup-footer">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </footer>
    </div>
  );
}

export default SignUp;