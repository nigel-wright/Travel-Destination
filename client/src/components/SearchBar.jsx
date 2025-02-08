import React from 'react'
import { useState } from 'react'
import '../styles/ResultsContainer.css';

function Search({ onSearch }) {
  const [name, setDestination] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [no, setNoResults] = useState(5)

  const handleSearch = () => {
    onSearch({ name, region, country, no });
  };
  
  return (
    <div className='search-bar'>
      <select onChange={(e) => setNoResults(e.target.value)}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
        <option value={50}>50</option>  
      </select>
      <input
        type="text"
        placeholder="Destination"
        value={name}
        onChange={(e) => setDestination(e.target.value)}
        className="search-input"
      />
      <input
        type="text"
        placeholder="Region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="search-input"
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">Search</button>
    </div>
  )
}

export default Search