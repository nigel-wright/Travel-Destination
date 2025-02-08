import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Error.css';

function ErrorPage() {
    const navigate = useNavigate();
    const goHome = () => {
        return navigate("/")
    }
    return (
        <div className='error-container'>
            <div className='error-content'>
                <h1>You cannot access this part of the website</h1>
                <p>You have been flagged, please contact support for further details</p>
                <p>Sorry for the inconvenience</p>
                <button onClick={goHome}>
                    Go Home!
                </button>
            </div>
        </div>
    );
}

export default ErrorPage