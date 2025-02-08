import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ListCard from '../components/Public/ListCard';
import '../styles/PrivateListStyles.css';

function PrivateLists() {
  const navigate = useNavigate(); 
  const [lists, setLists] = useState([]);
  const [workingList, setWorkingList] = useState([]); 
  const [error, setError] = useState("");
  const [user, setUser] = useState("");

  const [viewAll, setViewAll] = useState(true); // Set the default to true
  const [viewPersonal, setViewPersonal] = useState(false);
  const [createListOpen, setCreateListOpen] = useState(false);

  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await axios.get('/api/open/list_destinations');
        if (response.status === 200) {
          setLists(response.data);
          setError("");
        } else {
          setError(response.data);
        }
      } catch (error) {
        console.error("Error fetching public lists:", error);
      }
    }

    fetchLists();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    const storedWorkingList = JSON.parse(localStorage.getItem('workingList'));
    if (storedWorkingList) {
      setWorkingList(storedWorkingList);
    }
  }, []);

    const listCount = lists.filter((item) => item.owner === user.username).length; 
    console.log("list count is: ", listCount)

    const confirmList = () => navigate("/confirm-list");
    const addExisting = () => navigate("/existing-list");

    const toggleView = (view) => {
        // Ensure only one view is open at a time
        setCreateListOpen(view === "createList");
        setViewAll(view === "viewAll");
        setViewPersonal(view === "viewPersonal");
      };

    const deleteFromWorkingList = (name) => {
        const updatedWL = workingList.filter((item) => item.Destination !== name);
        setWorkingList(updatedWL)
        localStorage.setItem('workingList', JSON.stringify(updatedWL));
    }

  return (
    <>
    <div className="private-lists">
        <div className="action-buttons">
            <button onClick={() => toggleView("createList")}>
                {createListOpen ? "Close Create List" : "Create New List"}
            </button>
            <button onClick={() => toggleView("viewAll")}>
                {viewAll ? "Hide Others' Lists" : "View Others' Lists"}
            </button>
            <button onClick={() => toggleView("viewPersonal")}>
                {viewPersonal ? "Hide Your Lists" : "View Your Lists"}
        </button>
        </div>
        
        {createListOpen  && (
            <div className="create-list-container">
                <h2>Create a New List</h2>
                {workingList && workingList.length > 0 ? (
                    <div className="working-list">
                        <h3>Working List</h3>
                        <ul>
                {workingList.map((item, index) => (
                  <li key={index}>
                    <p>Destination: {item.Destination}</p>
                    <p>Region: {item.Region}</p>
                    <p>Country: {item.Country}</p>
                    <button style={{backgroundColor: 'red'}} onClick={() => deleteFromWorkingList(item.Destination)}>Delete</button>
                  </li>
                ))}
                        </ul>
                        {listCount < 20 && <button onClick={confirmList}>Create List</button>}
                    </div>
                ) : (
                    <p>No items in your working list.</p>
                )}
                <button onClick={addExisting}>Add to Existing List</button>
            </div>)}

            {viewAll && (
        <div className="others-lists">
          <h2>Others' Lists</h2>
          {lists
            .filter((list) => list.visibility && user && list.owner !== user.username)
            .map((list) => (
              <ListCard key={list._id} list={list} />
            ))}
        </div>
      )}

      {viewPersonal && (
        <div className="your-lists">
          <h2>Your Lists</h2>
          {lists
            .filter((list) => list.owner === user.username)
            .map((list) => (
              <ListCard key={list._id} list={list} />
            ))}
        </div>
      )}
        {error && <p className="error-message">{error}</p>}
        </div>
    </>
  );
}

export default PrivateLists;