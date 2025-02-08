import React, { useState, useEffect } from 'react'
import axios from 'axios';
import api from '../../api';

function ReviewCard({ reviewID, updateHiddenCount }) {
    const [error, setError] = useState("");
    const [review, setReview] = useState(""); 
    const [isAuth, setAuth] = useState(false); 

    useEffect(() =>{
        const fetchReview = async () => {
            try {
                const response = await axios.get(`/api/secure/get_review/${reviewID}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })

                if (response.status === 200) {
                    setReview(response.data)
                    updateHiddenCount(response.data.hidden ? 1 : 0);
                } else {
                    return setError("Error getting the review!")
                }

                setReview(response.data)
            } catch (err) {
                console.log("There was an error when fetching a review")
            }
        }
        if (reviewID) {
            fetchReview(); 
        }
    }, [reviewID]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const admin = api.adminCheck(user); 
        const verify =  api.verifyCheck(user);
        if (admin === true && verify === true) {
            setAuth(true)
        }
    }, [])

    const toggleReview = async (id) => {
        console.log("hi, i was called!")
        try { 
            const response = await axios.put('/api/admin/hide/set',
                {
                    id
                },  
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            )

            if (response.status == 200) {
                setReview(response.data.review)
                console.log("successful change!")
            } else {
                setError("Could not add a review!")
            }
        } catch (err) {
            console.log("There was an error when toggling review!")
            setError(err.response.data)
        }
    }

  return (
    <> 
    {!error && !isAuth && (
        !review.hidden ? (
        <li key={review._id}>
        <p><strong>Review: </strong>{review.rating}</p>
        {review.comment && <p><strong>Comment: </strong>{review.comment}</p>}
        </li>
    ) : (
        <li>
            <p>REVIEW HAS BEEN HIDDEN</p>
        </li>
        )
    )}

    {!error && isAuth && (
        <li key={review._id}>
        <p><strong>Review: </strong>{review.rating}</p>
        {review.comment && <p><strong>Comment: </strong>{review.comment}</p>}
        <button onClick={() => toggleReview(review._id)}>
            {review.hidden ? "Show" : "Hide"}
        </button>
        </li>
    )}

    {error && <p style={{color: 'red'}}>{error}</p>}
    </>
  );
}

export default ReviewCard