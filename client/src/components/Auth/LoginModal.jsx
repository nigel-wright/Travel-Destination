import React, { useState }  from 'react'
import axios from 'axios';
import '../../styles/Modals.css'
import { useNavigate } from 'react-router-dom';

function LoginModal({ onToggleMode, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[error, setError] = useState(null);
  const [isVerfied, setVerfied] = useState(true); 

  const navigate = useNavigate()

  const handleSubmit = async (e) =>  {
    e.preventDefault();
      try {
        const response = await axios.post('/api/account/login', { email, password });
        console.log("User data:", response.data);

        const { token, user } = response.data;

        if (user.isDisabled){
          setError("Your account has been disabled! Please contact supprot.")
          onClose();
          navigate("/error")
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));

        if (!user.isVerified) {
          setError("You are not verified")
          setVerfied(false)
          return
        }

        if (response.status === 404) {
          setError("No user for this email.")
          return;
        } else if (response.status === 400) {
          setError("Incorrect Password.")
          return; 
        } else {
          setError(response.data.message)
        }

        // Store JWT in local storage
        localStorage.setItem("token", token);

        // Close the modal
        onClose();
        setError("");
      } catch(err) {
        setError(err.response.data);
        return;
      }
  }

  const verifyUser = () => {
    onClose(); 
    navigate('/verify-email', {state : { user: JSON.parse(localStorage.getItem('user'))}})
  }

  return (
        <div className="login-container">
            <h2>Login</h2>
            <p>Here you can log in to Nigel's Travel Guide</p>
            <form onSubmit={handleSubmit}>
            <label htmlFor="username">Email</label>
            <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {isVerfied && <button type="submit">Log in!</button>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!isVerfied && (
              <button onClick={verifyUser}>
                Click here to verify
              </button>
            )}

            <button className="account-toggle" onClick={onToggleMode}>
                Have an account? Log in
            </button>
            </form>
        </div>
  )
}

export default LoginModal;