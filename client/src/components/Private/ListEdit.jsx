import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import api from '../../api';
import axios from 'axios';
import '../../styles/ListActions.css';
import DestinationDetails from '../public/DestinationDetails';

function ListEdit() {
    const navigate = useNavigate(); 
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [isAuth, setAuth] = useState(false);
    const [error, setError] = useState("")
    const [user, setUser] = useState("")
    const [id, setID] = useState("")
    const [success, setSuccess] = useState(""); // For showing success messages

    // List state with more comprehensive initial structure
    const [list, setList] = useState({
      _id: "",
      destinations: [], 
      listName: "",
      description: "",
      visibility: false,
      owner: ""
  });

  // State for form inputs to allow editing
  const [listName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("");

     // Fetch list details
     const fetchListDetails = async (listId) => {
      try {
          // If list details are passed in location state, use those
          if (location.state && location.state.list) {
              const receivedList = location.state.list;
              setList(receivedList);
              // Set form inputs from received list
              setName(receivedList.listName);
              setDescription(receivedList.description);
              setVisibility(receivedList.visibility);
              return;
          }

          // Otherwise, fetch from API
          const response = await axios.get(`/api/open/list_destinations/${listId}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          
          const fetchedList = response.data;
          setList(fetchedList);
          setName(fetchedList.listName);
          setDescription(fetchedList.description);
          setVisibility(fetchedList.visibility ? "1" : "0");
      } catch (error) {
          console.error("Error fetching list details", error);
          setError("Could not fetch list details");
      }
  };

    useEffect(() => {
        // Verify authentication
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const auth = api.verifyCheck(storedUser);
        setAuth(auth);
        setUser(storedUser);

        // Get list ID from location state or params
        const listId = location.state?.id || location.state?.list?._id;
        if (listId) {
            setID(listId);
            fetchListDetails(listId);
        }
    }, [location.state])

    const handleDelete = async (e) => {
      e.preventDefault();
        try {
          const response = await axios.delete("/api/secure/delete_list", {
            data: { id:list._id, owner:user.username},  
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });
    
          if (response.status !== 200) {
            console.log("we broke")
            setError(response.data)
            return; 
          }
          console.log("it worked!")
          navigate("/auth-list")
        } catch (err) {
            console.log("super broken!", err)
            return;
        }
    }

    const removeDestination = async (listID, destinationID) => {
      try {
        const response = await axios.delete('/api/secure/list/item', {
            data: {
              listID: listID, 
              destinationID: destinationID
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (response.status === 200) {
            // Update the destinations array in the state
            setList((prevList) => ({
                ...prevList,
                destinations: prevList.destinations.filter((id) => id !== destinationID),
            }));
            
            // Optional: Add a success message
            setError("Destination successfully removed");
        } else {
            setError("Failed to remove destination");
        }
        } catch (err) {
          console.log("There was an error when deleting a list item: ", err);
        }
        fetchLists(); 
      }

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isAuth) {
        setError("You must be logged in to update the list.");
        return;
      }

      try {
        const updatedList = {
          ...list,
          listName,
          description,
          visibility: visibility === '1',
        };
  
        const response = await axios.patch('/api/secure/update_list', updatedList, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.status === 200) {
          console.log('List updated successfully!');
          setError("")
          setSuccess("List updated successfully!"); // Set success message
        } else {
          setError(response.data);
        }
      } catch (err) {
        console.error('Error updating list:', err);
        setError('An error occurred while updating the list.');
      }
    }

    const goBack = () => {
      navigate("/auth-list")
    }

    // Modal controls
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

  return (
    <div>
        <div>
            <div>
            <form onSubmit={handleSubmit}>
            <label htmlFor="name">List Name</label>
            <input
            type="text"
            id="name"
            value={listName}
            onChange={(e) => setName(e.target.value)}
            required/>
            
            <label htmlFor="description">Description</label>
            <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}/>

            <label htmlFor="visibility">Select a Visibilty</label>
            <select
            id="visibility"
            value={visibility === "1" ? "1" : "0"}
            onChange={(e) => setVisibility(e.target.value)}
            required>
                <option value="">Select a Visibility...</option>
                <option value="1">Public</option>
                <option value="0">Private</option>
            </select>

            <label>Destinations</label>
            <ul>
            {list.destinations && list.destinations.length > 0 ? (
              list.destinations.map((ids) => (
              <DestinationDetails key={ids} ids={ids} listOwner={list.owner} listID={list._id} removeDestination={removeDestination}/>
            ))
          ) : (
            <p>No destinations in this list.</p>
            )}
            </ul>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {!success && <button type="submit">Update List</button>}
            {success && <button onClick={goBack}>Go Back to List</button>}
            </form>
            <button onClick={openModal} style={{backgroundColor: 'red'}}>Delete List</button>
          </div>

            <Modal
            isOpen={open}
            onRequestClose={closeModal}
            className="modal-content"
            overlayClassName="modal-overlay"
            contentLabel="Delete Modal">
            <h2>Are you sure you want to delete this list?</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <button onClick={handleDelete}>Yes</button>
            <button onClick={closeModal}>No</button>
            </Modal>
        </div>
    </div>
  )
}

export default ListEdit