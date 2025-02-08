import React from 'react';
import LoginModal from '../../components/Auth/LoginModal';
import RegisterModal from '../../components/Auth/RegisterModal';

function AuthPage({ mode, onClose, onToggleMode}) {
  if (mode === "login") {
    console.log("logging in...")
  } else  {
    console.log("registering now...")
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {mode === "login" ? <LoginModal onToggleMode={onToggleMode} onClose={onClose}/> : <RegisterModal onToggleMode={onToggleMode} onClose={onClose}/>}
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  )
}

export default AuthPage;