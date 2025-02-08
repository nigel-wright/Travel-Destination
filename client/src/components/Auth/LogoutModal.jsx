import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../styles/Modals.css'

function LogoutModal({ onClose }) {
    const navigate = useNavigate();

    const logout = () => {

        // Clear local storage
        localStorage.clear();

        // Redirect user to home
        navigate("/");

        onClose();
    }

  return (
    <div className='logout-container'>
        <h1>Log out!</h1>
        <p>You are going to be logged out, are you sure this is what you want to do?</p>
        <button onClick={logout}>
            Yes, Log out!
        </button>
        <button onClick={onClose}>
            No, Stay Logged In
        </button>
    </div>
  )
}

export default LogoutModal