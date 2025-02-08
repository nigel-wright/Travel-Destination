import React, { useState, useEffect } from 'react';
import AuthPage from '../pages/Account/AuthPage';
import AccountPage from '../pages/Account/AccPage';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [account, isAccount] = useState(false)  
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      isAccount(true)
    }
  }, []);

  const openLoginModal = () => {
    setAuthMode("login");
    setIsModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode("register");
    setIsModalOpen(true);
  };

  const openAccountModal = () => {
    setAuthMode("account");
    setIsModalOpen(true);
  }

  const openLogoutModal = () => {
    setAuthMode("logout");
    setIsModalOpen(true);
  }

  const closeModal = () => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log("the user is: ", user)
      setAdmin(user.isAdmin);
    }
    
    if (localStorage.getItem("token")) {
      isAccount(true);
    } else if (authMode === "logout") {
      isAccount(false);
    }
    setIsModalOpen(false);
  };

  console.log("The account is: ", account)

  const toggleAuthMode = () => {
    setAuthMode((prevMode) => (prevMode === "login" ? "register" : "login"));
  };

  return (
    <div>
    <header className="header">
      <div className="header-title">
        <h2>Nigel's Travel Guide</h2>
      </div>
      <nav className="header-nav">
        <Link to="/" className="nav-link">About</Link>
        <Link to="/search" className="nav-link">Search</Link>
        {!account && <Link to="/list" className="nav-link">Public Lists</Link>}
        {account && <Link to="/auth-list" className='nav-link'>Your Lists</Link>}
      </nav>
      <div className="header-accounts">
      {!account ? (
      <>
        <button onClick={openLoginModal}>Login</button>
        <span>    </span>
        <button onClick={openRegisterModal}>Register</button>
      </>
      ) : (
      <>
        {!isAdmin ?  <button onClick={openAccountModal}>Account</button> : <button style={{color: 'white', backgroundColor: 'green'}} onClick={openAccountModal}>Admin</button>}
        <span>    </span>
        <button onClick={openLogoutModal}>Sign Out</button>
      </>
      )}
      </div>
      
      {isModalOpen && !account && <AuthPage mode={authMode} onClose={closeModal} onToggleMode={toggleAuthMode}/>}
      {isModalOpen && account && <AccountPage mode={authMode} onClose={closeModal}/>}
    </header>
    </div>
  )
}

export default Header