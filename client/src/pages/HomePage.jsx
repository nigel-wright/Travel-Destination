import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/HomePage.css'

function HomePage() {
  const [isAuth, setAuth] = useState("");

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const verify = api.verifyCheck(JSON.parse(localStorage.getItem('user')));
      setAuth(verify)
    }
  }, [])

  return (
    <div className='home-page'>
        <div>
            <h2>Welcome to Nigel Travel Guide</h2>
            <p>
  Embark on an unforgettable journey with Nigel's Travel Guide! 
  Explore breathtaking destinations across Europe, discover hidden gems, 
  and create personalized travel lists. Whether you're a seasoned traveler 
  or planning your first adventure, we’ve got everything you need—from 
  destination insights to curated reviews. Start your exploration today and 
  uncover the beauty of Europe like never before!
          </p>
        </div>
      <div className='button-container'>
          <Link to="/search">
        <button>
          Begin Exploring!
        </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;