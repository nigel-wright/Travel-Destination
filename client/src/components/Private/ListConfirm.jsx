import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ListActions.css';

function ListConfirm() {
    const navigate = useNavigate(); 
    const [name, setName] = useState(""); 
    const [description, setDesription] = useState("")
    const [visibility, setVisibility] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [destination, setDestination] = useState([])

    useEffect(() => {
        const workingList = JSON.parse(localStorage.getItem('workingList'))
        if (!localStorage.getItem('workingList')) {
            console.log("There is no working list in local storage")
        }
        setDestination(workingList)
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem('user'))

            console.log("name is: ", name)
            console.log("owner is: ", user.username)
            console.log("description is: ", description)
            console.log("visibility is: ", visibility)

            const response = await axios.post("/api/secure/create_list", 
                {
                    listName:name, 
                    owner: user.username, 
                    description: description, 
                    destinations: destination,
                    visibility: visibility === "1",
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            ); 

            console.log(response.data)

            if (response.status === 200) {
                setSuccess("Congrats, you posted a list!")
                localStorage.removeItem('workingList');
            } else {
                setError(response.err)
            }
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const backToList = () => {
        navigate("/auth-list");
        return ;
      }

    console.log("the success is: ", success)
  return (
    <div>
        <div>
            <h1>Confirm your list!</h1>
            {!success && (<form onSubmit={handleSubmit}>
                <label htmlFor="list">List Name</label>
                <input
                type="text"
                id="listname"
                value={name}
                placeholder='List Name goes here...'
                onChange={(e) => setName(e.target.value)}
                required
                />

                <label htmlFor="visibility">Select a Visibilty</label>
                <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                required
                >
                    <option value="1">Public</option>
                    <option value="0">Private</option>
                </select>

                <label htmlFor="description">Description (optional)</label>
                <textarea
                id="comment"
                placeholder='Describe the contents of your list here...'
                value={description}
                onChange={(e) => setDesription(e.target.value)}
                rows="4"
                cols="50"
                />

                <button type="submit" style={{backgroundColor:'green'}}>Upload List</button>
            </form>
            )};

            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && (
                <>
                <p style={{color: 'green'}}>{success}</p>
                <button onClick={backToList}>Back to List</button>
                </>
            )}
        </div>
    </div>
  )
}

export default ListConfirm