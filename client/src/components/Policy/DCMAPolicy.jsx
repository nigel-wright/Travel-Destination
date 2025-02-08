import React from 'react';
import '../../styles/Policy.css'
import { useNavigate } from 'react-router-dom';

function DMCAPolicy() {
    const navigate = useNavigate()
    
  return (
    <div className="policy-container">
      <h1>DMCA Notice & Takedown Policy</h1>
      <p>
        Nigel's Travel Guide respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). If you believe your content has been used on our platform without permission, please follow the steps below.
      </p>
      <h2>Submitting a DMCA Notice</h2>
      <p>To file a takedown notice, please provide the following information:</p>
      <ul>
        <li>Your name, address, and contact information.</li>
        <li>A description of the copyrighted work you believe has been infringed.</li>
        <li>The URL or location of the infringing content.</li>
        <li>A statement that you have a good faith belief the use is unauthorized.</li>
        <li>A statement that the information in your notice is accurate.</li>
        <li>Your electronic or physical signature.</li>
      </ul>
      <h2>Contact Information</h2>
      <p>
        Send DMCA notices to: <a href="mailto:nwrigh32@uwo.ca">nwrigh32@uwo.ca</a>
      </p>
      <h2>Counter-Notification</h2>
      <p>
        If you believe your content was removed in error, you may submit a counter-notification 
        including the following information:
      </p>
      <ul>
        <li>Your name, address, and contact information.</li>
        <li>A description of the removed content and its location before removal.</li>
        <li>A statement under penalty of perjury that the removal was a mistake.</li>
        <li>Your consent to jurisdiction in the district of your address.</li>
        <li>Your electronic or physical signature.</li>
      </ul>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
}

export default DMCAPolicy;