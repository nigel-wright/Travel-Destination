import React, { useEffect, useState } from 'react'
import axios from 'axios';
import api from '../api';
import '../styles/Admin.css';

function AdminPage() {
    const [users, setUsers] = useState([]); 
    const [person, setPerson] = useState("")
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(false); 
    const [admin, setAdmin] = useState(false);
    const [disabled, setDiabled] = useState(false);
    const [isAuth, setAuth] = useState(false); 
    useEffect(() => {
        const verify = api.verifyCheck(JSON.parse(localStorage.getItem('user')))
        const admin = api.adminCheck(JSON.parse(localStorage.getItem('user')))
        if (verify === true && admin === true) {
            setAuth(true)
            setPerson(JSON.parse(localStorage.getItem('user')))
        }
    }, [])

    const getFilter = async (filterValue = "") => {
        if (!isAuth) {
            setError("You are NOT authoized to do change anything.")
            return; 
        }

        setSelected(true);
        const filter = filterValue || document.querySelector("select").value;

        setSelected(true)
        if (filter === "0") {
            setError("Please select a valid option.");
            return;
        }

        if (filter === 'privileges') {
            setAdmin(true)
            setDiabled(false)
        } else if (filter === 'disable') {
            setDiabled(true)
            setAdmin(false)
        }

        try {
            const response = await axios.get(`/api/admin/${filter}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })

            if (response.status !== 200) {
                setError(response.data); 
            } 

            setUsers(response.data)
            setError("");
        } catch (err) {
            return setError("There was an error with: " + filter)
        }
    }

    const toggleAdminPrivileges = async (id) =>{
        try {
            const response = await axios.put('/api/admin/privileges/set', { id }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            ); 

            if (response.status !== 200) {
                setError(response.data)
                return;
            }
            console.log("They now have admin privileges!")
            getFilter("privileges");
            setError("");
        } catch (err) {
            console.log("There was an error when changing admin privilages!")
        }
    }

    const toggleDisabledPrivileges = async (id) => {
        try {
            const response = await axios.put('/api/admin/disable/set',
                {
                id
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            ); 

            if (response.status !== 200) {
                setError(response.data)
                return;
            }
            console.log("They now have been disabled/enabled!")
            getFilter("disable");
            setError("");
        } catch (err) {
            console.log("There was an error when changing disabled privilages!")
        }
    }

  return (
        <div className='admin-page'>
            <h1>Welcome Admin</h1>
            <p>This is a powerful page, you can change lives here!</p>
            {!selected && <h2>What would you like to do?</h2>}
            <select onChange={(e) => getFilter(e.target.value)}>
                <option value={0}>Select an option...</option>
                <option value={"privileges"}>Add Privileges</option>
                <option value={"disable"}>Disable User</option>
            </select>
            {error && <p className='error-message' style={{color: 'red'}}>{error}</p>}

            {users && selected && admin && (
                <ul>
                    {users.filter((item) => item.username !== person.username)
                        .map((user, idx) =>  (
                        <li key={idx}>
                            <p>
                            <strong>Username:</strong> {user.username}
                            <br />
                            <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
                            </p>
                            <button onClick={() => toggleAdminPrivileges(user._id, user.isAdmin)}>
                            {user.isAdmin ? "Remove Admin" : "Grant Admin"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {users && selected && disabled && (        
                <ul>
                    {users.filter((item) => item.username !== person.username)
                        .map((user, idx) =>  (
                        <li key={idx}>
                            <p>
                            <strong>Username:</strong> {user.username}
                            <br />
                            <strong>Disabled:</strong> {user.isDisabled ? "Yes" : "No"}
                            </p>
                            <button onClick={() => toggleDisabledPrivileges(user._id, user.isDisabled)}>
                            {user.isDisabled ? "Enable User" : "Disable User"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
  )
}

export default AdminPage