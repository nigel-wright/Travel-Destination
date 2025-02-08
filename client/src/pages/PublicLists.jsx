import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListCard from '../components/Public/ListCard';
import '../styles/PublicListStyles.css';

function PublicLists() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await axios.get('/api/open/list_destinations');
        // console.log("the response is: ", response.data)
        setLists(response.data);
      } catch (error) {
        console.error("Error fetching public lists", error);
      }
    }
    fetchLists();
  }, []);

  if (lists.length === 0) {
    return (
      <h1>There are currently no public lists</h1>
    )
  }

  return (
    <div className="lists-container">
      {lists.slice(0,10).filter((list) => list.visibility !== false)
            .map((list) => (
              <ListCard key={list._id} list={list} />
      ))}
    </div>
  );
}

export default PublicLists;