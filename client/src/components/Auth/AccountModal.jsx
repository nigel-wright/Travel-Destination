import React, { useState, useEffect }  from 'react'
import axios from 'axios';
import '../../styles/Modals.css'
import profilePicture from '../../../img/profilePicture.png'
import api from '../../api';
import { useNavigate } from 'react-router-dom';

function AccountModal({ onClose }) {
    const navigate = useNavigate(); 
    const [passowrdChange, setPasswordChange] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState(null)
    const [success, setSuccess] = useState(""); 
    const [admin, setIsAdmin] = useState(false); 

    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("user is: ", user)
        setIsAdmin(api.adminCheck(user));
    }, []);

    const createNewPassword = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                setMsg("Make sure the passwords match!")
                return; 
            }
            const username = user.username
            const response = await axios.put("/api/account/change_password", 
                { 
                    username, 
                    password 
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if (response.status === 200) {
                setSuccess(response.data)  
                setMsg("");
                changePassword();
            } else {
                setMsg("Something went wrong when changing passwords!")
            }
        } catch (err) {
            console.log("The error is: ", err)
            setMsg(err.response.data)
        }
    }

    const changePassword = () => {
        setPasswordChange(!passowrdChange)
    }

    const settings = () => {
        onClose();
        navigate("/admin-page")
    }

  return (
    <div className="account-container">
        <h1>Account Info</h1>
        <img src={profilePicture} alt="profile picture"/>
        {admin && <h3 style={{color: 'green', fontWeight: '5px'}}>ADMIN</h3>}
        <h3>Username</h3>
        <span>{user.username}</span>
        <h3>Email</h3>
        <span>{user.email}</span>
        {!passowrdChange && !admin && 
        <button className='change-password' onClick={changePassword}>
            Change Password
        </button>
        }

        {passowrdChange &&
            <form onSubmit={createNewPassword}>
                <label htmlFor='password'>New Password</label>
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <h4 htmlFor='password'>Confirm New Password</h4>
                <input
                type="password"
                id="confrim-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                 />
                <button type="submit">Change!</button>
            </form>
        }
        {msg && <p style={{ color: "red" }}>{msg}</p>}
        {success && <p style={{color:'green'}}>{success}</p>}

        {admin && <button className='site-settings' onClick={settings}>Site Settings</button>}
    </div>
  )
}

export default AccountModal