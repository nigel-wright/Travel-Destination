import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewCard from '../Private/ReviewCard';
import '../../styles/PublicListStyles.css';
import DestinationDetails from '../public/DestinationDetails';
import api from '../../api';

function ListCard({ list }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isAuth, setAuth] = useState(false);
  const [seeReviews, setSeeReviews] = useState(false); 
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      const auth = api.verifyCheck(storedUser);
      setAuth(auth === true);
    }
  }, [])

  const toggleExpand = () => {
    console.log("Expanding the list now!")
    setExpanded(!expanded);
  }

  const editList = (id) => {
    navigate('/edit-list', { state: { list: list, id: list._id }});
  };

  const addReview = () => {
    navigate('/add-review', { state: { listName: list.listName } });
  }

  const viewReviews = () => {
    setSeeReviews(!seeReviews); 
  }

  const [hiddenCount, setHiddenCount] = useState(0);
  const updateHiddenCount = (change) => {
    setHiddenCount((prev) => prev + change);
  };

  console.log("hidden count is: ", hiddenCount)

  return (
    <div className="list-card">
      <h3>{list.listName}</h3>
      <p>Creator: {list.owner}</p>
      <p>Number of Destinations: {list.noOfDestinations}</p>
      <p>Average Rating: {list.rating > 0 ? list.rating : "No current reviews"}</p>
      {isAuth && (
        <div className='review-buttons'>
          {list.owner !== user.username && <button onClick={addReview}>Add Review</button>}
          {list.rating > 0 && <button onClick={viewReviews}>{!seeReviews ? "View Review" : "Less Review"}</button>}
        </div>
      )}
      {seeReviews && (
        <>
        <div className='reviews-container'>
          <ul>
            {list.review.map((rev) => (
              <ReviewCard key={rev._id} reviewID={rev} updateHiddenCount={updateHiddenCount}/>
            ))}
          </ul>
        </div>
        </>
      )}
      <button onClick={toggleExpand}>
        {expanded ? "Hide Details" : "View More"}
      </button>

      {expanded && (
        <div className="list-details">
          <p>{list.description}</p>
          <h4>Destinations:</h4>
          <ul>
            {list.destinations.map((ids) => (
                <DestinationDetails key={ids} ids={ids}/>
              ))
            }
          </ul>
        </div>
      )}
      {list.owner === user.username && (<button onClick={() => editList(list._id)}style={{backgroundColor: 'green'}}>Edit List</button>)}
    </div>
  );
}

export default ListCard;