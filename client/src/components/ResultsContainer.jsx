import React, { useState, useEffect, useRef } from 'react';
import '../styles/SearchBar.css';
import L from 'leaflet'; 
import "leaflet/dist/leaflet.css";
import api from '../api';

function ResultsContainer({ results, no }) {
  const [expandedId, setExpandedId] = useState(null);
  const [onMap, setOnMap] = useState(false); 
  const [isAuth, setAuth] = useState(false); 
  const [clicked, setClicked] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const verify = JSON.parse(localStorage.getItem('user'))
    if (token) {
      setAuth(api.verifyCheck(verify) && token);
    }
    setCurrentPage(1);
  }, [no, results]); 

  const mapRef = useRef(null);
  const markersRef = useRef({});
  const initializeMap = () => {
    if (!mapRef.current) {
      const mapContainer = document.getElementById("map");
      if (!mapContainer) {
        console.error("Map container not found");
        return;
      }

      mapRef.current = L.map("map").setView([43.6532, -79.3832], 13); // Example coordinates

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  };

  useEffect(() => {
    if (results && results.length > 0) {
      initializeMap();
    } else {
      if (mapRef.current) {
        mapRef.current.remove(); // Clean up the map instance
        mapRef.current = null;
      }
    }
  }, [results]); // Re-run when results change


  const addToMap = (result) => {
    if (!mapRef.current) return;

    const { Latitude, Longitude, ID } = result;

    // Remove existing marker if it's already displayed
    if (markersRef.current[ID]) {
      mapRef.current.removeLayer(markersRef.current[ID]);
      delete markersRef.current[ID];
      setOnMap(null);
      return;
    }

    // Add a new marker
    const marker = L.marker([Latitude, Longitude]).addTo(mapRef.current);
    markersRef.current[ID] = marker;
    mapRef.current.setView([Latitude, Longitude], 8); // Center the map on the marker
    setOnMap(ID);
  };

  useEffect(() => {
    if (results && results.length > 0) {
      initializeMap();
    } else {
      if (mapRef.current) {
        mapRef.current.remove(); // Clean up the map instance
        mapRef.current = null;
        markersRef.current = {}; // Clear markers
      }
    }
  }, [results]);
 
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const searchOnDDG = (destination) => {
    console.log("dest is: ", destination)
    const query = encodeURIComponent(destination.Destination + ' ' + destination.Country);
    window.open(`https://duckduckgo.com/?q=${query}`, '_blank');
  };

  const addToWorkingList = (des) => {
    const workingList = JSON.parse(localStorage.getItem('workingList')) || [];
    const filteredDes = Object.fromEntries(
      Object.entries(des).filter(([key]) => key !== 'ID')
    );

    // Check if the destination already exists in the working list
    const isDuplicate = workingList.some(
      (item) => item.Destination === filteredDes.Destination
    );

    if (!isDuplicate) {
      const updatedList = [...workingList, filteredDes];
      localStorage.setItem('workingList', JSON.stringify(updatedList));
      setClicked((prevClicked) => [...prevClicked, des.ID]); // Update clicked state for the specific card
    } else {
      console.log("This destination is already in the working list!");
    }
  }

  const indexOfLastResult = currentPage * no;
  const indexOfFirstResult = indexOfLastResult - no;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const nextPage = () => {
    if (currentPage < Math.ceil(results.length / no)) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div>
      {results && results.length > 0 ? (
        <>
          <div className="map-wrapper">
            <div id="map" className="map"></div>
          </div>
          <div className="pagination">
            <button onClick={prevPage}>Previous</button>
            <span>Page {currentPage} of {Math.ceil(results.length / no)}</span>
            <button onClick={nextPage}>Next</button>
          </div>
          <div className="results-container">
      {currentResults.map((result) => (
        <div key={result.ID} className="result-card">
          <h3 className="result-title">{result.Destination}</h3>
          <p className="result-info">Country: {result.Country}</p>
          <p className="result-info">Region: {result.Region}</p>
          <div className='button-group'>
            {isAuth && <button className="add-button" onClick={() => addToWorkingList(result)}>{clicked.includes(result.ID) ? "Added to List" : "Add to List"}</button>}
            <button onClick={() => toggleExpand(result.ID)}>
              {expandedId === result.ID ? "View Less" : "View More"}
            </button>
            <button onClick={() => addToMap(result)} className="map-button">
              {onMap === result.ID ? "Remove from Map" : "Show on Map"}
            </button>
            <button onClick={() => searchOnDDG(result)} className='ddg-button'>
              Search on DDG
            </button>
          </div>
          

          {expandedId === result.ID && (
            <div className="extra-info">
              {Object.entries(result).map(([key, value]) => (
                key !== 'ID' && key !== 'Destination' && key !== 'Country'  && (
                  <p key={key}><strong>{capitalize(key)}:</strong> {formatValue(value)}</p>
                )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
        </>
      ) : (
        <p style={{ textAlign: "center", color: "#6c757d" }}>
          No results available to show on the map.
        </p>
      )}
    </div>
  );
}

// Helper function to capitalize the first letter of each key
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Optional helper to format values (e.g., array to comma-separated string)
const formatValue = (value) => Array.isArray(value) ? value.join(', ') : value;

export default ResultsContainer;