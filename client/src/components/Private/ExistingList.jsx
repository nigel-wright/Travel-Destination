import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Modal from 'react-modal';
import api, { verifyCheck } from '../../api';

function ExistingList() {
  const [lists, setLists] = useState([]);
  const [isAuth, setAuth] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [workingList, setWorkingList] = useState([]);
  const [update, setUpdate] = useState(false); 
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(""); 

  useEffect(() => {
    const verify = api.verifyCheck(JSON.parse(localStorage.getItem('user')));
    setAuth(verify);
    if (verify) {
      const person = JSON.parse(localStorage.getItem('user'))
      setUser(person)
    }

    const currList = localStorage.getItem("workingList") || []; 
    if (currList.length > 0) {
      setWorkingList(JSON.parse(currList));
    }
  }, [])
  
  useEffect(() => {
    let isMounted = true;
    async function fetchLists() {
      try {
        const response = await axios.get('/api/open/list_destinations');

        if (isMounted){
          setLists(response.data);
          console.log("The list has been set!")
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    }
  
    fetchLists();
    return () => {
      isMounted = false; 
    };
  }, []);

  const[id, setID] = useState("");
  const updateList = (id) => {
    setUpdate(true)
    if (workingList.length > 0) {
      setID(id);
      openModal(); 
      setError("")
      return
    }
    setError("There are no items in the working list!")
    openModal()
    return;
  }

  const addToList = async (id, workList) => {
    try {
      const response = await axios.patch("/api/secure/add_destination", 
        {
          id: id, 
          workingList: workList, 
        }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )

      // Handle success
    if (response.status === 200) {
      console.log("The response from add is: ", response.data);

      // Clear previous errors
      setError("");

      // Set success message
      setSuccess("Your list has been updated!");

      // Clear working list
      localStorage.removeItem("workingList");
      setWorkingList([]);
    } else {
      // Handle unexpected response status
      setError(response.data || "An unexpected error occurred.");
    }
    } catch (err) {
      // Display error message to the user
    if (err.response) {
      // Server returned an error response (e.g., 400, 500)
      setError(err.response.data || "There was an error when updating the list!");
    } else if (err.request) {
      // Request was made but no response received
      setError("No response received from the server. Please try again later.");
    } else {
      // Something else caused the error
      setError("An unexpected error occurred.");
    }
    }
  }

  const openModal = () => {
    setOpen(true)
}

const closeModal = () => {
    setOpen(false)
}

  return (
    <div>
      <div>
        {lists && isAuth && lists.length > 0 ? (
          <>
          <h1>All the available lists are here</h1>
          <ul>
          {lists.filter((list) => list.owner === user.username)
                  .map((list, idx) => (
                    <li key={idx}>
                      <h2>{list.listName}</h2>
                      <p><strong>No of Destinations: </strong>{list.noOfDestinations}</p>
                      <button onClick={() => updateList(list._id)}>Update List</button>
                      {error && (
                        <Modal 
                        isOpen={open}
                        onRequestClose={closeModal}
                        className="modal-content"
                        overlayClassName="modal-overlay"
                        contentLabel="Error Modal">
                          <h3>{error}</h3>
                          <button onClick={closeModal}>OK</button>
                        </Modal>
                      )}
                    </li>)
          )}
        </ul>
        <Modal
        isOpen={open}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
        contentLabel="List Modal">
        <h2>You are Adding: </h2>
        <ul>
          {workingList && (
            <ul>
             {workingList.map((item, idx) => (
              <li key={idx}>
                <h2>{item.Destination}</h2>
                <p>{item.Country}</p>
                <p>{item.Region}</p>
              </li>
             ))}
            </ul>
          )}
        </ul>
        {!success && (
          <>
          <button onClick={() => addToList(id, workingList)}>ADD</button>
          <button onClick={closeModal}>Cancel </button>
          </>
        )}

        {success && (
          <>
          <p style={{color: 'green'}}>{success}</p>
          <button onClick={() => closeModal()}>Done</button>
          </>
        )}
        </Modal>
        </>
        ) : (
          <h1>You have no Previous Lists</h1>
        )}
      </div>
    </div>
  )
}

export default ExistingList