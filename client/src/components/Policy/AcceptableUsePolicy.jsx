import React from 'react';
import '../../styles/Policy.css'
import { useNavigate } from 'react-router-dom';

function AcceptableUsePolicy() {
    const navigate = useNavigate()

  return (
    <div className="policy-container">
      <h1>Acceptable Use Policy</h1>
      <p>
        Welcome to Nigel's Travel Guide! By using our platform, you agree to adhere to the following guidelines to ensure a positive experience for all users.
      </p>
      <h2>Prohibited Activities</h2>
      <ul>
        <li>Uploading harmful or malicious content.</li>
        <li>Engaging in harassment, hate speech, or discriminatory behavior.</li>
        <li>Attempting to bypass or breach security measures.</li>
        <li>Using automated tools to scrape or manipulate data.</li>
      </ul>
      <h2>User Responsibilities</h2>
      <p>
        Users are responsible for maintaining the security of their accounts and 
        ensuring that all activities under their accounts comply with this policy.
      </p>
      <h2>Enforcement</h2>
      <p>
        Violations of this policy may result in account suspension or termination. 
        Serious violations may be reported to legal authorities.
      </p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
}

export default AcceptableUsePolicy;