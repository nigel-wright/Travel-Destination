import React, { useEffect } from 'react';
import '../styles/Map.css';
import L from 'leaflet'; 
import "leaflet/dist/leaflet.css";

// Delete when the time is right \\
function MapContainer({ setMapInstance }) {
    useEffect(() => {
        // Ensure the map is only initialized once
        const map = L.map('map').setView([43.6532, -79.38], 8);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    

        return() => {
          setMapInstance(map)
          map.remove(); // Cleanup map on component unmount
        };
    }, []);
  
    return (
        <div id="map" className="map"></div>
    )
  }

export default MapContainer