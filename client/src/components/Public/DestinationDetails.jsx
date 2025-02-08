import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/PublicListStyles.css';

function DestinationDetails({ ids, listOwner, listID, removeDestination }) {
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(""); 
  const [destination, setDestination] = useState([]);
  const [user, setUser] = useState(""); 

  async function fetchLists() {
    try {
      const response = await axios.get(`/api/open/list_destinations/${ids}`);
      setDestination(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching public lists", error);
    }
  }

  useEffect(() => {
    // Fetch the list
    if (ids) {
      fetchLists();
    }

    // Set the user
    const users = JSON.parse(localStorage.getItem('user'));
    setUser(users);
  }, [ids]);

  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <li className="destination-item">
      <h4>{destination.name || destination.destination}</h4>
      <p>Region: {destination.region}</p>
      <p>Country: {destination.country}</p>

      <button onClick={toggleShowMore}>
        {showMore ? "Hide Info" : "Show More Info"}
      </button>
      {user && user.username === listOwner && (
        <button onClick={() => removeDestination(listID, destination._id)}>
          Remove Destination
        </button>
      )}      

      {showMore && (
        <div className="extra-info">
        <p>Destination: {destination.destination}</p>
        <p>Region: {destination.region}</p>
        <p>Country: {destination.country}</p>
        <p>Category: {destination.category}</p>
        <p>Latitude: {destination.latitude}</p>
        <p>Longitude: {destination.longitude}</p>
        <p>Approximate Annual Tourists: {destination.approximateAnnualTourists}</p>
        <p>Currency: {destination.currency}</p>
        <p>Majority Religion: {destination.majorityReligion}</p>
        <p>Famous Foods: {Array.isArray(destination.famousFoods) ? destination.famousFoods.join(", ") : "N/A"}</p>
        <p>Language: {destination.language}</p>
        <p>Best Time to Visit: {destination.bestTimeToVisit}</p>
        <p>Cost of Living: {destination.costOfLiving}</p>
        <p>Safety: {destination.safety}</p>
        <p>Cultural Significance: {destination.culturalSignificance}</p>
        <p>Description: {destination.description}</p>
      </div>
      )}
    </li>
  );
}

export default DestinationDetails;