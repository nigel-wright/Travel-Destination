import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Review() {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const [rating, setRating] = useState("");
  const [comment, setComments] = useState("");
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState("")
  const [done, setDone] = useState(false); 

  // Get the listName that is being passed
  const { listName } = location.state || {}; 

  // Add check for listName
  if (!listName) {
    return <div>No list selected. Please go back and select a list.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rate = parseInt(rating, 10);
    if (rate < 0 || rate > 5 || isNaN(rate) ) {
      return setError("Review between 0 and 5.")
    }

    try {
      const response = await axios.post("/api/secure/add_review",
        { listName: listName, rating: rate, comment: comment || ''}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      if (response.status === 200) {
        setDone(true)
        setSuccess("All, your review has been submitted!")
      } else {
        setError("Something went wrong when submitting your review.")
        setSuccess("");
      }

    } catch (err) {
      console.log("There was an error when submitting the review!")
      setSuccess("");
      setError(err.response.data)
      return;
    }
  }

  const backToList = () => {
    return navigate("/auth-list");
  }

  return (
        <div className="review-container">
          <h1>Leave a review</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="review">Review</label>
            <input
                type="number"
                id="review"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="0" 
                max="5" 
                required
            />

            <label htmlFor="comment">Comments (optional)</label>
            <input
                type="text"
                id="comment"
                placeholder='Type your comments here'
                value={comment}
                onChange={(e) => setComments(e.target.value)}
            />

            {!done && <button type="submit">Submit Review</button>}
          </form>

            {done && <button onClick={backToList}>Go back to Lists!</button>}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green'}}>{success}</p>}
        </div>
  );
}

export default Review