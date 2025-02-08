import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Modals.css'
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function RegisterModal({ onToggleMode, onClose }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) =>  {
        e.preventDefault();
        if (password !== confirmPassword) {
            return;
          }

        if (!/.+\@.+\..+/.test(email)) {
            setError("Please put email in the format xxx@xxx.xxx");
            return;
        }

        try {
            const response = await axios.post('/api/account/register', { username, password, email });
            
            if (response.status === 200) {
                api.addToLocalStorage('user', response.data.user);
            
                const user = JSON.parse(localStorage.getItem('user')); 
            
                navigate("/verify-email", { state: { user } });
                setError("");
                onClose();
            } else {
                setError("Issue making your account!")
                return;
            }
        } catch(err) {
            setError(err.response.data);
            return;
        }
    }

  return (
        <div className="register-container">
            <h2>Register</h2>
            <p>Here you can sign up to Nigel's Travel Guide</p>
            <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <label htmlFor="password">Confirm Password</label>
            <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            {confirmPassword && confirmPassword !== password && (
                <p style={{ fontSize: "10px", color: "red" }}>
                Please make sure your passwords match.
                </p>
            )}

            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <button type="submit">Register!</button>

            {error.length > 0 && <p style={{ color: "red" }}>{error}</p>}

            <button className="account-toggle" onClick={onToggleMode}>
                Have an account? Log in
            </button>
            </form>
        </div>
  )
}

export default RegisterModal; 