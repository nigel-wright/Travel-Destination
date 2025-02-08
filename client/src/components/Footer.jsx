import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const [isVisible, setIsVisible] = useState(true); // Track footer visibility
  let lastScrollY = 0; // Store the last scroll position

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      lastScrollY = window.scrollY; // Update the last scroll position
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Clean up event listener
  }, []);
  return (
    <div>
    <footer className="footer">
    <p>
      Nigel 2024
      <span className="separator">|</span>
      <Link to="/security-privacy-policy" className="nav-link">Privacy Policy</Link>
      <span className="separator">|</span>
      <Link to="/acceptable-use-policy" className="nav-link">Acceptable Use Policy</Link>
      <span className="separator">|</span>
      <Link to="/dmca-policy" className="nav-link">DMCA Notice & Takedown Policy</Link>
    </p>
  </footer>
  </div>
  )
}

export default Footer

