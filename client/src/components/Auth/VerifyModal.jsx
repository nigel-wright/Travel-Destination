import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Verify.css'

function VerifyModal() {
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const [isVerified, setVerified] = useState(false); 
    const [error, setError] = useState("")
    const [openInput, setInput] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (location.state && location.state.user) {
            const user = location.state.user; // Access the `user` object from `state`
            setEmail(user.email); // Use user.email here
          }
    }, [location.state])

    console.log("temp emails is: ", email)
    const wantToVerify = () => {
        setInput(true)
    }

    const verify = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        const username = user.username;

        try {
            const response = await axios.post("/api/account/verify_email",
                {
                    username: username, 
                    email:email,
                },
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            if (response.status !== 200) {
                setError("Cannot verify email! Try again later.")
                return;
            } else {
                console.log("You have been successfully verified!")
                user.isVerified = true;
                console.log("user is: ", user)
                localStorage.setItem('user', JSON.stringify(user))
                setVerified(true)
            }
        } catch (err) {
            console.log("there was an error when verifiying the email.")
            setError("There was an error when verifying your email. Try again later!")
        }
    }

    const goHome = () => {
        navigate("/")
    }

  return (
    <div className='verify-container'>
        {!isVerified && <button className="expand-veriy" onClick={wantToVerify}>
            Click here to verify email!
        </button>}

        {openInput && !isVerified && 
            <>
            <h1>Your email is: </h1>
            <h3>{email}</h3>
            <button onClick={verify}>Confirm Email</button>
            {error && <p style={{color:'red'}}>{error}</p>}
            </>
        }

       

        {isVerified && (
            <>
            <p style={{ color: "green", fontSize: "15px" }}>Congrats, you have been verified</p>
            <button onClick={goHome}>Go To Home</button>
            </>
        )}
    </div>
  )
}

export default VerifyModal