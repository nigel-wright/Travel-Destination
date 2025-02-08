import React from 'react';
import '../../styles/Policy.css'
import { useNavigate } from 'react-router-dom';

function SecurityPrivacyPolicy() {
    const navigate = useNavigate()

  return (
    <div className="policy-container">
      <h1>Security and Privacy Policy</h1>
      <p>
        Your security and privacy are our top priorities at Nigel's Travel Guide. 
        We are committed to protecting your personal information and ensuring that your 
        data is handled responsibly.
      </p>
      <h2>Data Collection</h2>
      <p>
        We collect only the data necessary to provide and improve our services, 
        including your username, email address, and preferences.
      </p>
      <h2>Data Usage</h2>
      <p>
        Your data is used solely to enhance your experience on our platform. 
        We do not sell or share your information with third parties without your consent.
      </p>
      <h2>Security Measures</h2>
      <p>
        We implement industry-standard security measures, such as encryption and 
        secure access controls, to protect your data.
      </p>
      <h2>Your Rights</h2>
      <p>
        You have the right to access, modify, or delete your personal data. 
        For any questions, contact our support team.
      </p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
}

export default SecurityPrivacyPolicy;