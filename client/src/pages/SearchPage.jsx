import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ResultsContainer from '../components/ResultsContainer';

function SearchPage() {
    const [results, setResults] = useState([]);
    const [no, setNoResults] = useState(0); 

    const handleSearch = async (query) => {
        try {
            const { name, region, country, no} = query; 
            setNoResults(no)
            const response = await axios.get('/api/open/search', {
                params: { name, region, country }, 
            })

            setResults(response.data);
        } catch (err) {
            console.log("There was an error when fetching search results: ", err)
            setResults([])
        }
    }

    return (
      <div>
        <SearchBar onSearch={handleSearch} />
        <ResultsContainer results={results} no={no}/>
    </div>
    );
  }
  
  export default SearchPage;