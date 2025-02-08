import React from 'react';
import AccountModal from '../../components/Auth/AccountModal';
import LogoutModal from '../../components/Auth/LogoutModal';

function AccountPage({ mode, onClose}) {
  if (mode === "login") {
    console.log("looking at account in...")
  } else  {
    console.log("logging out now now...")
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {mode === "account" ? <AccountModal onClose={onClose}/> : <LogoutModal onClose={onClose}/>}
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  )
}

export default AccountPage;